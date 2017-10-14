var blockchain = [];
var nodeList = [];
var pendingTrans = [];
var express = require("express");
var app = express();
var db = new DataBase("census.json");
app.use(bodyParser.json());
