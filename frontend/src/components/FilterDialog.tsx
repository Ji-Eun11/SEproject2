import { useState } from "react";
// [수정] Dialog 관련 컴포넌트 임포트 확인
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
// [수정] Dog 아이콘 추가
import { X, Car, Wifi, Coffee, UtensilsCrossed, Trees, Waves, Dumbbell, Scissors, Dog } from "lucide-react";

export interface FilterState { amenities: string[]; petSizes: string[]; placeTypes: string[]; }
interface FilterDialogProps { open: boolean; onClose: () => void; onApply: (filters: FilterState) => void; }

export function FilterDialog({ open, onClose, onApply }: FilterDialogProps) {
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedPetSizes, setSelectedPetSizes] = useState<string[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedPlaceTypes, setSelectedPlaceTypes] = useState<string[]>([]);

  const amenities = [
    { id: "parking", label: "주차", icon: Car }, 
    { id: "wifi", label: "Wi-Fi", icon: Wifi },
    { id: "cafe", label: "카페", icon: Coffee }, 
    { id: "restaurant", label: "음식점", icon: UtensilsCrossed },
    { id: "outdoor", label: "야외", icon: Trees }, 
    { id: "water", label: "물놀이", icon: Waves },
    { id: "exercise", label: "운동", icon: Dumbbell }, 
    { id: "grooming", label: "미용", icon: Scissors },
  ];

  // [추가] 반려동물 크기 옵션 정의
  const petSizeOptions = [
    { id: "SMALL", label: "소형견" },
    { id: "MEDIUM", label: "중형견" },
    { id: "LARGE", label: "대형견" },
  ];

  const toggle = (id: string, list: string[], setList: any) => setList(list.includes(id) ? list.filter(item => item !== id) : [...list, id]);

  const handleReset = () => {
    setSelectedAmenities([]); 
    setSelectedPetSizes([]); 
    setSelectedPlaceTypes([]);
  };

  const handleApply = () => {
    onApply({
        amenities: selectedAmenities, 
        petSizes: selectedPetSizes, 
        placeTypes: selectedPlaceTypes
    }); 
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px] max-h-[90vh] overflow-y-auto p-0">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10 flex justify-between items-center">
          <DialogHeader className="w-full text-left">
             <div className="flex justify-between items-center">
                <DialogTitle className="text-lg">필터</DialogTitle>
                <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
             </div>
             <DialogDescription className="sr-only">
               원하는 조건으로 장소를 검색해보세요.
             </DialogDescription>
          </DialogHeader>
        </div>
        
        <div className="px-6 py-6">
          {/* 1. 편의시설 섹션 */}
          <div className="mb-8">
            <h3 className="mb-4 font-medium text-gray-900">편의시설</h3>
            <div className="grid grid-cols-4 gap-3">
                {amenities.map(a => (
                    <button 
                        key={a.id} 
                        onClick={() => toggle(a.id, selectedAmenities, setSelectedAmenities)} 
                        className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-colors ${selectedAmenities.includes(a.id) ? "border-yellow-300 bg-yellow-50 text-gray-900" : "border-gray-200 hover:border-gray-300 text-gray-600"}`}
                    >
                        <a.icon className={`w-6 h-6 ${selectedAmenities.includes(a.id) ? "text-yellow-600" : "text-gray-400"}`} />
                        <span className="text-xs">{a.label}</span>
                    </button>
                ))}
            </div>
          </div>

          {/* [추가] 2. 반려동물 크기 섹션 */}
          <div className="mb-8">
            <h3 className="mb-4 font-medium text-gray-900">반려동물 크기</h3>
            <div className="grid grid-cols-3 gap-3">
                {petSizeOptions.map(size => (
                    <button 
                        key={size.id} 
                        onClick={() => toggle(size.id, selectedPetSizes, setSelectedPetSizes)} 
                        className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-colors ${selectedPetSizes.includes(size.id) ? "border-yellow-300 bg-yellow-50 text-gray-900" : "border-gray-200 hover:border-gray-300 text-gray-600"}`}
                    >
                        {/* 크기 아이콘 (공통으로 Dog 아이콘 사용) */}
                        <Dog className={`w-6 h-6 ${selectedPetSizes.includes(size.id) ? "text-yellow-600" : "text-gray-400"}`} />
                        <span className="text-sm">{size.label}</span>
                    </button>
                ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={handleReset} variant="outline" className="flex-1">초기화</Button>
            <Button onClick={handleApply} className="flex-1 bg-yellow-300 text-gray-900 hover:bg-yellow-400">적용</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}