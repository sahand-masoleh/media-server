import pg from "pg";

let config: pg.PoolConfig = {};

if (process.env.NODE_ENV === "production") {
	config = {
		connectionString: process.env.DATABASE_URL,
		ssl: false,
	};
}

const pool = new pg.Pool(config);

export function query(string: string, params?: any) {
	return pool.query(string, params);
}
