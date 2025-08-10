function listener(details) {
	if (!details.url.includes("/voyager/api/jobs/")) {
		return {};
	}

	const filter = browser.webRequest.filterResponseData(details.requestId);
	const decoder = new TextDecoder("utf-8");
	const encoder = new TextEncoder();

	let fullData = "";

	filter.ondata = (event) => {
		const chunk = decoder.decode(event.data, { stream: true });
		fullData += chunk;
		filter.write(event.data);
	};

	filter.onstop = (event) => {
		try {
			const json = JSON.parse(fullData);
			const applicationData = {
				id: json.data.jobPostingId ?? null,
				applies: json.data.applies ?? null,
			};
			console.log(applicationData);

			browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
				browser.tabs.sendMessage(tabs[0].id, {
					type: "JOB_DATA",
					data: applicationData,
				});
			});
		} catch (e) {
			console.warn("Failed to parse JSON:", e);
		}
		filter.disconnect();
	};

	return {};
}

browser.webRequest.onBeforeRequest.addListener(
	listener,
	{
		urls: ["*://*.linkedin.com/*"],
		types: ["xmlhttprequest"],
	},
	["blocking"]
);
