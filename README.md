# Helium Vote

A straw poll website that enables a simple straw-poll for Helium related initiatives. This is a simple polling mechanism for voting on HIPs in the Helium community.

## Features

* A vote can be created by opening a PR against this repository.
* A Helium account can specify an outcome preference by burning a small amount of DC against an address.
* A block height deadline is set for the tally to be taken.
* Votes are tallied by the HNT voting "power" of the account. One HNT = 1 Vote.
* DCs sent to an outcome address will be flushed from the system after voting is complete.

## Setup/Contributing

Bootstrap and configure your .env

```
cp .env.sample .env
# edit and set READ_ONLY_REDIS_URL
```

**(TODO what exactly is READ_ONLY_REDIS_URL pointing at? Some kind of Redis HTTP API? How does one enable that? etc)**

Install dependencies using `yarn`:

```sh
yarn install
```

Run the app:

```sh
yarn dev
```
