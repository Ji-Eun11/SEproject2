import { useState } from "react";
// [수정] DialogDescription 추가
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Star } from "lucide-react";

export function ReviewEditDialog({ open, onClose, placeName, review, onSave, currentUserId }: any) {
  const [rating, setRating] = useState(review.rating);
  const [content, setContent] = useState(review.content);
  const [photos, setPhotos] = useState<string[]>(review.photos || []);

  // 사진 추가
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const urls = Array.from(files).map(file => URL.createObjectURL(file));
    setPhotos([...photos, ...urls]);
  };

  // 사진 삭제
  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px]">
        <DialogHeader>
          <DialogTitle>리뷰 작성</DialogTitle>
          <DialogDescription className="sr-only">
            {placeName}에 대한 리뷰를 작성하거나 수정합니다.
          </DialogDescription>
        </DialogHeader>
        
        <div className="border-b pb-4 mb-4">
          <p className="text-sm text-gray-600">{placeName}</p>
        </div>
        
        {/* 별점 */}
        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4, 5].map(star => (
            <button key={star} onClick={() => setRating(star)}>
              <Star className={`w-8 h-8 ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`} />
            </button>
          ))}
        </div>

        {/* 리뷰 내용 */}
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력하세요"
          rows={4}
          className="mb-4"
        />

        {/* 사진 업로드 */}
        <div className="mb-4">
          <input type="file" multiple accept="image/*" onChange={handlePhotoChange} />
          <div className="flex gap-2 mt-2 flex-wrap">
            {photos.map((url, idx) => (
              <div key={idx} className="relative w-20 h-20">
                <img src={url} className="w-20 h-20 object-cover rounded" />
                <button
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1"
                  onClick={() => handleRemovePhoto(idx)}
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={onClose} variant="outline" className="flex-1">
            취소
          </Button>
          <Button
            onClick={() => onSave(rating, content, photos)}
            className="flex-1 bg-yellow-300 text-gray-900"
          >
            저장
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}