const { PORT, NODE_ENV, ORIGIN } = process.env;
import express from "express";
const app = express();
import { fileURLToPath } from "url";
import path, { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import cors from "cors";
app.use(cors({
    origin: NODE_ENV === "development"
        ? true
        : NODE_ENV === "production"
            ? ORIGIN
            : false,
}));
app.use("/media", express.static(path.join(__dirname, "/media")));
app.get("/", (req, res) => {
    res.send("nothing to see here");
});
app.use((req, res) => {
    res.status(404);
    res.json({ success: false, message: "not found" });
});
const errorHandler = function (error, req, res, next) {
    console.error(error.message);
    res.status(error.status || 500);
    res.json({
        success: false,
        message: error.message || "internal server error",
    });
};
app.use(errorHandler);
app.listen(PORT, () => {
    if (NODE_ENV === "development") {
        console.log(`listening on port ${PORT}`);
    }
});
