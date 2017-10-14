class Block {
	constructor(index, previousHash, timestamp, data) {
		this.index = index;
		this.previousHash = previousHash.toString();
		this.data = data;
		this.hash = calculateHash();
	}
	calculateHash () {
	    return sha256(index + previousHash + timestamp + data);
	}
	includedTransaction(trans){
		return this.data.indexOf(trans)<0 ? false : true;
	}
}

module.exports = Block;
