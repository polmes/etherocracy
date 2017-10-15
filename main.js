// Modules
var bodyParser = require('body-parser');
var express = require('express');
var Transaction = require('./transaction');
var Block = require('./block');
var util = require('./util');
var DataBase = require('./database');
var generate = require('./generate');

// Init
var blockchain = [new Block(0,0,0,"123987456")];
var nodeList = [];
var pendingTrans = [];
var submittedTrans = [];
var app = express();
var db = new DataBase("census.json");

// Config
var http_port = 31416;
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// Polling station
var pubkey = "";
var privkey = "";

app.get("/", (req, res) => {
	res.sendFile(__dirname+"/index.html");
});

app.get("/style.css", (req, res) => {
	res.sendFile(__dirname+"/style.css");
});

app.post("/check", (req, res) => {
	let ans = {census: "unknown", block: "unknown"};
	let hash = util.sha256(req.body.dni);

	//Check census
	if(!db.isInCensus(hash)){
		ans.census = "error";
		res.send(ans);
	}
	ans.census = "success";

	//Check if transaction is included in any previous blocks
	blockChain.forEach( (block) => {
		if(block.includedTransaction(req.body))	{
			ans.block = "error";
			res.send(ans);
		}
	});
	ans.block = "success";

	// Generate and send transaction
	generate.genTransaction(hash, pubkey, privkey);

	// Get out of here
	res.send(ans);
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
	//Check signature
	if(!req.body.trans.verify()){
		res.send("Error");
	} else {
		pendingTrans.push(req.body.trans);
		res.send("Success");
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
	if(blockchain[blockchain.length-1].id>=req.body.block.id){
		res.send("Ignore");
	} else if(blockchain[blockchain.length-1].id+1<req.body.block.id) {
		let ip = req.connection.remoteAddress;
		newchain=requestBlockchain(ip+":"+http_port);
		if(!checkChainCoherence(newchain)){
			res.send("Error");
		} else {
			blockchain=newchain;
		}
	} else {
		if(blockchain[blockchain.length-1].hash!=req.body.block.prevHash){
			res.send("Error");
		} else {
			blockchain.push(req.body.block);
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
