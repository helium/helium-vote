#!/usr/bin/env ts-node-script

const { hideBin } = require("yargs/helpers");

const args = hideBin(process.argv);
const script = args[0];

require(__dirname + `/../scripts/${script}`)
  .run(args.filter((arg) => arg !== script))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .then(() => process.exit());
