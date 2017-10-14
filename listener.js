// Modules
var bodyParser = require('body-parser');
var crypto = require('crypto');
var block = require('block');
var util = require('util');
var express = require('express');
var database = require('database');

// Init
var blockchain = [];
var nodeList = [];
var pendingTrans = [];
var app = express();
app.use(bodyParser.json());
var db = new database.DataBase("census.json");


app.post("/checkCensus", (req, res) => {
	//Check census
	if(db.isInCensus(util.sha256(req.body.dni))){
		res.send("Error");
	} else {
		res.send("Success");
	}
});

app.post("/checkTransInBlocks", (req, res) => {
	//Check if transaction is included in any previous blocks
	let ret="Success";
	blockChain.forEach( (block) => {
		if(block.includedTransaction(req.body))	{
			ret="Error";
		}
	});
	res.send(ret);
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

app.post("/getBlock", (req, res) => {
	//Receive block from peers
	if(false/*wrong hash signature*/){
		res.send("Error");
	} else {
		blockchain.push(req.body.block);
	}
});

app.listen(http_port, () => console.log("Listening http on port: " + http_port));
