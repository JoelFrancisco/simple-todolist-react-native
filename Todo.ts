import uuid from 'react-native-uuid';
import database from "./database";

export class Todo {
    private todoId: string;
    private description: string;
    private done: boolean;

    getTodoId() {
        return this.todoId;
    }

    getDescription() {
        return this.description;
    }

    isDone() {
        return this.done;
    }

    private constructor(todoId: string, description: string, done: boolean) {
        this.todoId = todoId;
        this.description = description;
        this.done = done;
    }

    static of(description: string) {
        return new Todo(uuid.v4().toString(), description, false);
    }

    toggle() {
        this.done = !this.done;
    }

    async save() {
        if (await this.exists(this.todoId)) {
            await this.saveNewTodo();
        } else {
            await this.updateExistingTodo();
        }
    }

    private async updateExistingTodo() {
        const connection = await database.connectToDatabase();

        await connection.runAsync(
            "INSERT INTO todos (todoId, description, done) VALUES (?, ?, ?)",
            this.todoId,
            this.description,
            this.done
        );
    }

    private async saveNewTodo() {
        const connection = await database.connectToDatabase();

        await connection.runAsync(
            "UPDATE todos SET description = ?, done = ? WHERE todoId = ?",
            this.description,
            this.done,
            this.todoId
        );
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
