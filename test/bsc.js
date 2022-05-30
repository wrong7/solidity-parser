"use strict";

const SolidityParser = require("../index.js");
const parser = new SolidityParser({network: 56, api_keys: ""});

describe("Built Parser (Binance Smart Chain)", function() {
    it("Parses documentation examples without throwing an error", function() {
      parser.parseFile("./test/doc_examples.sol");
    });
    it("Parses a deployed contract at a given address", async function () {
      console.log(await parser.parseAddress('0x10ED43C718714eb63d5aA57B78B54704E256024E'));
    });
});
