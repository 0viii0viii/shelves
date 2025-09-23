import { getDatabase } from "@/lib/utils";

export type Note = {
  id: number;
  title: string;
  isLocked: number;
  password?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt?: string;
};

export type Memo = {
  id: number;
  noteId: number;
  content: string;
  sortOrder: number;
  createdAt: string;
  updatedAt?: string;
};

export type CreateNoteData = {
  title: string;
  isLocked?: boolean;
  password?: string;
};

export type UpdateNoteData = {
  title?: string;
  isLocked?: boolean;
  password?: string;
  sortOrder?: number;
};

export type CreateMemoData = {
  noteId: number;
  content: string;
};

export type UpdateMemoData = {
  content?: string;
  sortOrder?: number;
};

export class NoteService {
  private static async getDb() {
    return await getDatabase();
  }

  // 노트 관련 메서드들
  static async getAllNotes(): Promise<Note[]> {
    try {
      const db = await this.getDb();
      const notes = await db.select(
        "SELECT * FROM notes ORDER BY sortOrder ASC, createdAt DESC",
      );
      return notes as Note[];
    } catch (error) {
      console.error("노트 목록 조회에 실패했습니다:", error);
      throw new Error("노트 목록을 불러오는데 실패했습니다.");
    }
  }

  static async createNote(data: CreateNoteData): Promise<Note> {
    try {
      const db = await this.getDb();
      const now = new Date().toISOString();

      // 새로운 노트의 sortOrder 값을 설정 (기존 최대값 + 1)
      const maxOrderResult: { maxOrder: number }[] = await db.select(
        "SELECT COALESCE(MAX(sortOrder), 0) as maxOrder FROM notes",
      );
      const maxOrder = maxOrderResult[0].maxOrder;
      const newSortOrder = maxOrder + 1;

      const result = await db.execute(
        "INSERT INTO notes (title, isLocked, password, sortOrder, createdAt) VALUES ($1, $2, $3, $4, $5)",
        [
          data.title,
          data.isLocked ? 1 : 0,
          data.password || null,
          newSortOrder,
          now,
        ],
      );

      return {
        id: result.lastInsertId as number,
        title: data.title,
        isLocked: data.isLocked ? 1 : 0,
        password: data.password,
        sortOrder: newSortOrder,
        createdAt: now,
      };
    } catch (error) {
      console.error("노트 생성에 실패했습니다:", error);
      throw new Error("노트 생성에 실패했습니다.");
    }
  }

  static async updateNote(id: number, data: UpdateNoteData): Promise<void> {
    try {
      const db = await this.getDb();

      const updateFields: string[] = [];
      const values: unknown[] = [];
      let paramIndex = 1;

      if (data.title !== undefined) {
        updateFields.push(`title = $${paramIndex}`);
        values.push(data.title);
        paramIndex++;
      }

      if (data.isLocked !== undefined) {
        updateFields.push(`isLocked = $${paramIndex}`);
        values.push(data.isLocked ? 1 : 0);
        paramIndex++;
      }

      if (data.password !== undefined) {
        updateFields.push(`password = $${paramIndex}`);
        values.push(data.password);
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

      const query = `UPDATE notes SET ${updateFields.join(
        ", ",
      )} WHERE id = $${paramIndex}`;

      await db.execute(query, values);
    } catch (error) {
      console.error("노트 업데이트에 실패했습니다:", error);
      throw new Error("노트 업데이트에 실패했습니다.");
    }
  }

  static async deleteNote(id: number): Promise<void> {
    try {
      const db = await this.getDb();
      // 노트를 삭제하면 관련된 모든 메모도 삭제됩니다
      await db.execute("DELETE FROM memos WHERE noteId = $1", [id]);
      await db.execute("DELETE FROM notes WHERE id = $1", [id]);
    } catch (error) {
      console.error("노트 삭제에 실패했습니다:", error);
      throw new Error("노트 삭제에 실패했습니다.");
    }
  }

  static async updateNoteOrder(notes: Note[]): Promise<void> {
    try {
      const db = await this.getDb();

      if (notes.length === 0) return;

      // CASE 문으로 한 번의 쿼리로 모든 순서 업데이트
      const ids = notes.map((note) => note.id);
      const caseStatements = notes
        .map((note, index) => `WHEN id = ${note.id} THEN ${index + 1}`)
        .join(" ");

      const placeholders = ids.map((_, index) => `$${index + 2}`).join(",");

      const query = `
        UPDATE notes 
        SET sortOrder = CASE ${caseStatements} END,
            updatedAt = $1
        WHERE id IN (${placeholders})
      `;

      const values = [new Date().toISOString(), ...ids];
      await db.execute(query, values);
    } catch (error) {
      console.error("노트 순서 업데이트에 실패했습니다:", error);
      throw new Error("노트 순서 업데이트에 실패했습니다.");
    }
  }

  // 메모 관련 메서드들
  static async getMemosByNoteId(noteId: number): Promise<Memo[]> {
    try {
      const db = await this.getDb();
      const memos = await db.select(
        "SELECT * FROM memos WHERE noteId = $1 ORDER BY sortOrder ASC, createdAt DESC",
        [noteId],
      );
      return memos as Memo[];
    } catch (error) {
      console.error("메모 목록 조회에 실패했습니다:", error);
      throw new Error("메모 목록을 불러오는데 실패했습니다.");
    }
  }

  static async createMemo(data: CreateMemoData): Promise<Memo> {
    try {
      const db = await this.getDb();
      const now = new Date().toISOString();

      // 새로운 메모의 sortOrder 값을 설정 (해당 노트의 최대값 + 1)
      const maxOrderResult: { maxOrder: number }[] = await db.select(
        "SELECT COALESCE(MAX(sortOrder), 0) as maxOrder FROM memos WHERE noteId = $1",
        [data.noteId],
      );
      const maxOrder = maxOrderResult[0].maxOrder;
      const newSortOrder = maxOrder + 1;

      const result = await db.execute(
        "INSERT INTO memos (noteId, content, sortOrder, createdAt) VALUES ($1, $2, $3, $4)",
        [data.noteId, data.content, newSortOrder, now],
      );

      return {
        id: result.lastInsertId as number,
        noteId: data.noteId,
        content: data.content,
        sortOrder: newSortOrder,
        createdAt: now,
      };
    } catch (error) {
      console.error("메모 생성에 실패했습니다:", error);
      throw new Error("메모 생성에 실패했습니다.");
    }
  }

  static async updateMemo(id: number, data: UpdateMemoData): Promise<void> {
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

      const query = `UPDATE memos SET ${updateFields.join(
        ", ",
      )} WHERE id = $${paramIndex}`;

      await db.execute(query, values);
    } catch (error) {
      console.error("메모 업데이트에 실패했습니다:", error);
      throw new Error("메모 업데이트에 실패했습니다.");
    }
  }

  static async deleteMemo(id: number): Promise<void> {
    try {
      const db = await this.getDb();
      await db.execute("DELETE FROM memos WHERE id = $1", [id]);
    } catch (error) {
      console.error("메모 삭제에 실패했습니다:", error);
      throw new Error("메모 삭제에 실패했습니다.");
    }
  }

  static async updateMemoOrder(memos: Memo[]): Promise<void> {
    try {
      const db = await this.getDb();

      if (memos.length === 0) return;

      // CASE 문으로 한 번의 쿼리로 모든 순서 업데이트
      const ids = memos.map((memo) => memo.id);
      const caseStatements = memos
        .map((memo, index) => `WHEN id = ${memo.id} THEN ${index + 1}`)
        .join(" ");

      const placeholders = ids.map((_, index) => `$${index + 2}`).join(",");

      const query = `
        UPDATE memos 
        SET sortOrder = CASE ${caseStatements} END,
            updatedAt = $1
        WHERE id IN (${placeholders})
      `;

      const values = [new Date().toISOString(), ...ids];
      await db.execute(query, values);
    } catch (error) {
      console.error("메모 순서 업데이트에 실패했습니다:", error);
      throw new Error("메모 순서 업데이트에 실패했습니다.");
    }
  }
}
