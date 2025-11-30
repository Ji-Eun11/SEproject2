import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { PlaceCard } from "./PlaceCard";

export function WizardDialog({ open, onClose, places, onPlaceClick }: any) {
  const [step, setStep] = useState(0);

  // 질문 배열 (Q3, Q4 추가)
  const questions = [
    { id: 1, q: "크기는?", o: ["소형", "중형", "대형"] },
    { id: 2, q: "성격은?", o: ["활발", "조용"] },
    { id: 3, q: "활동 선호?", o: ["야외", "실내"] },
    { id: 4, q: "거리 선호?", o: ["가까움", "중간", "멀리"] },
  ];

  const handleRestart = () => setStep(0);
  const handleExit = () => onClose();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="text-yellow-400" /> 마법사 추천
          </DialogTitle>
          <DialogDescription className="sr-only">
            몇 가지 질문에 답하고 딱 맞는 장소를 추천받으세요.
          </DialogDescription>
        </DialogHeader>

        {step < questions.length ? (
          <div className="py-6 text-center">
            {/* 진행 상황 표시 */}
            <div className="mb-4 text-gray-500">{`질문 ${step + 1} / ${questions.length}`}</div>

            <h3 className="text-2xl mb-8">{questions[step].q}</h3>
            <div className="grid grid-cols-3 gap-4">
              {questions[step].o.map(opt => (
                <button
                  key={opt}
                  onClick={() => setStep(step + 1)}
                  className="p-6 border rounded-2xl hover:bg-yellow-50"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-6">
            <h3 className="text-xl mb-4">추천 장소</h3>
            <div className="grid grid-cols-3 gap-4">
              {places.slice(0, 3).map((p: any) => (
                <PlaceCard
                  key={p.id}
                  {...p}
                  onClick={() => {
                    onPlaceClick(p.id);
                    onClose();
                  }}
                />
              ))}
            </div>

            <div className="flex gap-4 mt-6">
              <Button onClick={handleRestart} className="flex-1 bg-yellow-300 text-gray-900 hover:bg-yellow-400">
                다시 시작
              </Button>
              <Button onClick={handleExit} variant="outline" className="flex-1">
                종료하기
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
