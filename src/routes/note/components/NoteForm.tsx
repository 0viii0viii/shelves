import { Plus } from "lucide-react";
import { useRef } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NoteFormProps {
  onAddNote: (title: string) => void;
}

export const NoteForm = ({ onAddNote }: NoteFormProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddNote = () => {
    const title = inputRef.current?.value?.trim();
    if (title) {
      onAddNote(title);
      inputRef.current!.value = "";
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddNote();
    }
  };

  return (
    <div className="flex gap-2">
      <Input
        ref={inputRef}
        placeholder="노트 제목을 입력하세요."
        onKeyDown={handleKeyDown}
      />
      <Button onClick={handleAddNote} className="min-w-[40px]">
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};
