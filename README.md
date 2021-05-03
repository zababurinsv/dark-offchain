# Darkdot Offchain Storage & API [DarkDot](https://github.com/dappforce)

Darkdot is a set of Substrate pallets with web UI that allows anyone to launch their own decentralized censorship-resistant e-commerce shop aka storefront.
Darkdot developers aim to bring a real decentralized and easy to use e-commerce system people may enjoy.
Darkdot chain aims to become a parachain and wishes to connect with other communities via Polkadot relay chain.

To learn more about Darkdot, please visit [Darkdot Network](http://darkdot.network).


## Setup

```sh
# Install Node.js dependencies
yarn

# Compile TypeScript
yarn build

# Run
yarn start
```

## Available scripts

+ `clean` - remove coverage data, Jest cache and transpiled files,
+ `build` - transpile TypeScript to ES6,
+ `start` - run subscribe and express-api servers,
+ `api` - run only express-api server,
+ `subscribe` - run only subscribe server

## Building from Docker

### Easiest start

To start Darkdot offchain storage separately (you should have docker-compose):

```sh
cd docker/
./compose.sh
```

It will start 3 containers: postgres, elasticsearch and offchain itself.

### Start all parts of Darkdot at once with [Darkdot Starter](https://github.com/dappforce/dappforce-darkdot-starter)

## License

Darkdot is forked from the great Subsocial project by [DappForce](https://github.com/dappforce)

Darkdot is [GPL 3.0](./LICENSE) licensed.
