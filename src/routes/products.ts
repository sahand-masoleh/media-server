import { response, Router } from "express";
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

router.get("/list-all", async (req, res, next) => {
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

type Path = Pick<Productable, "id" | "name">;

router.get("/list-paths", async (req, res, next) => {
	try {
		const response: QueryResult<Path> = await db.query(
			"SELECT id, name FROM products"
		);
		res.json(response.rows);
	} catch (error) {
		next(error);
	}
});

/* each food */

type Food = Pick<
	Productable,
	"id" | "type" | "price" | "description" | "source" | "noface" | "images"
>;

router.get("/single/:food", async (req, res, next) => {
	const { food } = req.params || {};
	try {
		const response: QueryResult<Food> = await db.query(
			`
			SELECT id, type, price, description, source, noface, images
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

/* list of items for checkout */

type CartItem = Pick<Productable, "id" | "name" | "price" | "cover">;

router.get("/list-cart", async (req, res, next) => {
	let ids = req.query.id as string | string[];

	/* make sure ids is always an array as single params are not put in arrays by default */
	if (!Array.isArray(ids)) {
		ids = [ids];
	}

	try {
		const response: QueryResult<CartItem[]> = await db.query(
			`
			SELECT id, name, price, cover
			FROM products
			WHERE id = ANY($1)
			`,
			[ids]
		);
		res.json(response.rows);
	} catch (error) {
		next(error);
	}
});

export default router;
