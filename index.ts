const { PORT, NODE_ENV, ORIGIN } = process.env;

import express, { ErrorRequestHandler } from "express";
const app = express();

import { fileURLToPath } from "url";
import path, { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** CORS configuration */

import cors from "cors";
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

/** serve static files */
app.use("/media", express.static(path.join(__dirname, "/media")));

/** root route */

app.get("/", (req, res) => {
	res.send("nothing to see here");
});

/** not found */

app.use((req, res) => {
	res.status(404);
	res.json({ success: false, message: "not found" });
});

/** error handler */

// TODO: custom error with status
interface Errorable {
	status: number;
	message: string;
}

const errorHandler: ErrorRequestHandler = function (
	error: Errorable,
	req,
	res,
	next
) {
	console.error(error.message);
	res.status(error.status || 500);
	res.json({
		success: false,
		message: error.message || "internal server error",
	});
};

app.use(errorHandler);

/** start the server */

app.listen(PORT, () => {
	if (NODE_ENV === "development") {
		console.log(`listening on port ${PORT}`);
	}
});
