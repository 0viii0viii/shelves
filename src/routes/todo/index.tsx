import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { type Todo, TodoService } from "@/services/todoService";

import { CompletedTodosList } from "./components/CompletedTodosList";
import { EmptyState } from "./components/EmptyState";
import { LoadingState } from "./components/LoadingState";
import { TodoForm } from "./components/TodoForm";
import { TodoItem } from "./components/TodoItem";
import { TODO_MESSAGES } from "./constants";
import {
  getCompletedTodos,
  getIncompleteTodos,
  showErrorToast,
  showSuccessToast,
  validateTodoInput,
} from "./utils";

export const Route = createFileRoute("/todo/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  const addTodo = async (content: string) => {
    try {
      if (!validateTodoInput(content)) return;

      const newTodo = await TodoService.createTodo({
        content,
      });

      setTodos((prevTodos) => [...prevTodos, newTodo]);
      showSuccessToast(TODO_MESSAGES.ADD_SUCCESS);
    } catch (error) {
      console.error("할 일 추가에 실패했습니다:", error);
      showErrorToast(TODO_MESSAGES.ADD_ERROR);
    }
  };

  const checkTodo = async (id: number) => {
    try {
      const currentTodo = todos.find((todo) => todo.id === id);
      if (!currentTodo) {
        console.warn(`Todo with id ${id} not found`);
        showErrorToast(TODO_MESSAGES.NOT_FOUND);
        return;
      }

      await TodoService.toggleTodoCompletion(id, currentTodo.completed);

      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo,
        ),
      );
    } catch (error) {
      console.error("할 일 상태 변경에 실패했습니다:", error);
      showErrorToast(TODO_MESSAGES.TOGGLE_ERROR);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await TodoService.deleteTodo(id);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
      showSuccessToast(TODO_MESSAGES.DELETE_SUCCESS);
    } catch (error) {
      console.error("할 일 삭제에 실패했습니다:", error);
      showErrorToast(TODO_MESSAGES.DELETE_ERROR);
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
      if (!validateTodoInput(editValue)) return;

      await TodoService.updateTodoContent(id, editValue.trim());

      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, content: editValue.trim() } : todo,
        ),
      );

      setEditingId(null);
      setEditValue("");
      showSuccessToast(TODO_MESSAGES.UPDATE_SUCCESS);
    } catch (error) {
      console.error("할 일 수정에 실패했습니다:", error);
      showErrorToast(TODO_MESSAGES.UPDATE_ERROR);
    }
  };

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const todos = await TodoService.getAllTodos();
        setTodos(todos);
      } catch (error) {
        console.error("할 일 목록을 불러오는데 실패했습니다:", error);
        showErrorToast(TODO_MESSAGES.LOAD_ERROR);
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, []);

  return (
    <div className="h-full overflow-y-auto">
      <div className="flex h-full flex-col space-y-6 p-6">
        <div>
          <h1>할일 목록</h1>
        </div>

        <TodoForm onAddTodo={addTodo} />

        <div className="space-y-2 pb-4">
          {loading ? (
            <LoadingState />
          ) : (
            <>
              {/* 미완료된 할 일들 */}
              {getIncompleteTodos(todos).map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  isEditing={editingId === todo.id}
                  editValue={editValue}
                  onToggle={checkTodo}
                  onDelete={deleteTodo}
                  onStartEdit={startEdit}
                  onSaveEdit={saveEdit}
                  onCancelEdit={cancelEdit}
                  onEditValueChange={setEditValue}
                />
              ))}

              {/* 완료된 할 일들 */}
              <CompletedTodosList
                todos={getCompletedTodos(todos)}
                onToggle={checkTodo}
                onDelete={deleteTodo}
              />

              {/* 빈 상태 */}
              {todos.length === 0 && <EmptyState />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
