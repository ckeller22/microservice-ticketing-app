import axios from "axios";

const buildClient = ({ req }) => {
	if (typeof window === "undefined") {
		// On server
		const url = getURL();
		console.log(getURL());
		return axios.create({
			baseURL: url,
			headers: req.headers,
		});
	} else {
		// In browser

		return axios.create({});
	}
};

const getURL = () => {
	// Checks env var defined in skaffold to set host dynamically for local development
	let url;
	if (process.env.DEV_MODE === "true") {
		url = "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local";
	} else {
		url = "http://www.tixgit.website";
	}
	return url;
};

export default buildClient;
