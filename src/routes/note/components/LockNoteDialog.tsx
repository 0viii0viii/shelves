import { Lock, Unlock } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LockNoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (isLocked: boolean, password?: string) => void;
  noteTitle: string;
  currentIsLocked: boolean;
}

export function LockNoteDialog({
  isOpen,
  onClose,
  onConfirm,
  noteTitle,
  currentIsLocked,
}: LockNoteDialogProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (currentIsLocked) {
      // 잠금 해제
      onConfirm(false);
    } else {
      // 잠금 설정
      if (password !== confirmPassword) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
      }
      if (password.length < 4) {
        alert("비밀번호는 4자 이상이어야 합니다.");
        return;
      }
      onConfirm(true, password);
    }

    setPassword("");
    setConfirmPassword("");
  };

  const handleClose = () => {
    setPassword("");
    setConfirmPassword("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {currentIsLocked ? (
              <Unlock className="h-5 w-5" />
            ) : (
              <Lock className="h-5 w-5" />
            )}
            {currentIsLocked ? "노트 잠금 해제" : "노트 잠금 설정"}
          </DialogTitle>
          <DialogDescription>
            {noteTitle} 노트를
            {currentIsLocked ? "잠금 해제" : "잠그시겠습니까?"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!currentIsLocked && (
            <>
              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="비밀번호를 입력하세요 (4자 이상)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="비밀번호를 다시 입력하세요"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={4}
                />
              </div>
            </>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              취소
            </Button>
            <Button type="submit">
              {currentIsLocked ? "잠금 해제" : "잠금 설정"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
