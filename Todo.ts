import uuid from 'react-native-uuid';
import database from "./database";

export class Todo {
    todoId: string;
    description: string;
    done: boolean;

    constructor(todoId: string = uuid.v4().toString(), description: string, done: boolean = false) {
        this.todoId = todoId;
        this.description = description;
        this.done = done;
    }

    async save() {
        const connection = await database.connectToDatabase();
        if (await this.exists(this.todoId)) {
            await connection.runAsync(
                "UPDATE todos SET description = ?, done = ? WHERE todoId = ?",
                this.description,
                this.done,
                this.todoId
            );
        } else {
            await connection.runAsync(
                "INSERT INTO todos (todoId, description, done) VALUES (?, ?, ?)",
                this.todoId,
                this.description,
                this.done
            );
        }
    }

    async delete() {
        const connection = await database.connectToDatabase();
        await connection.runAsync("DELETE FROM todos WHERE todoId = ?", this.todoId);
    }

    private async exists(todoId: string): Promise<boolean> {
        const connection = await database.connectToDatabase();
        const result = await connection.getFirstAsync("SELECT 1 FROM todos WHERE todoId = ?", todoId);
        return !!result;
    }

    static async findById(todoId: string): Promise<Todo | null> {
        const connection = await database.connectToDatabase();
        const row = await connection.getFirstAsync("SELECT * FROM todos WHERE todoId = ?", todoId) as Todo | null;

        if (row) {
            return new Todo(row.todoId, row.description, row.done);
        } else {
            return null;
        }
    }

    static async findAll(): Promise<Todo[]> {
        const connection = await database.connectToDatabase();
        const rows = await connection.getAllAsync("SELECT * FROM todos") as Todo[];
        return rows.map(row => new Todo(row.todoId, row.description, row.done));
    }
}
