// PetEditDialog.tsx
import { useState, useEffect } from "react";
// ui/button, ui/input, ui/label이 존재한다고 가정합니다.
import { Button } from "./ui/button";
// Dialog 컴포넌트가 있다면 import
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"; 

// Pet 타입 정의 (MyPage.tsx와 일치)
interface Pet {
    id: number;
    name: string;
    breed?: string;
    age: number;
    size: string;
    gender?: string;
    birthday?: string; // YYYYMMDD 형식
    weight?: number;
    personality?: string;
}

interface PetEditDialogProps {
    open: boolean;
    onClose: () => void;
    pet: Pet;
    // onSave는 MyPage.tsx의 handleUpdatePetSubmit과 일치하는 서명
    onSave: (updatedPetData: any) => void;
}

/**
 * ⭐️ MyPage.tsx의 import 오류를 해결하기 위해
 * PetEditDialog 컴포넌트를 export 합니다.
 */
export function PetEditDialog({ open, onClose, pet, onSave }: PetEditDialogProps) {
    // MyPage.tsx에서 받은 pet 데이터로 폼 상태 초기화
    const [formData, setFormData] = useState({
        name: pet.name,
        age: String(pet.age),
        size: pet.size,
        gender: pet.gender || "",
        birthday: pet.birthday || "", // YYYYMMDD
        weight: String(pet.weight || ""),
        personality: pet.personality || "",
    });

    // 다이얼로그가 열릴 때마다 폼 데이터를 현재 pet 데이터로 초기화
    useEffect(() => {
        if (open) {
            setFormData({
                name: pet.name,
                age: String(pet.age),
                size: pet.size,
                gender: pet.gender || "",
                birthday: pet.birthday || "",
                weight: String(pet.weight || ""),
                personality: pet.personality || "",
            });
        }
    }, [open, pet]);

    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // MyPage.tsx의 onSave 함수에 맞춰 데이터 전달
        onSave({
            ...formData,
            age: Number(formData.age),
            weight: formData.weight ? Number(formData.weight) : undefined,
        });
        // onClose(); // MyPage.tsx에서 onSave 완료 후 닫을 수도 있으므로 주석 처리
    };

    if (!open) return null;

    // 모달/다이얼로그 형태의 UI를 가정하여 렌더링합니다.
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">반려동물 정보 수정: {pet.name}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* 이름 */}
                    <div>
                        <label className="text-sm font-medium">이름</label>
                        <input 
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={formData.name} 
                            onChange={(e) => handleChange("name", e.target.value)} 
                        />
                    </div>

                    {/* 나이 & 크기 */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium">나이 (살)</label>
                            <input 
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                type="number" 
                                value={formData.age} 
                                onChange={(e) => handleChange("age", e.target.value)} 
                                min="0"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">크기 (소형/중형/대형)</label>
                            <input 
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={formData.size} 
                                onChange={(e) => handleChange("size", e.target.value)} 
                            />
                        </div>
                    </div>

                    {/* 생일 & 몸무게 */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium">생일 (YYYYMMDD)</label>
                            <input 
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={formData.birthday} 
                                onChange={(e) => handleChange("birthday", e.target.value)} 
                                maxLength={8}
                                placeholder="20200101"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">몸무게 (kg)</label>
                            <input 
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                type="number" 
                                value={formData.weight} 
                                onChange={(e) => handleChange("weight", e.target.value)} 
                                step="0.1"
                            />
                        </div>
                    </div>
                    
                    {/* 성격 */}
                    <div>
                        <label className="text-sm font-medium">성격/특이사항</label>
                        <textarea 
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={formData.personality} 
                            onChange={(e) => handleChange("personality", e.target.value)} 
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>취소</Button>
                        <Button type="submit">정보 수정</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}