import test from "node:test";
import assert from "node:assert/strict";
import { validateKaspaAddress } from "../kaspa/address";

const payload = "qpv7fcvdlz6th4hqjtm9qkkms2dw0raem963x3hm8glu3kjgj7922vy69hv85";
const allowedPrefixes = ["kaspa", "kaspatest"];

test("validateKaspaAddress accepts mainnet and testnet prefixes", () => {
  assert.deepEqual(validateKaspaAddress(`kaspa:${payload}`, allowedPrefixes), { valid: true });
  assert.deepEqual(validateKaspaAddress(`kaspatest:${payload}`, allowedPrefixes), { valid: true });
});

test("validateKaspaAddress rejects prefixes outside the explicit allowlist", () => {
  assert.deepEqual(validateKaspaAddress(`kaspasim:${payload}`, allowedPrefixes), {
    valid: false,
    reason: "Address prefix 'kaspasim' is not allowed",
  });
});
