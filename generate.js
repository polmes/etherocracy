var Block = require('./block');
var Transaction = require('./transaction')
var send = require('./send');
var events = require('./events');

function genBlock(blockchain, pendingTrans, nodeList) {
	// Create new block
	prev = blockchain[blockchain.length - 1];
	let block = new Block(prev.index + 1, prev.hash, Date.now(), pendingTrans);

	// Add to current blockchain
	blockchain.push(block);
	events.blockEmitter.emit('newBlock');

	// Propagate
	nodeList.forEach((node) => {
		send.sendBlock(node, block);
	});

	// Clear current transactions
	pendingTrans = [];
}

function genTransaction(hash, pubkey, privkey, pendingTrans, nodeList) {
	// Create new transaction
	trans = new Transaction(hash, pubkey, privkey, true);

	// Add to current transactions
	pendingTrans.push(trans);

	// Propagate
	nodeList.forEach((node) => {
		send.sendTrans(node, trans);
	});
}

module.exports.genBlock = genBlock;
module.exports.genTransaction = genTransaction;
