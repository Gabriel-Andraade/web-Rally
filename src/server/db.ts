import mysql from "mysql2/promise";

export async function getDb() {
  const connection = await mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: "gabriel",
    password: "08032005",
    database: "web_rally",
  });
  return connection;
}
