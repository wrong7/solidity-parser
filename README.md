# Solidity Parser
![version](https://img.shields.io/npm/v/solidityparser "Version")
![npm](https://img.shields.io/npm/dt/solidityparser.svg "Total Downloads")
[![License](https://img.shields.io/badge/license-mit-blue.svg)](https://opensource.org/licenses/MIT)

Parse any Solidity contract passing either the source code of the contract or the address of a verified deployed contract in a supported blockchain, which will retrieve the source code from its explorer using the API of their block explorer site.

- [Installation](#installation)
- [Usage](#usage)
  - [Methods](#methods)
  - [Options](#options)
  - [Supported Networks](#supported-networks)
    - [How to get an API key](#how-to-get-an-api-key)

# Installation
```bash
npm install solidityparser
```


# Usage
`solidityparser` provides a class that must be initialized with the network name or id of your choice.

```js
const SolidityParser = require("solidityparser");

const parser = new SolidityParser();

let parseFromFile = parser.parseFile("./MyContract.sol");

let parseFromString = parser.parse(`
pragma solidity 0.8.4;
contract MyContract {
  function foo(){}
}
`);
```
A network can be specified alongside an API-key from the explorer.
```js
const SolidityParser = require("solidityparser");

const parser = new SolidityParser({
  network: 1, // Ethereum mainnet
  api_keys: "EYUZIES8FZ7TFK581OERKZ0LFTN3FC0BOT"
});

let parseFromAddress = parser.parseAddress("0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2")
  .then(parsed => {
    // Parsed contract
  })
  .catch(error => {
    throw error;
  });
```
* **NOTE:** `parseAddress` is an asynchronous function.

## Methods
|Method|Description|
|---|---|
|`SolidityParser.parse(code: String, options: Object)`|Parses a solidity contract sent as a String.|
|`SolidityParser.parseFile(file: String, options: Object)`|Parses a solidity contract from a file.|
|`SolidityParser.parseAddress(address: String, options: Object)`|Parses a solidity contract sent as an address. This method needs an [API-key](#how-to-get-an-api-key) from the explorer.|

## Options
|Option|Default|Description|
|---|---|---|
|`elementPosition`|`true`|Returns the position _start_ and _end_ of any statement or declaration found in the code. Set to `false` if you want, for example, to compare a specific part of the code with the same part of another contract.|

## Supported Networks
Any of the following networks can be initialized to the parser.
```js
// Using the name of the network
const parser = new SolidityParser({
  network: "mainnet",
  api_keys: explorer_api
});

// Using the id of the network
const parser = new SolidityParser({
  network: 56,
  api_keys: explorer_api
});
```
|Network|Name|Id|
|:---:|:---:|:---:|
|Ethereum Mainnet| `mainnet` | `1` |
|Ethereum Ropsten| `ropsten` | `3` |
|Ethereum Rinkeby| `rinkeby` | `4` |
|Ethereum Görli  | `görli` or `goerli` | `5` |
|Ethereum Kovan  | `kovan` | `42` |
|Optimistic      | `optimistic` | `10` |
|Optimistic Kovan| `optimistic-testnet` or `optimistic-kovan` | `69` |
|Arbitrum | `arbitrum` | `42161` |
|Arbitrum Rinkeby| `arbitrum-testnet` or `arbitrum-rinkeby` | `421611` |
|Binance Smart Chain| `bsc` | `56` |
|Binance Smart Chain Testnet| `bsc-testnet` | `97` |
|Cronos| `cronos` | `25` |
|Polygon| `polygon` or `matic` | `137` |
|Polygon Mumbai| `mumbai` | `80001` |
|Fantom| `fantom` | `250` |
|Fantom Testnet| `fantom-testnet` | `4002` |

### How to get an API key
In order to use the `parseAddress` feature, you must own an account in the desired blockchain [explorer provided by _Etherscan_](https://etherscan.io/eaas).
Once you have an account, navigate to your profile, and create an API key under the _API-KEYs_ section.

Keep in mind that free accounts have limited API usage:
> **Etherscan.io free plan features:**
> - 5 calls/second limit
> - Up to 100,000 API calls per day

If you were to use more than the limit, consider upgrading your plan, or using an array of API keys which will rotate randomly on each request:

```js
const myKeys = ["DEHMWMJ3UZRIWDM2IFB7P1VVBGQ2FW290Z", "AWNAHFGIIJDDUUEUSPUEPG8HOU3AKHCL31", "CYVO7LDGQSHLW9RIORWA9VMBNZA687DKHZ"];
const parser = new SolidityParser({
  network: "mainnet",
  api_keys: myKeys
});
```