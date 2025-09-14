import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/todo")({
  component: RouteComponent,
});

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

function RouteComponent() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(true);

  return (
    <div className="flex h-full flex-col space-y-6 p-6">
      <div>
        <h1>할일 목록</h1>
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="할 일을 입력하세요."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <Button>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto pb-4">
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
            {todos.map((todo) => (
              <Card
                key={todo.id}
                className={`${todo.completed ? "opacity-75" : ""}`}
              >
                <CardContent className="p-2">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() => {}}
                    />
                    <span
                      className={
                        todo.completed
                          ? "text-muted-foreground line-through"
                          : ""
                      }
                    >
                      {todo.text}
                    </span>
                    <Button variant="ghost" size="sm" className="ml-auto">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

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
  );
}
