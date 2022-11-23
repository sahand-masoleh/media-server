import pg from "pg";
const pool = new pg.Pool();
export function query(string: string, params?: any) {
	return pool.query(string, params);
}
