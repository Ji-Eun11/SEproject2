import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Eye, EyeOff } from "lucide-react";
import logoImage from "../assets/13429f3bf73f16f4f94cb74ce47b8a5ef9aa39a9.png";
import { API_BASE_URL } from "../lib/constants";

interface SignupProps {
  onSignup: () => void;
  onBack: () => void;
}

export function Signup({ onSignup, onBack }: SignupProps) {
  const [formData, setFormData] = useState({
    username: "", 
    email: "", 
    password: "", 
    passwordConfirm: "", 
    name: "", 
    nickname: "", 
    birthdate: "", 
    phone: "", 
    address: "",
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // 중복 확인 상태 관리 (true면 사용 가능, false면 미확인/중복)
  const [checks, setChecks] = useState({ 
    username: false, 
    email: false, 
    nickname: false 
  });

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    // 값을 수정하면 중복 확인을 다시 해야 하므로 false로 초기화
    if (field === "username" || field === "email" || field === "nickname") {
        setChecks((prev) => ({ ...prev, [field]: false }));
    }
  };

  // [수정] 실제 백엔드 API와 연동된 중복 확인 함수
  const handleCheckDuplicate = async (field: "username" | "email" | "nickname") => {
    const value = formData[field];
    
    if (!value) {
      alert("내용을 입력해주세요.");
      return;
    }

    // 호출할 API 주소와 파라미터 설정
    let endpoint = "";
    let paramName = "";
    let fieldNameKR = "";

    if (field === "username") {
      endpoint = "/api/users/check-id";
      paramName = "loginId"; // 백엔드가 받는 변수명
      fieldNameKR = "아이디";
    } else if (field === "email") {
      endpoint = "/api/users/check-email";
      paramName = "email";
      fieldNameKR = "이메일";
    } else if (field === "nickname") {
      endpoint = "/api/users/check-nickname";
      paramName = "nickname";
      fieldNameKR = "닉네임";
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}?${paramName}=${value}`);
      const result = await response.json();

      if (result.success) {
        // 백엔드: exist(존재함) -> true 반환
        if (result.data === true) {
          alert(`중복된 ${fieldNameKR} 입니다.`);
          setChecks((prev) => ({ ...prev, [field]: false }));
        } else {
          alert(`사용 가능한 ${fieldNameKR} 입니다.`);
          setChecks((prev) => ({ ...prev, [field]: true }));
        }
      } else {
        alert("확인 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error(error);
      alert("서버 연결에 실패했습니다.");
    }
  };

  const handleSubmit = async () => {
    // 1. 비밀번호 일치 확인
    if (formData.password !== formData.passwordConfirm) {
      setErrors({ ...errors, passwordConfirm: "비밀번호가 일치하지 않습니다" });
      return;
    }

    // 2. 중복 확인 여부 체크 (선택 사항: 강제할지 말지 결정)
    if (!checks.username) { alert("아이디 중복 확인을 해주세요."); return; }
    if (!checks.email) { alert("이메일 중복 확인을 해주세요."); return; }
    if (!checks.nickname) { alert("닉네임 중복 확인을 해주세요."); return; }

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          loginId: formData.username,
          email: formData.email,
          passwordRaw: formData.password,
          nickname: formData.nickname,
          // 나머지 정보는 백엔드 User 엔티티 상황에 맞춰 전송 (현재 User 엔티티에는 name, phone 필드가 없으면 제외될 수 있음)
          // *주의: User 엔티티에 name, phone, address 필드가 없다면 백엔드 수정이 필요할 수 있습니다.
          // 일단 현재 백엔드 DTO(UserRegisterRequest)에는 loginId, email, passwordRaw, nickname, profileImage 만 있습니다.
          // 추가 정보를 저장하려면 백엔드 DTO와 엔티티를 수정해야 합니다. 
          // 여기서는 에러 방지를 위해 DTO에 있는 것만 보냅니다. (필요시 백엔드 수정 후 추가)
          profileImage: null 
        }),
      });
      const result = await response.json();
      if (result.success) {
        alert("회원가입 성공!");
        onSignup();
      } else {
        alert(result.message || "가입 실패");
      }
    } catch (error) {
      alert("서버 오류 발생");
    }
  };

  return (
    <div className="min-h-screen bg-white px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex flex-col items-center mb-8">
            <button onClick={onBack} className="hover:opacity-70 transition-opacity"><img src={logoImage} alt="어디가개" className="h-24 mb-4" /></button>
            <h1 className="text-3xl mb-2">회원가입</h1>
            <p className="text-gray-600">어디가개와 함께 시작하세요</p>
          </div>
          <div className="space-y-4">
            <div>
                <Label>아이디 *</Label>
                <div className="flex gap-2 mt-1">
                    <Input value={formData.username} onChange={(e) => handleChange("username", e.target.value)} />
                    <Button variant="outline" onClick={() => handleCheckDuplicate("username")}>중복확인</Button>
                </div>
            </div>
            <div>
                <Label>이메일 *</Label>
                <div className="flex gap-2 mt-1">
                    <Input value={formData.email} onChange={(e) => handleChange("email", e.target.value)} />
                    <Button variant="outline" onClick={() => handleCheckDuplicate("email")}>중복확인</Button>
                </div>
            </div>
            <div>
                <Label>비밀번호 *</Label>
                <div className="relative mt-1">
                    <Input type={showPassword ? "text" : "password"} value={formData.password} onChange={(e) => handleChange("password", e.target.value)} />
                    <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>
            </div>
            <div>
                <Label>비밀번호 확인 *</Label>
                <div className="relative mt-1">
                    <Input type={showPasswordConfirm ? "text" : "password"} value={formData.passwordConfirm} onChange={(e) => handleChange("passwordConfirm", e.target.value)} />
                    <button onClick={() => setShowPasswordConfirm(!showPasswordConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {showPasswordConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>
                {errors.passwordConfirm && <p className="text-sm text-red-500">{errors.passwordConfirm}</p>}
            </div>
            <div>
                <Label>닉네임 *</Label>
                <div className="flex gap-2 mt-1">
                    <Input value={formData.nickname} onChange={(e) => handleChange("nickname", e.target.value)} />
                    <Button variant="outline" onClick={() => handleCheckDuplicate("nickname")}>중복확인</Button>
                </div>
            </div>
            {/* 추가 정보 필드 */}
            <div><Label>이름</Label><Input value={formData.name} onChange={(e) => handleChange("name", e.target.value)} /></div>
            <div><Label>생년월일</Label><Input value={formData.birthdate} onChange={(e) => handleChange("birthdate", e.target.value)} /></div>
            <div><Label>연락처</Label><Input value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} /></div>
            <div><Label>주소</Label><Input value={formData.address} onChange={(e) => handleChange("address", e.target.value)} /></div>
          </div>
          <div className="flex gap-3 mt-8"><Button onClick={onBack} variant="outline" className="flex-1">취소</Button><Button onClick={handleSubmit} className="flex-1 bg-yellow-300 text-gray-900 hover:bg-yellow-400">회원가입</Button></div>
        </div>
      </div>
    </div>
  );
}