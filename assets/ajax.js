function checkID() {
	var req = new XMLHttpRequest();
	req.open('POST', 'http://localhost:31416/check', true);
	req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	req.send('dni=' + document.getElementById('ID').value);
	req.onload = () => {
		if (req.readyState === req.DONE) {
			if (req.status === 200) {
				let ans = JSON.parse(req.response);
				console.log(ans);

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

				// if (transmission_status) {
				//     document.getElementById("transmission").style.color = "green";
				// } else {
				//     document.getElementById("transmission").style.color = "red";
				//     console.log("An error ocurred while transmitting!");
				// }

				// if (block_built) {
				//     document.getElementById("block_built").style.color = "green";
				// } else {
				//     document.getElementById("block_built").style.color = "red";
				// }
			}
		}
	};
}

function resetStatus() {
	document.getElementById("registered").style.color = "#aaa";
	document.getElementById("eligibility").style.color = "#aaa";
}
