// Crypto module is part of Node
const crypto = require("crypto");

// Generates a random key
function generateRandomKey() {
    return crypto.randomBytes(20).toString("hex");
}

module.exports = generateRandomKey;
