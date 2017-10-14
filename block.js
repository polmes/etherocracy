class Block {
	constructor(index, previousHash, timestamp, data, hash) {
		this.index = index;
		this.previousHash = previousHash.toString();
		this.timestamp = timestamp;
		this.data = data;
		this.hash = hash.toString();
	}
	calculateHash () {
	    this.hash=sha256(index + previousHash + timestamp + data);
	}
	serialize(){
		
	}
};

module.exports.block = Block;
