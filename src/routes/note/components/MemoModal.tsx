import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Lock, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Memo, NoteService } from "@/services/noteService";

import { PasswordDialog } from "./PasswordDialog";
import { SortableMemoItem } from "./SortableMemoItem";

interface MemoModalProps {
  note: {
    id: number;
    title: string;
    isLocked: number;
    password?: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MemoModal({ note, isOpen, onClose }: MemoModalProps) {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [newMemoContent, setNewMemoContent] = useState("");
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const loadMemos = async () => {
    if (!note) return;

    try {
      const memosData = await NoteService.getMemosByNoteId(note.id);
      setMemos(memosData);
    } catch (error) {
      console.error("메모 로딩 실패:", error);
    }
  };

  useEffect(() => {
    if (isOpen && note) {
      if (note.isLocked && !isAuthenticated) {
        setIsPasswordDialogOpen(true);
      } else {
        loadMemos();
      }
    }
  }, [isOpen, note, isAuthenticated]);

  useEffect(() => {
    if (!isOpen) {
      setIsAuthenticated(false);
    }
  }, [isOpen]);

  const handleCreateMemo = async () => {
    if (!newMemoContent.trim() || !note) return;

    try {
      const newMemo = await NoteService.createMemo({
        noteId: note.id,
        content: newMemoContent.trim(),
      });
      setMemos((prev) => [newMemo, ...prev]);
      setNewMemoContent("");
    } catch (error) {
      console.error("메모 생성 실패:", error);
    }
  };

  const handleUpdateMemo = async (id: number, content: string) => {
    try {
      await NoteService.updateMemo(id, { content });
      setMemos((prev) =>
        prev.map((memo) => (memo.id === id ? { ...memo, content } : memo)),
      );
    } catch (error) {
      console.error("메모 업데이트 실패:", error);
    }
  };

  const handleDeleteMemo = async (id: number) => {
    try {
      await NoteService.deleteMemo(id);
      setMemos((prev) => prev.filter((memo) => memo.id !== id));
    } catch (error) {
      console.error("메모 삭제 실패:", error);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = memos.findIndex((memo) => memo.id === active.id);
      const newIndex = memos.findIndex((memo) => memo.id === over.id);

      const newMemos = arrayMove(memos, oldIndex, newIndex);
      setMemos(newMemos);

      try {
        await NoteService.updateMemoOrder(newMemos);
      } catch (error) {
        console.error("메모 순서 업데이트 실패:", error);
        // 실패 시 원래 순서로 되돌리기
        loadMemos();
      }
    }
  };

  const handlePasswordConfirm = (password: string) => {
    if (note && note.password === password) {
      setIsAuthenticated(true);
      setIsPasswordDialogOpen(false);
    } else {
      toast.error("비밀번호가 일치하지 않습니다.");
    }
  };

  const handlePasswordDialogClose = () => {
    setIsPasswordDialogOpen(false);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCreateMemo();
    }
  };

  if (!note) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {note.isLocked ? (
              <Lock className="h-4 w-4 text-muted-foreground" />
            ) : null}
            {note.title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* 새 메모 추가 */}
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="메모 내용을 입력하세요"
              value={newMemoContent}
              onChange={(e) => setNewMemoContent(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button
              onClick={handleCreateMemo}
              className="min-w-[40px]"
              disabled={!newMemoContent.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* 메모 목록 */}
          <div className="flex-1 overflow-y-auto min-h-0">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={memos.map((memo) => memo.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {memos.map((memo) => (
                    <SortableMemoItem
                      key={memo.id}
                      memo={memo}
                      onUpdate={handleUpdateMemo}
                      onDelete={handleDeleteMemo}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </div>
      </DialogContent>

      <PasswordDialog
        isOpen={isPasswordDialogOpen}
        onClose={handlePasswordDialogClose}
        onConfirm={handlePasswordConfirm}
        title={note.title}
      />
    </Dialog>
  );
}
