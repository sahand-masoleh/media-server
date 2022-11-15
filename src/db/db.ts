import pg from "pg";
const pool = new pg.Pool();
export function query(string: string, params?: string[]) {
	return pool.query(string, params);
}
