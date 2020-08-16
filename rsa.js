const crypto = require("crypto");

const create = (passphrase = '') => {
	return new Promise((res, rej) => {
		try {
			const challanger = (function init(passphrase){
				const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
					modulusLength: 2048,
					publicKeyEncoding: { 
						type: 'spki', 
						format: 'pem'
					}, 
					privateKeyEncoding: { 
					type: 'pkcs8', 
					format: 'pem', 
					cipher: 'aes-256-cbc', 
					passphrase: passphrase
					}
				});
				return {
					getPublicKey: function() {
						return publicKey;
					},
					encrypt: function(data) {
						return crypto.publicEncrypt(
							{
								key: publicKey,
								padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
								oaepHash: "sha256",
							},
							Buffer.from(data)
						);
					},
					decrypt: function(data) {
						return crypto.privateDecrypt(
							{
								key: privateKey,
								padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
								oaepHash: "sha256",
								passphrase: passphrase
							},
							data
						);
					}
				};
			}(passphrase));

			res(challanger);
		
		} catch (e) {
			rej(e);
		}
	});
};

module.exports = create;




// // This is the data we want to encrypt
// const data = "my secret data"

// const encryptedData = crypto.publicEncrypt(
// 	{
// 		key: publicKey,
// 		padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
// 		oaepHash: "sha256",
// 	},
// 	// We convert the data string to a buffer using `Buffer.from`
// 	Buffer.from(data)
// )

// // The encrypted data is in the form of bytes, so we print it in base64 format
// // so that it's displayed in a more readable form
// console.log("encypted data: ", encryptedData.toString("base64"));

// const decryptedData = crypto.privateDecrypt(
// 	{
// 		key: privateKey,
// 		// In order to decrypt the data, we need to specify the
// 		// same hashing function and padding scheme that we used to
// 		// encrypt the data in the previous step
// 		padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
// 		oaepHash: "sha256",
// 		passphrase: ''
// 	},
// 	encryptedData
// )

// // The decrypted data is of the Buffer type, which we can convert to a
// // string to reveal the original data
// console.log("decrypted data: ", decryptedData.toString())