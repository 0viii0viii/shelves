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

import { Note, NoteService } from "@/services/noteService";

import { NoteForm } from "./NoteForm";
import { SortableNoteCard } from "./SortableNoteCard";

interface NoteListProps {
  onOpenNote: (note: Note) => void;
}

export function NoteList({ onOpenNote }: NoteListProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const loadNotes = async () => {
    try {
      setIsLoading(true);
      const notesData = await NoteService.getAllNotes();
      setNotes(notesData);
    } catch (error) {
      console.error("노트 로딩 실패:", error);
    } finally {
      setIsLoading(false);
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

  const handleDeleteNote = async (id: number) => {
    if (!confirm("노트를 삭제하시겠습니까? 모든 메모가 함께 삭제됩니다.")) {
      return;
    }

    try {
      await NoteService.deleteNote(id);
      setNotes((prev) => prev.filter((note) => note.id !== id));
    } catch (error) {
      console.error("노트 삭제 실패:", error);
    }
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

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="border rounded-lg p-2 bg-card animate-pulse">
            <div className="h-4 bg-muted rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <NoteForm onAddNote={handleCreateNote} />
      <div className="space-y-2 pb-4">
        {notes.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>아직 노트가 없습니다.</p>
            <p className="text-sm">새 노트를 만들어보세요!</p>
          </div>
        ) : (
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
        )}
      </div>
    </>
  );
}
