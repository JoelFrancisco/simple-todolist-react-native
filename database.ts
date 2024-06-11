import * as SQLite from "expo-sqlite";

const DATABASE_NAME = "todos.sqlite";

const SQL_MIGRATIONS = [
  `PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS todos (
        todoId INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT,
        done INTEGER
    );`,
]

let connection: SQLite.SQLiteDatabase

async function connectToDatabase() {
  if (connection) return connection;

  connection = await SQLite.openDatabaseAsync("todos");

  for (const migration of SQL_MIGRATIONS) {
    await connection.execAsync(migration);
  }

  return connection;
}

// async function executeSql(query: string, params: string[] = []) {
//   const connection = await connectToDatabase();


//   return new Promise((resolve, reject) => {
//     connection.transaction(tx => {
//       tx.executeSql(
//         query,
//         params,
//         (_, rs) => resolve(rs),
//         (_, err) => reject(err)
//       );
//     });
//   });
// }

export default Object.freeze({
  connectToDatabase
});

/*
export function executeSql(query, params = []) {
  if (!_db) {
    openDB();
  }

  return new Promise((resolve, reject) => {
    _db.transaction(tx => {
      tx.executeSql(
        query,
        params,
        (_, rs) => resolve(rs),
        (_, err) => reject(err)
      );
    });
  });
}

export default function openDB() {
  if (!_db) {
    _db = SQLite.openDatabase(DATABASE_NAME);
    _db.transaction(
      tx => {
        SQL_CREATE_ENTRIES.map(query => {
          tx.executeSql(query);
        });
      },
      err => console.warn(err),
      () => console.log(`Banco iniciado`)
    );
  }

  return _db;
}
*/
