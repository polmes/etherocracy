var crypto = require('crypto');

var sha256 = function sha256(str){
	return crypto.createHash("sha256").update(str).digest("hex");
};

module.exports.sha256 = sha256;
