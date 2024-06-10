import database from "./database";

export class Todo {
    private todoId: number;
    private description: string; // Changed from number to string assuming it's a typo.
    private done: boolean;

    constructor(todoId: number, description: string, done: boolean = false) {
        this.todoId = todoId;
        this.description = description;
        this.done = done;
    }

    // Saves or updates an existing todo item.
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

    // Deletes a todo item.
    async delete() {
        const connection = await database.connectToDatabase();
        await connection.runAsync("DELETE FROM todos WHERE todoId = ?", this.todoId);
    }

    // Checks if a todo item exists.
    private async exists(todoId: number): Promise<boolean> {
        const connection = await database.connectToDatabase();
        const result = await connection.getAsync("SELECT 1 FROM todos WHERE todoId = ?", todoId);
        return !!result;
    }

    // Static method to find a todo by ID.
    static async findById(todoId: number): Promise<Todo | null> {
        const connection = await database.connectToDatabase();
        const row = await connection.getAsync("SELECT * FROM todos WHERE todoId = ?", todoId);
        if (row) {
            return new Todo(row.todoId, row.description, row.done);
        } else {
            return null;
        }
    }

    // Static method to get all todos.
    static async findAll(): Promise<Todo[]> {
        const connection = await database.connectToDatabase();
        const rows = await connection.allAsync("SELECT * FROM todos");
        return rows.map(row => new Todo(row.todoId, row.description, row.done));
    }
}