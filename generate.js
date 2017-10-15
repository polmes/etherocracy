var Block = require('./block');
var send = require('./send');

function genBlock(blockchain, pendingTrans, nodeList) {
	// Create new block
	prev = blockchain[blockChain.length - 1];
	let block = new Block(prev.index + 1, prev.hash, Date.now(), pendingTrans);

	// Add to current blockchain
	blockchain.push(block);

	// Propagate
	nodeList.forEach((node) => {
		send.sendBlock(ip_port, block);
	});
}

function genTransaction(hash, pubkey, privkey) {
	// Create new transaction
	trans = new Transaction(hash, pubkey, privkey);

	// Propagate
	nodeList.forEach((node) => {
		send.sendTrans(ip_port, trans);
	});
}

module.exports.genBlock = genBlock;
module.exports.genTransaction = genTransaction;
