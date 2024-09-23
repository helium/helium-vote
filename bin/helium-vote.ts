#!/usr/bin/env npx ts-node

const { hideBin } = require("yargs/helpers");

const args = hideBin(process.argv);
const script = args[0];

require(__dirname + `/../scripts/${script}`)
  .run(args.filter((arg: any) => arg !== script))
  .catch((err: any) => {
    console.error(err);
    process.exit(1);
  })
  .then(() => process.exit());
