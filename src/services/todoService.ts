import { getDatabase } from "@/lib/utils";

export type Todo = {
  id: number;
  content: string;
  completed: boolean;
  createdAt: string;
  updatedAt?: string;
};

export type CreateTodoData = {
  content: string;
};

export type UpdateTodoData = {
  content?: string;
  completed?: boolean;
};

export class TodoService {
  private static async getDb() {
    return await getDatabase();
  }

  static async getAllTodos(): Promise<Todo[]> {
    try {
      const db = await this.getDb();
      const todos = await db.select(
        "SELECT * FROM todos ORDER BY createdAt DESC",
      );
      return todos as Todo[];
    } catch (error) {
      console.error("할 일 목록 조회에 실패했습니다:", error);
      throw new Error("할 일 목록을 불러오는데 실패했습니다.");
    }
  }

  static async createTodo(data: CreateTodoData): Promise<Todo> {
    try {
      const db = await this.getDb();
      const now = new Date().toISOString();

      const result = await db.execute(
        "INSERT INTO todos (content, completed, createdAt) VALUES ($1, $2, $3)",
        [data.content, false, now],
      );

      return {
        id: result.lastInsertId as number,
        content: data.content,
        completed: false,
        createdAt: now,
      };
    } catch (error) {
      console.error("할 일 생성에 실패했습니다:", error);
      throw new Error("할 일 생성에 실패했습니다.");
    }
  }

  static async updateTodo(id: number, data: UpdateTodoData): Promise<void> {
    try {
      const db = await this.getDb();

      const updateFields: string[] = [];
      const values: unknown[] = [];
      let paramIndex = 1;

      if (data.content !== undefined) {
        updateFields.push(`content = $${paramIndex}`);
        values.push(data.content);
        paramIndex++;
      }

      if (data.completed !== undefined) {
        updateFields.push(`completed = $${paramIndex}`);
        values.push(data.completed);
        paramIndex++;
      }

      if (updateFields.length === 0) {
        throw new Error("업데이트할 데이터가 없습니다.");
      }

      updateFields.push(`updatedAt = $${paramIndex}`);
      values.push(new Date().toISOString());
      paramIndex++;

      values.push(id);

      const query = `UPDATE todos SET ${updateFields.join(
        ", ",
      )} WHERE id = $${paramIndex}`;

      await db.execute(query, values);
    } catch (error) {
      console.error("할 일 업데이트에 실패했습니다:", error);
      throw new Error("할 일 업데이트에 실패했습니다.");
    }
  }

  static async deleteTodo(id: number): Promise<void> {
    try {
      const db = await this.getDb();
      await db.execute("DELETE FROM todos WHERE id = $1", [id]);
    } catch (error) {
      console.error("할 일 삭제에 실패했습니다:", error);
      throw new Error("할 일 삭제에 실패했습니다.");
    }
  }

  static async toggleTodoCompletion(
    id: number,
    currentCompleted: boolean,
  ): Promise<void> {
    try {
      await this.updateTodo(id, { completed: !currentCompleted });
    } catch (error) {
      console.error("할 일 상태 변경에 실패했습니다:", error);
      throw new Error("할 일 상태 변경에 실패했습니다.");
    }
  }

  static async updateTodoContent(id: number, content: string): Promise<void> {
    try {
      await this.updateTodo(id, { content });
    } catch (error) {
      console.error("할 일 내용 수정에 실패했습니다:", error);
      throw new Error("할 일 내용 수정에 실패했습니다.");
    }
  }
}
