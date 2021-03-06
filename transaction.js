var crypto = require('crypto');

class Transaction {
	constructor(DNIhash,pubkey,privkey,boole){
		if(boole) {
			this.DNIhash=DNIhash;
			this.sig=this.sign(privkey);
			this.pubkey=pubkey;
		} else {
			this.DNIhash = DNIhash;
			this.pubkey = pubkey;
			this.sig = privkey;
		}
	}
	sign(privkey){
		let s = crypto.createSign("RSA-SHA256"); // sha256
		s.update(this.DNIhash);
		return s.sign(privkey, "hex");
	}
	verify(pubkeys){
		if(pubkeys.indexOf(this.pubkey)<0){
		console.log("found key");
			return false;
		}
		let s=crypto.createVerify("RSA-SHA256"); // sha256
		//return s.verify(this.pubkey.trim(),this.sig);
		return true;
	}
}

module.exports = Transaction;
