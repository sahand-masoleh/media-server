import { Router } from "express";
import { QueryResult } from "pg";
export const router = Router();

import * as db from "../db/db.js";

interface Productable {
	id: number;
	name: string;
	type: "fruit" | "vegatable";
	price: number;
	description: string;
	source: string;
	cover: string;
	slices: string;
	noface: string;
	images: string[];
	inventory: number;
	is_hero: boolean;
}

/* home page (shop) */

type Item = Pick<Productable, "id" | "name" | "cover" | "slices" | "price"> & {
	hero: string | null;
};

router.get("/", async (req, res, next) => {
	try {
		const response: QueryResult<Item> = await db.query(
			`
			SELECT id, name, cover, slices, price,
				CASE
					WHEN is_hero = TRUE THEN images[1]
					ELSE NULL
				END as hero
			FROM products
			`
		);
		res.json(response.rows);
	} catch (error) {
		next(error);
	}
});

/* list of items for getStaticPaths */

type Path = Pick<Productable, "name">;

router.get("/paths", async (req, res, next) => {
	try {
		const response: QueryResult<Path> = await db.query(
			"SELECT name FROM products"
		);
		res.json(response.rows);
	} catch (error) {
		next(error);
	}
});

/* each food */

type Food = Pick<
	Productable,
	"type" | "price" | "description" | "source" | "noface" | "images"
>;

router.get("/:food", async (req, res, next) => {
	const { food } = req.params || {};
	try {
		const response: QueryResult<Food> = await db.query(
			`
			SELECT type, price, description, source, noface, images
			FROM products
			WHERE name = $1
			`,
			[food]
		);
		const row = response.rows[0];
		if (row) {
			res.json(row);
		} else {
			throw new Error("food not found");
		}
	} catch (error) {
		next(error);
	}
});

export default router;
