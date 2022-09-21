const { default: PromisePool } = require("@supercharge/promise-pool")
    , cache = require("./cache")
    , { chain, maxBy } = require("lodash")
    , fetch = require("node-fetch")
    , pg = require('pg')
    , url = require('url');

const dev = process.env.NODE_ENV !== "production";
const server = dev ? "http://localhost:3000" : "https://www.heliumvote.com";

var db = url.parse(process.env.BLOCKCHAIN_DATABASE_URL),
    dbAuth = db.auth,
    dbUsername = dbAuth.split(':')[0],
    dbPassword = dbAuth.split(':')[1],
    dbName = db.pathname.replace('/', '');

const pool = new pg.Pool({
  user: dbUsername,
  host: db.hostname,
  database: dbName,
  password: dbPassword,
  port: db.port,
  // ssl: true, // todo: expired?
  ssl: { rejectUnauthorized: false },
});

const fetchAllVotes = async () => {
  const votes = await fetch(`${server}/api/votes`);
  return await votes.json();
};

const fetchBlockHeight = async () => {
  const query = `
  select height
  from blocks
  order by height desc
  limit 1
  `;

  const dbClient = await pool.connect();
  try {
    const res = await dbClient.query(query);
    return res.rows[0].height;
  } catch (err) {
    console.error(err.stack);
    return 0;
  } finally {
    dbClient.release()
  };
};

const fetchTalliesForVote = async (addresses, deadline) => {
  query = `
  select t.block
       , t.fields->>'payer' payer
       , ta.actor as payee
  from transaction_actors ta
      left join transactions t on ta.transaction_hash = t.hash
  where ta.block <= $1
  and ta.actor = ANY($2)
  and ta.actor_role = 'payee'
  and t.type IN ('token_burn_v1')
  `;

  const dbClient = await pool.connect();
  try {
    console.log("Fetching tallies for addresses:", addresses.join(", "));
    const res = await dbClient.query(query, [deadline, addresses]);
    return res.rows.map(res => {
      return { height: res.block, payer: res.payer, payee: res.payee };
    });
  } catch (err) {
    console.error(err.stack);
    return [];
  } finally {
    dbClient.release()
  };
};

const filterLatestTallies = (tallies) => {
  return chain(tallies)
      .groupBy((tally) => tally.payer)
      .map((value, key) => {
        // get each payer's latest txn
        const txn = maxBy(value, "height");
        return txn;
      })
      .value();
};

const fetchWeightsForTallies = async (tallies, deadline) => {
  const weights = [];
  const currentQuery = `
  select last_block
       , (balance + staked_balance)::numeric / 100000000 as weight
  from account_inventory a
  where a.address = $1
  limit 1
  `;

  const historicalQuery = `
  select (balance + staked_balance)::numeric / 100000000 as weight
  from accounts a
  where a.address = $1
    and a.block <= $2
  order by a.block desc
  limit 1
  `;

  await PromisePool.for(tallies).withConcurrency(3).process(async ({ payer, payee }) => {
    const dbClient = await pool.connect();
    try {
      // try current value first
      const currentRes = await dbClient.query(currentQuery, [payer]);
      var { last_block, weight } = currentRes.rows[0];

      if (last_block <= deadline) {
        weights.push({ payer, payee, weight });
        return;
      }

      // try historical query if past deadline
      const historicalRes = await dbClient.query(historicalQuery, [payer, deadline]);
      var { weight } = historicalRes.rows[0];

      weights.push({ payer, payee, weight });
    } catch (err) {
      console.error(err.stack);
    } finally {
      dbClient.release()
      if (weights.length % 100 === 0) console.log("Loaded", weights.length, "weights.");
    };
  });

  return weights;
}

const calculateResultsForVote = async (id, outcomes, deadline) => {
  console.log("Calculating results for vote:", id);
  const tallies = await fetchTalliesForVote(outcomes.map(({address}) => address), deadline);
  if (tallies.length == 0) {
    console.log("No tallies to report for:", id);
    return {};
  }

  console.log("Loaded", tallies.length, "tallies for", id);

  const latestTallies = filterLatestTallies(tallies);
  console.log("Filtered to", latestTallies.length, "latest tallies for", id);
  const voteWeights = await fetchWeightsForTallies(latestTallies, deadline);

  const outcomesResults = [];

  // loop through all different outcomes (e.g. chocolate, vanilla, strawberry)
  outcomes.map((outcome) => {
    const { address } = outcome;

    // initialize totals
    let summedVotedHnt = 0.0;
    let votingWallets = 0;

    voteWeights.forEach(async ({ payee, weight }) => {
      if (payee != address) return;
      summedVotedHnt += parseFloat(weight);
      votingWallets++;
    });
    console.log("tracking balance for vote:", id, "outcome:", address, "total:", summedVotedHnt, "wallets:", votingWallets);
    outcome.hntVoted = summedVotedHnt;
    outcome.uniqueWallets = votingWallets;
    outcomesResults.push(outcome);
  });

  return outcomesResults;
};

const checkVotes = async () => {
  const height = await fetchBlockHeight();
  const votes = await fetchAllVotes();

  const activeVotes = votes.filter(({ deadline }) => deadline > height);

  await PromisePool.withConcurrency(1).for(activeVotes).process(async ({ id, outcomes, deadline}) => {
    const results = {}
    results.outcomes = await calculateResultsForVote(id, outcomes, deadline);
    results.timestamp = Date.now();

    console.log("Setting cache for: ", id);
    await cache.set(id, results);
  });

  await pool.end()
  return process.exit(0);
};

checkVotes();
