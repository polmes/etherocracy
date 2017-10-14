class Transaction {
	constructor(DNIhash,sig,pubkey,privkey){
		this.DNIhash=DNIhash;
		this.sig=sign(privkey);
		this.pubkey=pubkey;
	}
	sign(privkey){
		let s = crypto.createSign("sha256");
		s.update(this.DNIhash);
		return s.sign(privkey, "hex");
	}
	verify(){
		if(nodeList.indexOf(this.pubkey)<0){
			return false;
		}
		let s=crypto.createVerify("sha256");
		s.update(this.sig);
		return s.verify(this.pubkey,this.sig);
	}
}

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

module.exports.block = Block;
