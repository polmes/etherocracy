var crypto = require('crypto');

class Transaction {
	constructor(DNIhash,pubkey,privkey){
		this.DNIhash=DNIhash;
		this.sig=this.sign(privkey);
		this.pubkey=pubkey;
	}
	sign(privkey){
		let s = crypto.createSign("RSA-SHA256"); // sha256
		s.update(this.DNIhash);
		return s.sign(privkey, "hex");
	}
	verify(){
		if(nodeList.indexOf(this.pubkey)<0){
			return false;
		}
		let s=crypto.createVerify("RSA-SHA256"); // sha256
		s.update(this.sig);
		return s.verify(this.pubkey,this.sig);
	}
}

module.exports = Transaction;
