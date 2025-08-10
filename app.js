const allJobs = [];

const addJobIdToTitle = (titleDiv) => {
	if (titleDiv.dataset.jobIdAdded) {
		return;
	}
	const parentWithJobId = titleDiv.closest("[data-job-id]");
	if (parentWithJobId) {
		const jobId = parentWithJobId.dataset.jobId;
		if (jobId) {
			const jobData = allJobs.find((job) => job.id == jobId);
			const applies = jobData ? jobData.applies : "?";
			const jobIdDiv = document.createElement("div");
			jobIdDiv.id = `job-applies-${jobId}`;
			jobIdDiv.style.borderRadius = "1.0rem";
			jobIdDiv.style.backgroundColor = "rgb(138, 138, 138)";
			jobIdDiv.style.padding = "2px 8px";
			jobIdDiv.style.color = "#ffffff";
			jobIdDiv.style.width = "fit-content";
			jobIdDiv.style.display = "flex";
			jobIdDiv.style.alignItems = "center";
			jobIdDiv.style.justifyContent = "center";
			jobIdDiv.style.fontWeight = "550";
			jobIdDiv.style.height = "25px";
			jobIdDiv.style.lineHeight = "1";
			jobIdDiv.textContent = applies;
			colorizeNode(jobIdDiv, applies);
			titleDiv.insertAdjacentElement("afterend", jobIdDiv);
			titleDiv.dataset.jobIdAdded = "true";
		}
	}
};

const initialDivs = document.querySelectorAll(".artdeco-entity-lockup__title");
initialDivs.forEach(addJobIdToTitle);
const observer = new MutationObserver((mutationsList) => {
	for (const mutation of mutationsList) {
		if (mutation.type === "childList") {
			mutation.addedNodes.forEach((node) => {
				if (node.nodeType === Node.ELEMENT_NODE) {
					if (node.matches(".artdeco-entity-lockup__title")) {
						addJobIdToTitle(node);
					}
					const newTitleDivs = node.querySelectorAll(
						".artdeco-entity-lockup__title"
					);
					newTitleDivs.forEach(addJobIdToTitle);
				}
			});
		}
	}
});
observer.observe(document.body, { childList: true, subtree: true });

browser.runtime.onMessage.addListener((message) => {
	if (message.type === "JOB_DATA") {
		allJobs.push(message.data);
		const jobId = message.data.id;
		const applies = message.data.applies || "?";
		const appliesNode = document.getElementById(`job-applies-${jobId}`);
		if (appliesNode) {
			appliesNode.textContent = applies;
		} else {
			console.warn(`No applies node found for job ID: ${jobId}`);
		}
		colorizeNode(appliesNode, applies);
	}
});

function colorizeNode(node, applies) {
	if (applies >= 0 && applies < 50) {
		node.style.backgroundColor = "rgb(15, 145, 12)";
	} else if (applies >= 50 && applies < 100) {
		node.style.backgroundColor = "rgb(255, 145, 4)";
	} else if (applies >= 100) {
		node.style.backgroundColor = "rgb(240, 40, 30)";
	} else {
		node.style.backgroundColor = "rgb(138, 138, 138)";
	}
}
