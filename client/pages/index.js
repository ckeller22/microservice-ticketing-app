import buildClient from "../api/build-client";

const LandingPage = ({ currentUser }) => {
	console.log(currentUser);

	return <h1>Landing Page</h1>;
};

LandingPage.getInitialProps = async ({ req }) => {
	console.log(req.headers);
	const client = buildClient({ req });

	const { data } = await client.get("/api/users/currentuser").catch((err) => {
		console.log(err.message);
	});
	return data;
};

export default LandingPage;

// const LandingPage = ({ color }) => {
// 	console.log("client-side-rendering", color); // value of color is showing as undefined
// 	return <h1>This is a Landing Page in {color} color</h1>;
// };

// LandingPage.getInitialProps = () => {
// 	const colorRec = { color: "red" };
// 	console.log("server-side-rendering", colorRec.color);
// 	return colorRec;
// };
// export default LandingPage;
