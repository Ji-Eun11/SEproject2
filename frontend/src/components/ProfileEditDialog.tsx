import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription, // [핵심] 접근성 경고 해결을 위해 추가
} from "./ui/dialog";

interface ProfileEditDialogProps {
  open: boolean;
  onClose: () => void;
  currentNickname: string;
  profileInitial?: string; // 사용하지 않더라도 받아두거나 생략 가능
  onSave: (newNickname: string) => void;
}

export function ProfileEditDialog({
  open,
  onClose,
  currentNickname,
  onSave,
}: ProfileEditDialogProps) {
  const [nickname, setNickname] = useState(currentNickname);

  // 다이얼로그가 열릴 때마다 닉네임을 현재 값으로 초기화
  useEffect(() => {
    if (open) {
      setNickname(currentNickname);
    }
  }, [open, currentNickname]);

  const handleSave = () => {
    onSave(nickname);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>프로필 수정</DialogTitle>
          {/* [추가] 화면에는 보이지 않지만(sr-only), 접근성 규칙을 지키기 위한 설명 */}
          <DialogDescription className="text-gray-500">
            다른 사용자에게 보여질 닉네임을 변경할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Label htmlFor="nickname" className="text-right">
            닉네임
          </Label>
          <Input
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="mt-2"
            placeholder="새로운 닉네임을 입력하세요"
          />
        </div>

        <div className="flex gap-3">
          <Button onClick={onClose} variant="outline" className="flex-1">
            취소
          </Button>
          <Button onClick={handleSave} className="flex-1 bg-yellow-300 text-gray-900 hover:bg-yellow-400">
            저장
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}