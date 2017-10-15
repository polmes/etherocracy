function checkID() {
	var req = new XMLHttpRequest();
	req.open('POST', 'http://localhost:31416/check', true);
	req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	req.send('dni=' + document.getElementById('ID').value);
	req.onload = () => {
		if (req.readyState === req.DONE) {
			if (req.status === 200) {
				console.log(req.response);
				console.log(req.responseText);
			}
		}
	};
	// req.onreadystatechange = function() {
	// 	if (req.status == 200) {
	// 		// if (existeix hash) {
	// 		//     document.getElementById("registered").style.color = "green";
	// 		// } else {
	// 		//     document.getElementById("registered").style.color = "red";
	// 		// }

	// 		// if (ha votat) {
	// 		//     document.getElementById("eligibility").style.color = "red";
	// 		// } else {
	// 		//     document.getElementById("eligibility").style.color = "green";
	// 		// }

	// 		// if (transmission_status) {
	// 		//     document.getElementById("transmission").style.color = "green";
	// 		// } else {
	// 		//     document.getElementById("transmission").style.color = "red";
	// 		//     console.log("An error ocurred while transmitting!");
	// 		// }

	// 		// if (block_built) {
	// 		//     document.getElementById("block_built").style.color = "green";
	// 		// } else {
	// 		//     document.getElementById("block_built").style.color = "red";
	// 		// }
	// 	} else {
	// 		console.log("Error loading page\n");
	// 	}
	// };
}
