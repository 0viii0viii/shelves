import { Plus } from "lucide-react";
import { useRef } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TodoFormProps {
  onAddTodo: (content: string) => void;
}

export const TodoForm = ({ onAddTodo }: TodoFormProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddTodo = () => {
    const content = inputRef.current?.value?.trim();
    if (content) {
      onAddTodo(content);
      inputRef.current!.value = "";
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTodo();
    }
  };

  return (
    <div className="flex gap-2">
      <Input
        ref={inputRef}
        placeholder="할 일을 입력하세요."
        onKeyDown={handleKeyDown}
      />
      <Button onClick={handleAddTodo} className="min-w-[40px]">
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};
