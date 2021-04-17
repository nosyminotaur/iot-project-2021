function fetchDeviceStats() {
	fetch("/api/1/").then(res => res.json()).then(res => {
		const statusImg = document.getElementById("status-img");
		const statusTxt = document.getElementById("status");
		if (res.lastOnlineStatus === "OFFLINE") {
			statusImg.src = "./offline.svg";
			statusTxt.textContent = "OFFLINE";
		} else {
			statusImg.src = "./online.svg";
			statusTxt.textContent = "ONLINE";
		}
		document.getElementById("temp-value").textContent = res.stats.temperature;
		document.getElementById("temp-progress").style.width = `${res.stats.temperature}%`;
	})
}

function fetchData() {
	fetch("/api/1/assets").then(res => res.json()).then((res) => {
		console.log(res);
		$("#content-list").empty();
		res.forEach(el => {
			const ul = document.getElementById("content-list");

			const li = document.createElement("li");
			li.className = "list-group-item d-flex";
			if (el.deleteRequested) {
				li.style = "opacity: 0.65;"
			}
			const div = document.createElement("div");
			const innerDiv = document.createElement("div");
			innerDiv.textContent = el.name;
			innerDiv.className = "mb-1";
			const innerDiv2 = document.createElement("div");
			innerDiv2.style = "font-size: 12px;";
			innerDiv2.textContent = new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", month: "long", day: "numeric", year: "numeric" }).format(new Date(el.addedOn).getTime());
			div.appendChild(innerDiv);
			div.appendChild(innerDiv2);
			div.className = "flex-grow-1";
			// div.textContent = el.name;

			const playButton = document.createElement("button");
			playButton.onclick = () => location.href = `/content/${el.fileName}`;
			playButton.className = "btn p-0 mr-2";
			const playImg = document.createElement("img");
			playImg.src = "./play.svg";
			playImg.style = "width: 1.2rem;"
			playButton.appendChild(playImg);

			const deleteButton = document.createElement("button");
			deleteButton.className = "btn p-0";
			deleteButton.onclick = () => deleteContent(el.id);
			const delImg = document.createElement("img");
			delImg.src = "./trash.svg";
			delImg.style = "width: 1.2rem;"
			if (el.deleteRequested) {
				deleteButton.disabled = true;
			}
			deleteButton.appendChild(delImg);

			li.appendChild(div);
			li.appendChild(playButton);
			li.appendChild(deleteButton);
			ul.appendChild(li);
		});
		$("#spinner").addClass("hidden");
		$("#data").removeClass("hidden");
	})
}

window.onload = () => {
	$("#upload-btn").click(upload);
	fetchData();
	fetchDeviceStats();
}

function upload() {
	var input = document.querySelector('input[type="file"]')
	const data = new FormData()
	data.append('file', input.files[0])

	fetch('/api/1/upload', {
		method: 'POST',
		body: data
	}).then(() => {
		$("#uploadModal").modal('hide');
		fetchData();
	})
}

function deleteContent(id) {
	fetch(`/api/1/content/${id}/delete`, {
		method: 'POST',
	}).then(() => {
		fetchData();
	})
}