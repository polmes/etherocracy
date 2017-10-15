// Modules
var bodyParser = require('body-parser');
var express = require('express');
var fs = require('fs');
var Transaction = require('./transaction');
var Block = require('./block');
var util = require('./util');
var DataBase = require('./database');
var generate = require('./generate');


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
pubkeys.push(pubkey);

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
	if(false/*not consensus*/){
		res.send("Error");
	} else {
		res.send("Success");
	}
});

app.post("/getTrans", (req, res) => {
	//Receive transaction from peers

	//Check pubkey
	if (pubkeys.indexOf(req.body.trans.pubkey) < 0 ) {
		return res.send("Error");
	}

	//Check signature
	if(!req.body.trans.verify()){
		return res.send("Error");
	} else {
		pendingTrans.push(req.body.trans);
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
	//Receive block from peers
	if(blockchain[blockchain.length-1].index>=req.body.block.index){
		return res.send("Ignore");
	} else if(blockchain[blockchain.length-1].index+1<req.body.block.index) {
		let ip = req.connection.remoteAddress;
		newchain=requestBlockchain(ip+":"+http_port);
		if(!checkChainCoherence(newchain)){
			return res.send("Error");
		} else {
			blockchain=newchain;
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
