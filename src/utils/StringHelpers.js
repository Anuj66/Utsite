const crypto = require('crypto');

const algorithm = 'aes-256-ctr';
const ENCRYPTION_KEY = crypto.randomBytes(32); // Must be 256 bits (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16

function encrypt(text){
    let buff = new Buffer(text);
    let base64data = buff.toString('base64');
    return base64data
  }
  
function decrypt(data){
    let buff = new Buffer(data, 'base64');
    let text = buff.toString('ascii');
    return text;
}

module.exports = { decrypt, encrypt };