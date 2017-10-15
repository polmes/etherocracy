// Modules
var bodyParser = require('body-parser');
var express = require('express');
var fs = require('fs');
var Transaction = require('./transaction');
var Block = require('./block');
var util = require('./util');
var DataBase = require('./database');
var generate = require('./generate');
var events = require('./events');

// Init
var blockchain = [new Block(0,0,0,[])];
var nodeList = [];
var pendingTrans = [];
var submittedTrans = [];
var pubkeys = [];
var app = express();
var db = new DataBase("census.json");

// Config
var http_port = 31416;
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// Polling station
var pubkey = fs.readFileSync('testkey.pub', 'utf8');
var privkey = fs.readFileSync('testkey', 'utf8');

// Arrays
pubkeys = JSON.parse(fs.readFileSync('pubkeys.json', 'utf8'));
for(let h=0;h<pubkeys.length;++h){
	pubkeys[h]=pubkeys[h].trim();
}
nodeList = JSON.parse(fs.readFileSync('nodes.json', 'utf8'));

app.get("/", (req, res) => {
	res.sendFile(__dirname+"/index.html");
});

app.use(express.static('assets'));

app.post("/check", (req, res) => {
	let ans = {census: "unknown", block: "unknown"};
	let hash = util.sha256(req.body.dni);

	//Check census
	if (!db.isInCensus(hash)) {
		ans.census = "error";
		return res.send(ans);
	}
	ans.census = "success";

	//Check pendingTransactions
	for (let i = 0; i < pendingTrans.length; i++) {
		if (pendingTrans[i].DNIhash == hash) {
			ans.block = "error";
			return res.send(ans);
		}
	}

	//Check if transaction is included in any previous blocks
	for (let i = 0; i < blockchain.length; i++) {
		if (blockchain[i].includedTransaction(hash)) {
			ans.block = "error";
			return res.send(ans);
		}
	}
	ans.block = "success";

	// Generate and send transaction
	generate.genTransaction(hash, pubkey, privkey, pendingTrans,  nodeList);

	// Get out of here
	return res.send(ans);
});


app.post("/waitConsensus", (req, res) => {
	//Wait for consensus in block history
	let hash = util.sha256(req.body.dni);
	let func = () => {
		for(let i=blockchain.length-2;i>=0;--i){
			for( let j=0; j<blockchain[i].data.length;++j){
				if(blockchain[i].data[j].DNIhash==hash){
					if(blockchain[i].data[j].pubkey==pubkey){
						events.blockEmitter.removeListener('newBlock',func);
						return res.send("Success");
					} else {
						events.blockEmitter.removeListener('newBlock',func);
						return res.send("Error");
					}
				}
			}
		}
	};
	events.blockEmitter.on('newBlock',func);
});

app.post("/getTrans", (req, res) => {
	console.log("getTrans");
	console.log(req.body);
	//Receive transaction from peers
	let trans = new Transaction(req.body.trans.DNIhash, req.body.trans.pubkey, req.body.trans.sig, false);

	//Check pubkey
	console.log(pubkeys);
	console.log(trans.pubkey);
	if (pubkeys.indexOf(trans.pubkey.trim()) < 0 ) {
		return res.send("Error");
	}

	//Check signature
	if(!trans.verify(pubkeys)){
		console.log("non verified");
		return res.send("Error");
	} else {
		console.log("add to pending");
		pendingTrans.push(trans);
		return res.send("Success");
	}
});

function checkChainCoherence(chain){
	for(let i=1;i<chain.length;++i){
		if(chain[i-1].hash!=chain[i].prevHash){
			return false;
		}
	}
	return true;
}

app.post("/getBlock", (req, res) => {
	console.log("getBlock");
	console.log(req.body);
	//Receive block from peers
	console.log(req.body);
	if(blockchain[blockchain.length-1].index>=req.body.block.index){
		return res.send("Ignore");
	} else if(blockchain[blockchain.length-1].index+1<req.body.block.index) {
		let ip = req.connection.remoteAddress;
		newchain=requestBlockchain(ip+":"+http_port);
		if(!checkChainCoherence(newchain)){
			return res.send("Error");
		} else {
			blockchain=newchain;
			events.blockEmitter.emit("newBlock");
			// Clear current transactions
			blockchain.forEach((block) => {
				block.data.forEach((trans) => {
					let ind  = pendingTrans.indexOf(trans);
					if (ind >= 0) pendingTrans.splice(ind, 1);
				});
			});
		}
	} else {
		if(blockchain[blockchain.length-1].hash!=req.body.block.prevHash){
			return res.send("Error");
		} else {
			blockchain.push(req.body.block);
			// Clear current transactions
			req.body.block.data.forEach((trans) => {
				let ind  = pendingTrans.indexOf(trans);
				if (ind >= 0) pendingTrans.splice(ind, 1);
			});
		}
	}
});

app.post("/getBlockchain", (req, res) => {
	//Send blockchain to peers upon request
	res.send(blockchain);
});

setInterval(() => {
	generate.genBlock(blockchain, pendingTrans, nodeList);
}, 10000);

app.listen(http_port, () => console.log("Listening http on port: " + http_port)); // add '0.0.0.0' if necessary
