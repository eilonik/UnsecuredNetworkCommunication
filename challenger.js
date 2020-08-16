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