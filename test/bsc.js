"use strict";

const SolidityParser = require("../index.js");
const parser = new SolidityParser(56, "")

describe("Parser (Binance Smart Chain)", function() {
    it("Parses documentation examples without throwing an error", function() {
      parser.parseFile("./test/doc_examples.sol", true);
    });
    it("Parses a deployed contract at a given address", async function () {
      await parser.parseContract('0x10ED43C718714eb63d5aA57B78B54704E256024E', true);
    });
});

describe("Built Parser (Binance Smart Chain)", function() {
    it("Parses documentation examples without throwing an error", function() {
      parser.parseFile("./test/doc_examples.sol");
    });
    it("Parses a deployed contract at a given address", async function () {
      await parser.parseContract('0x10ED43C718714eb63d5aA57B78B54704E256024E');
    });
});
