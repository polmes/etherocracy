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

module.exports.sendBlock = sendBlock;
module.exports.sendTrans = sendTrans;
