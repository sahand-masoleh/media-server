const { PORT, NODE_ENV, ORIGIN } = process.env;
const express = require("express");
const app = express();
const path = require("path");

/** CORS configuration */
const cors = require("cors");

app.use(
	cors({
		origin:
			NODE_ENV === "development"
				? true
				: NODE_ENV === "production"
				? ORIGIN
				: false,
	})
);
app.use(cors());

/** serve static files */
app.use("/media", express.static(path.join(__dirname, "/media")));

/** root route */
app.get("/", (req, res) => {
	res.send("nothing to see here");
});
app.use((req, res) => {
	res.status(404);
	res.json({ success: false, message: "not found" });
});

/** error handler */
app.use((error, req, res, next) => {
	console.error(error.message);
	res.status(500);
	res.json({
		success: false,
		message: error.message || "internal server error",
	});
});

/** start the server */
app.listen(PORT, () => {
	if (NODE_ENV === "development") {
		console.log(`listening on port ${PORT}`);
	}
});
