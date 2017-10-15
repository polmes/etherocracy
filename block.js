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
	includedTransaction(hash) {
		let found = false;
		for (let i = 0; i < this.data.length && !found; i++) {
			if (this.data[i].DNIhash == hash) {
				found = true;
			}
		}
		return found ? true : false;
	}
}

module.exports = Block;
