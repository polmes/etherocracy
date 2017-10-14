var bodyParser = require("body-parser");
var crypto = require("crypto");
require("block.js");
function sha256(str){
	return crypto.createHash("sha256").update(str).digest("hex");
}

app.post("/checkCensus", (req, res) => {
	//Check census
	if(db.isInCensus(sha256(req.body.dni))){
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
