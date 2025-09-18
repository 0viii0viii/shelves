import { getDatabase } from "@/lib/utils";

export type Todo = {
  id: number;
  content: string;
  completed: number;
  sortOrder: number;
  createdAt: string;
  updatedAt?: string;
};

export type CreateTodoData = {
  content: string;
};

export type UpdateTodoData = {
  content?: string;
  completed?: number;
  sortOrder?: number;
};

export class TodoService {
  private static async getDb() {
    return await getDatabase();
  }

  static async getAllTodos(): Promise<Todo[]> {
    try {
      const db = await this.getDb();
      const todos = await db.select(
        "SELECT * FROM todos ORDER BY sortOrder ASC, createdAt DESC",
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

      // 새로운 todo의 sortOrder 값을 설정 (기존 최대값 + 1)
      const maxOrderResult: { maxOrder: number }[] = await db.select(
        "SELECT COALESCE(MAX(sortOrder), 0) as maxOrder FROM todos",
      );
      const maxOrder = maxOrderResult[0].maxOrder;
      const newSortOrder = maxOrder + 1;

      const result = await db.execute(
        "INSERT INTO todos (content, completed, sortOrder, createdAt) VALUES ($1, $2, $3, $4)",
        [data.content, 0, newSortOrder, now],
      );

      return {
        id: result.lastInsertId as number,
        content: data.content,
        completed: 0,
        sortOrder: newSortOrder,
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
        values.push(data.completed ? 1 : 0);
        paramIndex++;
      }

      if (data.sortOrder !== undefined) {
        updateFields.push(`sortOrder = $${paramIndex}`);
        values.push(data.sortOrder);
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
    currentCompleted: number,
  ): Promise<void> {
    try {
      await this.updateTodo(id, { completed: currentCompleted ? 0 : 1 });
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

  static async updateTodoOrder(todos: Todo[]): Promise<void> {
    try {
      const db = await this.getDb();

      if (todos.length === 0) return;

      // CASE 문으로 한 번의 쿼리로 모든 순서 업데이트
      const ids = todos.map((todo) => todo.id);
      const caseStatements = todos
        .map((todo, index) => `WHEN id = ${todo.id} THEN ${index + 1}`)
        .join(" ");

      const placeholders = ids.map((_, index) => `$${index + 2}`).join(",");

      const query = `
        UPDATE todos 
        SET sortOrder = CASE ${caseStatements} END,
            updatedAt = $1
        WHERE id IN (${placeholders})
      `;

      const values = [new Date().toISOString(), ...ids];
      await db.execute(query, values);
    } catch (error) {
      console.error("할 일 순서 업데이트에 실패했습니다:", error);
      throw new Error("할 일 순서 업데이트에 실패했습니다.");
    }
  }
}
