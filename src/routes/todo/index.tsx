import { createFileRoute } from "@tanstack/react-router";
import { ChevronsUpDown, Edit2, Plus, Save, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { getDatabase } from "@/lib/utils";

export const Route = createFileRoute("/todo/")({
  component: RouteComponent,
});

interface Todo {
  id: number;
  content: string;
  completed: boolean;
  createdAt: string;
  updatedAt?: string;
}

function RouteComponent() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const [isComepletedListOpen, setIsComepletedListOpen] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  const validateInput = (value: string) => {
    if (!value) {
      toast.error("할 일을 입력하세요.", {
        duration: 1000,
      });
      inputRef.current?.focus();
      return false;
    }
    return true;
  };

  const insertTodo = async (content: string) => {
    const db = await getDatabase();
    const now = new Date().toISOString();
    const result = await db.execute(
      "INSERT INTO todos (content, completed, createdAt) VALUES ($1, $2, $3)",
      [content, false, now],
    );
    return result;
  };

  const addTodo = async () => {
    const inputValue = inputRef.current?.value?.trim();

    try {
      if (!validateInput(inputValue || "")) {
        return;
      }

      const result = await insertTodo(inputValue!);

      // 삽입된 레코드의 실제 ID를 사용하여 새 할 일 객체 생성
      const newTodo: Todo = {
        id: result.lastInsertId as number,
        content: inputValue!,
        completed: false,
        createdAt: "",
      };

      // 상태 업데이트
      setTodos((prevTodos) => [...prevTodos, newTodo]);

      // 입력 필드 초기화 및 포커스
      inputRef.current!.value = "";
      inputRef.current?.focus();

      toast.success("할 일이 추가되었습니다.", {
        duration: 1000,
      });
    } catch (error) {
      console.error("할 일 추가에 실패했습니다:", error);

      // 에러 타입에 따른 구체적인 메시지
      const errorMessage =
        error instanceof Error
          ? `할 일 추가에 실패했습니다: ${error.message}`
          : "할 일 추가에 실패했습니다.";

      toast.error(errorMessage, {
        duration: 2000,
      });
    }
  };

  const checkTodo = async (id: number) => {
    try {
      // 현재 상태에서 해당 todo 찾기
      const currentTodo = todos.find((todo) => todo.id === id);
      if (!currentTodo) {
        console.warn(`Todo with id ${id} not found`);
        toast.error("할 일을 찾을 수 없습니다.", {
          duration: 1000,
        });
        return;
      }

      const newCompletedState = !currentTodo.completed;

      // 데이터베이스 업데이트
      const db = await getDatabase();
      await db.execute("UPDATE todos SET completed = $1 WHERE id = $2", [
        newCompletedState,
        id,
      ]);

      // 성공 시 UI 업데이트
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, completed: newCompletedState } : todo,
        ),
      );
    } catch (error) {
      console.error("할 일 상태 변경에 실패했습니다:", error);
      toast.error("할 일 상태 변경에 실패했습니다.", {
        duration: 2000,
      });
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      const db = await getDatabase();
      await db.execute("DELETE FROM todos WHERE id = $1", [id]);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
      toast.success("할 일이 삭제되었습니다.", {
        duration: 1000,
      });
    } catch (error) {
      console.error("할 일 삭제에 실패했습니다:", error);
      toast.error("할 일 삭제에 실패했습니다.", {
        duration: 2000,
      });
    }
  };

  const startEdit = (id: number, currentContent: string) => {
    setEditingId(id);
    setEditValue(currentContent);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  const saveEdit = async (id: number) => {
    try {
      if (!editValue.trim()) {
        toast.error("할 일을 입력하세요.", {
          duration: 1000,
        });
        return;
      }

      const db = await getDatabase();
      await db.execute("UPDATE todos SET content = $1 WHERE id = $2", [
        editValue.trim(),
        id,
      ]);

      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, content: editValue.trim() } : todo,
        ),
      );

      setEditingId(null);
      setEditValue("");
      toast.success("할 일이 수정되었습니다.", {
        duration: 1000,
      });
    } catch (error) {
      console.error("할 일 수정에 실패했습니다:", error);
      toast.error("할 일 수정에 실패했습니다.", {
        duration: 2000,
      });
    }
  };

  useEffect(() => {
    const fetchTodos = async () => {
      const db = await getDatabase();
      const todos = await db.select("SELECT * FROM todos");
      setTodos(todos as Todo[]);
      setLoading(false);
    };
    fetchTodos();
  }, []);

  return (
    <div className="h-full overflow-y-auto">
      <div className="flex h-full flex-col space-y-6 p-6">
        <div>
          <h1>할일 목록</h1>
        </div>
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            placeholder="할 일을 입력하세요."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addTodo();
              }
            }}
          />
          <Button onClick={addTodo} className="min-w-[40px]">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2 pb-4">
          {loading ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  할 일 목록을 불러오는 중...
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* 미완료된 할 일들 */}
              {todos
                .filter((todo) => !todo.completed)
                .map((todo) => (
                  <Card key={todo.id}>
                    <CardContent className="p-2">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          className="cursor-pointer"
                          checked={todo.completed}
                          onCheckedChange={() => {
                            checkTodo(todo.id);
                          }}
                        />
                        {editingId === todo.id ? (
                          <div className="flex items-center space-x-2 flex-1">
                            <Input
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  saveEdit(todo.id);
                                } else if (e.key === "Escape") {
                                  cancelEdit();
                                }
                              }}
                              className="flex-1"
                              autoFocus
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => saveEdit(todo.id)}
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={cancelEdit}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <>
                            <span className="flex-1">{todo.content}</span>
                            <div className="flex items-center space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => startEdit(todo.id, todo.content)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteTodo(todo.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

              {/* 완료된 할 일들이 있을 때만 Collapsible 표시 */}
              {todos.filter((todo) => todo.completed).length > 0 && (
                <Collapsible
                  open={isComepletedListOpen}
                  onOpenChange={setIsComepletedListOpen}
                  className="mt-4"
                >
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center justify-between gap-4 px-4 py-2 border mb-2 cursor-pointer hover:bg-muted/50 transition-colors">
                      <h4 className="text-sm font-semibold text-muted-foreground">
                        완료 ({todos.filter((todo) => todo.completed).length}개)
                      </h4>
                      <ChevronsUpDown className="h-4 w-4" />
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-2">
                    {todos
                      .filter((todo) => todo.completed)
                      .map((todo) => (
                        <Card key={todo.id} className="opacity-75">
                          <CardContent className="p-2">
                            <div className="flex items-center space-x-3">
                              <Checkbox
                                className="cursor-pointer"
                                checked={todo.completed}
                                onCheckedChange={() => {
                                  checkTodo(todo.id);
                                }}
                              />
                              <span className="text-muted-foreground line-through">
                                {todo.content}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="ml-auto"
                                onClick={() => deleteTodo(todo.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </CollapsibleContent>
                </Collapsible>
              )}

              {todos.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">
                      아직 할 일이 없습니다.
                    </p>
                    <p className="text-muted-foreground">
                      위에서 새로운 할 일을 추가해보세요!
                    </p>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
