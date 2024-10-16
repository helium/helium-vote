# Helium Vote

A straw poll website that enables a simple straw-poll for Helium related initiatives. This is a simple polling mechanism for voting on HIPs in the Helium community.

## Features

* A vote can be created by opening a PR against this repository.
* A Helium account can specify an outcome preference by burning a small amount of DC against an address.
* A block height deadline is set for the tally to be taken.
* Votes are tallied by the HNT voting "power" of the account. One HNT = 1 Vote.
* DCs sent to an outcome address will be flushed from the system after voting is complete.

## Developing Locally (with proxies)

### 1. Localnet from helium-program-library

Clone helium-program-library. Run 

```
anchor localnet
```

Then run

```
./scripts/bootstrap.sh
```

This will create a bunch of keypairs in packages/helium-admin-cli/keypairs. You will need to get the addresses of the HNT, IOT, and MOBILE tokens it created. Then update constants.js in `spl-utils`.

### 2. Make sure modgov idls deployed

Clone modular-governance.

```
./scripts/upgrade-idls.sh
```

### 3. Bootstrap the Helium DAO

In this repo

```
./bin/helium-vote.ts bootstrap --name Helium --mint APqAVo5q9erS8GaXcbJuy3Gx4ikuSzXjzY4SnyppPUm1 --authority $(solana address)
```

### 4. Create a proposal

```
./bin/helium-vote.ts create-proposal --name HIP 110: Proxy Voting --proposalUri https://gist.githubusercontent.com/hiptron/4404ea1e78ed8c92ba5001df45740386/raw/88adb21a40475dd7b6673e816492357fb425c72a/HIP-110-HNT-Vote-Summary.md --orgName Helium
```

### 5. Run the account-postgres-sink for helium-vote-service

Make sure you have a postgres running. I just have a script to run it via docker:

```
#!/bin/bash

docker volume create -o size=10GB pgdata
docker run --shm-size=1g -it --rm -p 5432:5432 --name postgres -e POSTGRES_PASSWORD=postgres -d -v pgdata:/var/lib/postgresql/data postgres:latest

docker logs -f postgres
```

In helium-program-library, cd `packages/account-postgres-sink-service`

Update the `.env` to the following:

```
SOLANA_URL=http://localhost:8899
PGUSER=postgres
PGPASSWORD=postgres
USE_SUBSTREAMS=false
PHOTON_URL=https://photon.komoot.io
USE_KAFKA=false
PROGRAM_ACCOUNT_CONFIGS=/path/to/helium-program-library/packages/account-postgres-sink-service/vote_service_example.json

```

Making sure to update the path to the `vote_service_example.json`

Run

```
yarn dev
```

Then, navigate to `localhost:3000/refresh-accounts`

Every time you make a change to proxies, you will need to re-hit-this endpoint.

### 6. Run the helium-vote service.

cd into helium-program-library/packages/helium-vote-service

Update the .env to:

```
PGDATABASE=postgres
PGUSER=postgres
PGPASSWORD=postgres
```

Then:

```
yarn dev
```

### 7. Run helium-vote on port 3001

In this repo,

```
env PORT=3001 yarn dev
```

Note that if you're using yalc, it's useful to just run:

```
yalc update && rm -rf .next/cache && env PORT=3001 yarn dev
```


### 8. Fund any wallets you're using for testing

```
solana transfer -u http://localhost:8899 exmrL4U6vk6VFoh3Q7fkrPbjpNLHPYFf1J8bqGypuiK 10 --allow-unfunded-recipient
```

Make sure to transfer some fake HNT to whatever wallet you plan to stake with. 
```
spl-token transfer -u http://localhost:8899 <hnt-mint> 100 <your-wallet> --allow-unfunded-recipient --fund-recipient
```
