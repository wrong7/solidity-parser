"use strict";

const peggy = require("peggy");
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

const builtParser = require("./build/parser");

const KNOWN_NETWORKS = {
  "mainnet": "api.etherscan.io",
  "ropsten": "api-ropsten.etherscan.io",
  "kovan": "api-kovan.etherscan.io",
  "rinkeby": "api-rinkeby.etherscan.io",
  "goerli": "api-goerli.etherscan.io",
  "görli": "api-goerli.etherscan.io",
  "optimistic": "api-optimistic.etherscan.io",
  "optimistic-kovan": "api-kovan-optimistic.etherscan.io",
  "optimistic-testnet": "api-kovan-optimistic.etherscan.io",
  "arbitrum": "api.arbiscan.io",
  "arbitrum-rinkeby": "api-testnet.arbiscan.io",
  "arbitrum-testnet": "api-testnet.arbiscan.io",
  "bsc": "api.bscscan.com",
  "bsc-testnet": "api-testnet.bscscan.com",
  "avax": "api.snowtrace.io",
  "avalanche": "api.snowtrace.io",
  "avalanche-testnet": "api-testnet.snowtrace.io",
  "fuji": "api-testnet.snowtrace.io",
  "cronos": "api.cronoscan.com",
  "matic": "api.ploygonscan.com",
  "polygon": "api.ploygonscan.com",
  "mumbai": "api-testnet.ploygonscan.com",
  "fantom": "api.ftmscan.com",
  "fantom-testnet": "api-testnet.ftmscan.com",
};

const parseNetwork = (network) => {
  switch(network) {
    case 1:
      return "mainnet";
    case 3:
     return "ropsten";
    case 4:
     return "rinkeby";
    case 5:
      return "goerli";
    case 42:
      return "kovan";
    case 56:
      return "bsc";
    case 97:
      return "bsc-testnet";
    case 10:
      return "optimistic";
    case 69:
      return "optimistic-testnet";
    case 42161:
      return "arbitrum";
    case 421611:
      return "arbitrum-testnet";
    case 43114:
      return "avalanche";
    case 43113:
      return "avalanche-testnet";
    case 25:
      return "cronos";
    case 137:
      return "polygon";
    case 80001:
      return "mumbai";
    case 250:
      return "fantom";
    case 4002:
      return "fantom-testnet";
  }
}

const defaultOptions = {
  rebuild: false,
  elementPosition: true
}

module.exports = class SolidityParser {
  constructor(network, api_keys) {
    if(Number.isInteger(network)) {
      network = parseNetwork(network);
    }
    if(!KNOWN_NETWORKS[network]) {
      throw new Error(`Unknown network ${network}. Use one of the following: ${Object.keys(KNOWN_NETWORKS).join(", ")}`);
    }
    this.network = network;
    this.api_keys = Array.isArray(api_keys) ? api_keys : [api_keys];
  }

  async getContract(address) {
    let res = await fetch(`https://${KNOWN_NETWORKS[this.network]}/api?module=contract&action=getsourcecode&address=${address}&apikey=${this.api_keys[Math.floor(this.api_keys.length * Math.random())]}`)
    res = await res.json()
    try {
      let code = res.result[0].SourceCode
      if(code.startsWith('{{')) {
        code = JSON.parse(code.substring(1, code.length - 1))
        code = Object.values(code.sources).map(source => source.content).join('\n')
      } else if(code.startsWith('{')) {
        code = JSON.parse(code)
        code = Object.values(code).map(source => source.content).join('\n')
      }
      return code
    } catch(err) {
      throw err
    }
  }

  getParser(options = defaultOptions) {
    if (options.rebuild) {
      return peggy.generate(fs.readFileSync(`./solidity.peggy`, {encoding: "utf8"}));
    } else {
      return builtParser
    }
  }
  parse(source, options = defaultOptions) {
    let parser = this.getParser(options);
    let result;
    try {
      result = parser.parse(source);
    } catch (e) {
      if(e instanceof parser.SyntaxError) {
        e.message += " Line: " + e.location.start.line + ", Column: " + e.location.start.column;
      }
      throw e;
    }
    return result;
  }
  parseFile(file, options = defaultOptions) {
    return this.parse(fs.readFileSync(path.resolve(file), {encoding: "utf8"}), options);
  }
  async parseContract(address, options = defaultOptions) {
    const code = await this.getContract(address);
    console.log(code.length)
    return this.parse(code, options);
  }
}