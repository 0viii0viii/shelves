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
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Note, NoteService } from "@/services/noteService";

import { NoteForm } from "./NoteForm";
import { SortableNoteCard } from "./SortableNoteCard";

interface NoteListProps {
  onOpenNote: (note: Note) => void;
}

export function NoteList({ onOpenNote }: NoteListProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const loadNotes = async () => {
    try {
      const notesData = await NoteService.getAllNotes();
      setNotes(notesData);
    } catch (error) {
      console.error("노트 로딩 실패:", error);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleCreateNote = async (title: string) => {
    try {
      const newNote = await NoteService.createNote({
        title: title.trim(),
      });
      setNotes((prev) => [newNote, ...prev]);
    } catch (error) {
      console.error("노트 생성 실패:", error);
    }
  };

  const handleUpdateNote = async (id: number, title: string) => {
    try {
      await NoteService.updateNote(id, { title });
      setNotes((prev) =>
        prev.map((note) => (note.id === id ? { ...note, title } : note)),
      );
    } catch (error) {
      console.error("노트 업데이트 실패:", error);
    }
  };

  const handleDeleteNote = (id: number) => {
    setNoteToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteNote = async () => {
    if (!noteToDelete) return;

    try {
      await NoteService.deleteNote(noteToDelete);
      setNotes((prev) => prev.filter((note) => note.id !== noteToDelete));
      setIsDeleteDialogOpen(false);
      setNoteToDelete(null);
    } catch (error) {
      console.error("노트 삭제 실패:", error);
    }
  };

  const cancelDeleteNote = () => {
    setIsDeleteDialogOpen(false);
    setNoteToDelete(null);
  };

  const handleLockChange = async (
    id: number,
    isLocked: boolean,
    password?: string,
  ) => {
    try {
      await NoteService.updateNote(id, { isLocked, password });
      setNotes((prev) =>
        prev.map((note) =>
          note.id === id
            ? { ...note, isLocked: isLocked ? 1 : 0, password }
            : note,
        ),
      );
    } catch (error) {
      console.error("노트 잠금 설정 실패:", error);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = notes.findIndex((note) => note.id === active.id);
      const newIndex = notes.findIndex((note) => note.id === over.id);

      const newNotes = arrayMove(notes, oldIndex, newIndex);
      setNotes(newNotes);

      try {
        await NoteService.updateNoteOrder(newNotes);
      } catch (error) {
        console.error("노트 순서 업데이트 실패:", error);
        // 실패 시 원래 순서로 되돌리기
        loadNotes();
      }
    }
  };

  return (
    <>
      <NoteForm onAddNote={handleCreateNote} />
      <div className="space-y-2 pb-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={notes.map((note) => note.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {notes.map((note) => (
                <SortableNoteCard
                  key={note.id}
                  note={note}
                  onUpdate={handleUpdateNote}
                  onDelete={handleDeleteNote}
                  onOpen={onOpenNote}
                  onLockChange={handleLockChange}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* 삭제 확인 Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>노트 삭제</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              정말로 이 노트를 삭제하시겠습니까? 모든 메모가 함께 삭제되며, 이
              작업은 되돌릴 수 없습니다.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={cancelDeleteNote}>
              취소
            </Button>
            <Button variant="destructive" onClick={confirmDeleteNote}>
              삭제
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
