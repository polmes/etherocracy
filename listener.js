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
});//Need to generate new connections to spread the transaction

app.post("/checkBlocks", (req, res) => {
	//Check blocks 
	if(/*in blocks*/){
		res.send("Error");
	} else {
		res.send("Success");
	}
});

app.post("/waitConsensus", (req, res) => {
	//Check blocks 
	if(/*not consensus*/){
		res.send("Error");
	} else {
		res.send("Success");
	}
});

app.post("/getTrans", (req, res) => {
	//Receive transaction from peers
	if(/*wrong signature*/){
		res.send("Error");
	} else {
		pendingTrans.push(req.body.trans);
	}
});

app.post("/getBlock", (req, res) => {
	//Receive transaction from peers
	if(/*wrong hash signature*/){
		res.send("Error");
	} else {
		blockchain.push(req.body.block);
	}
});

app.listen(http_port, () => console.log("Listening http on port: " + http_port));
