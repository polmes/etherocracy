// Modules
var bodyParser = require('body-parser');
var express = require('express');
var Transaction = require('./transaction');
var Block = require('./block');
var util = require('./util');
var DataBase = require('./database');

// Init
var blockchain = [new Block(0,0,0,"123987456")];
var nodeList = [];
var pendingTrans = [];
var app = express();
var db = new DataBase("census.json");

// Config
var http_port = 31416;
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.post("/checkCensus", (req, res) => {
	//Check census
	if(!db.isInCensus(util.sha256(req.body.dni))){
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
	if(blockchain[req.body.block.id-1].hash!=req.body.block.prevHash){
		res.send("Error");
	} else if(req.body.block.id<=blockchain[blockchain.length-1].id){
		//Forked!
	} else {
		blockchain.push(req.body.block);
	}
});

app.listen(http_port, () => console.log("Listening http on port: " + http_port)); // add '0.0.0.0' if necessary
