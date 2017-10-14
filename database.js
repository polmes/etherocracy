class DataBase {
	constructor(json) {
		this.db = JSON.parse(fs.readFileSync(json, 'utf8'));
	}
	isInCensus(hash) {
		this.db[hash.charAt(0)].indexOf(hash) < 0 ? false : true;
	}
}
