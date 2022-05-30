"use strict";

const SolidityParser = require("../index.js");
const parser = new SolidityParser(97, "")

describe("Built Parser (Binance Smart Chain - Testnet)", function() {
    it("Parses documentation examples without throwing an error", function() {
      parser.parseFile("./test/doc_examples.sol");
    });
    it("Parses a deployed contract at a given address", async function () {
      await parser.parseAddress('0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3');
    });
});