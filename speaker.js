var request = require('request');

var sendBlock = function(ip, port, block) {
	request({
		uri: "http://" + ip + ":" + port + "/getBlock",
		method: "POST",
		form: {
			block: block
		}
	});
};

var sendTrans = function(ip, port, transaction) {
	request({
		uri: "http://" + ip + ":" + port + "/getTrans",
		method: "POST",
		form: {
			transaction: transaction
		}
	});
};

module.exports.sendBlock = sendBlock;
module.exports.sendTrans = sendTrans;
