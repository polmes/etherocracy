function checkID() {
	var req = new XMLHttpRequest();
	req.open('POST', 'http://localhost:31416/check', true);
	req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	let content = 'dni=' + document.getElementById('ID').value;
	req.send(content);
	req.onload = () => {
		if (req.readyState === req.DONE) {
			if (req.status === 200) {
				let ans = JSON.parse(req.response);
				// console.log(ans);

				if (ans.census === "error") {
					document.getElementById("registered").style.color = "red";
				} else if (ans.census == "success") {
					document.getElementById("registered").style.color = "green";
				}

				if (ans.block === "error") {
					document.getElementById("eligibility").style.color = "red";
				} else if (ans.block == "success") {
					document.getElementById("eligibility").style.color = "green";
				}

				if (ans.census === "success" && ans.block === "success") {
					var sec = new XMLHttpRequest();
					sec.open('POST', 'http://localhost:31416/waitConsensus', true);
					sec.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
					sec.send(content);
					sec.onload = () => {
						if (sec.readyState === sec.DONE) {
							if (sec.status === 200) {
								if (sec.response == "Success") {
									document.getElementById("vote-now").style.color = "green";
								} else {
									document.getElementById("vote-now").style.color = "red";
								}
							}
						}
					};
				}
			}
		}
	};
}

function resetStatus() {
	document.getElementById("registered").style.color = "#aaa";
	document.getElementById("eligibility").style.color = "#aaa";
	document.getElementById("vote-now").style.color = "#aaa";
}
