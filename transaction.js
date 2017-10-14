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

module.exports = Transaction;
