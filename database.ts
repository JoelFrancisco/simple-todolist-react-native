import * as SQLite from "expo-sqlite";

const DATABASE_NAME = "todos.sqlite";

const SQL_MIGRATIONS = [
  `PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS todos (
        todoId TEXT PRIMARY KEY,
        description TEXT,
        done INTEGER
    );`,
]

let connection: SQLite.SQLiteDatabase

async function connectToDatabase() {
  if (connection) return connection;

  connection = await SQLite.openDatabaseAsync(DATABASE_NAME);

  for (const migration of SQL_MIGRATIONS) {
    await connection.execAsync(migration);
  }

  return connection;
}

export default Object.freeze({
  connectToDatabase
});
