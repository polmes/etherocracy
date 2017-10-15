var request = require('request');

var sendBlock = function(ip_port, block) {
	request({
		uri: "http://" + ip_port + "/getBlock",
		method: "POST",
		form: {
			block: block
		}
	});
};

var sendTrans = function(ip_port, trans) {
	request({
		uri: "http://" + ip_port + "/getTrans",
		method: "POST",
		form: {
			trans: trans
		}
	});
};

var requestBlockchain = function(ip_port) {
	request({
		uri: "http://" + ip_port + "/getBlockchain",
		method: "POST"
	});
};

module.exports.sendBlock = sendBlock;
module.exports.sendTrans = sendTrans;
module.exports.requestBlockchain = requestBlockchain;
