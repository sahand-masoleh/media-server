import { Router } from "express";
export const router = Router();

import * as db from "../db/db.js";

router.get("/", async (req, res, next) => {
	try {
		const productsResponst = await db.query("SELECT * FROM products");
		const products = productsResponst.rows;
		res.json(products);
	} catch (error) {
		next(error);
	}
});

export default router;
