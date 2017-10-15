var util=require("./util");

class Block {
	
	constructor(index, previousHash, timestamp, data) {
		this.index = index;
		this.previousHash = previousHash.toString();
		this.data = data;
		this.hash = this.calculateHash();
	}
	calculateHash() {
	    return util.sha256(this.index + this.previousHash + this.timestamp + this.data);
	}
	includedTransaction(trans){
		return this.data.indexOf(trans)<0 ? false : true;
	}
}

module.exports = Block;
