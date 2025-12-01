// Signup.tsx
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

// --- [추가] 유효성 검사 헬퍼 함수 ---
const validatePassword = (password: string): string | null => {
  // 최소 8자 이상, 영문/숫자/특수문자 중 2가지 이상 포함
  const regex = /^(?=.*[A-Za-z])(?=.*\d|.*[!@#$%^&*()_+={}\[\]:;"'<>,.?/\\|`~-]).{8,}$/;
  if (!regex.test(password)) {
    return "비밀번호는 8자 이상, 영문/숫자/특수문자 중 2가지 이상을 포함해야 합니다.";
  }
  return null;
};

const validatePhone = (phone: string): string | null => {
  // 010으로 시작하는 11자리 숫자 형식 검사 (하이픈 제거 후 검사)
  const phoneCleaned = phone.replace(/[^0-9]/g, '');
  const regex = /^010\d{8}$/;
  if (!regex.test(phoneCleaned)) {
    return "전화번호 형식이 올바르지 않습니다. (예: 01012345678)";
  }
  return null;
};
// ---------------------------------

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
  // [수정: string | undefined 허용]
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  // 중복 확인 상태 관리 (true면 사용 가능, false면 미확인/중복)
  const [checks, setChecks] = useState({
    username: false,
    email: false,
    nickname: false
  });

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    // 값을 수정하면 해당 필드의 오류 상태 및 중복 확인 상태를 초기화
    setErrors((prev) => ({ ...prev, [field]: undefined, passwordConfirm: field === 'password' ? undefined : prev.passwordConfirm }));

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
    // --- [유효성 검사 및 오류 처리] ---
    // 에러 타입도 string | undefined 로 정의
    let newErrors: Record<string, string | undefined> = {};

    // [수정: formData의 키 타입을 사용하여 타입 안정성 확보]
    type FormDataKey = keyof typeof formData; 
    const requiredFields: FormDataKey[] = [
      "username", "email", "password", "passwordConfirm",
      "name", "nickname", "birthdate", "phone", "address"
    ];

    for (const field of requiredFields) {
      if (!formData[field].trim()) {
        newErrors[field] = "필수 입력 항목입니다.";
      }
    }

    // 2. 비밀번호 형식 및 확인 검사
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
    } else if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = "비밀번호가 일치하지 않습니다.";
    }

    // 3. 전화번호 형식 검사
    const phoneError = validatePhone(formData.phone);
    if (phoneError) {
      newErrors.phone = phoneError;
    }

    // undefined는 제외하고 실제 오류 메시지가 있는 키만 필터링
    const actualErrors = Object.keys(newErrors).filter(key => newErrors[key] !== undefined);

    setErrors(newErrors);

    if (actualErrors.length > 0) {
      // [요청된 오류 메시지 출력]
      alert("올바르지 않는 형식입니다.");
      return;
    }
    // --- [유효성 검사 끝] ---

    // 4. 중복 확인 여부 체크
    if (!checks.username || !checks.email || !checks.nickname) {
      alert("아이디, 이메일, 닉네임 중복 확인이 필요합니다.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          loginId: formData.username,
          email: formData.email,
          passwordRaw: formData.password,
          nickname: formData.nickname,
          // 주의: 백엔드 DTO에 맞게 전송
          name: formData.name, // 백엔드 DTO에 필드가 있다면 전송
          phone: formData.phone, // 백엔드 DTO에 필드가 있다면 전송
          birthdate: formData.birthdate, // 백엔드 DTO에 필드가 있다면 전송
          address: formData.address, // 백엔드 DTO에 필드가 있다면 전송
          profileImage: null
        }),
      });
      const result = await response.json();
      if (result.success) {
        alert("회원가입 성공!");
        // 반려동물 등록 페이지 이동
        window.location.href = "/pet-register";
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
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
            </div>
            <div>
              <Label>이메일 *</Label>
              <div className="flex gap-2 mt-1">
                <Input value={formData.email} onChange={(e) => handleChange("email", e.target.value)} />
                <Button variant="outline" onClick={() => handleCheckDuplicate("email")}>중복확인</Button>
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div>
              <Label>비밀번호 *</Label>
              <div className="relative mt-1">
                <Input type={showPassword ? "text" : "password"} value={formData.password} onChange={(e) => handleChange("password", e.target.value)} />
                <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
            <div>
              <Label>비밀번호 확인 *</Label>
              <div className="relative mt-1">
                <Input type={showPasswordConfirm ? "text" : "password"} value={formData.passwordConfirm} onChange={(e) => handleChange("passwordConfirm", e.target.value)} />
                <button onClick={() => setShowPasswordConfirm(!showPasswordConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPasswordConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.passwordConfirm && <p className="text-red-500 text-sm mt-1">{errors.passwordConfirm}</p>}
            </div>
            <div>
              <Label>닉네임 *</Label>
              <div className="flex gap-2 mt-1">
                <Input value={formData.nickname} onChange={(e) => handleChange("nickname", e.target.value)} />
                <Button variant="outline" onClick={() => handleCheckDuplicate("nickname")}>중복확인</Button>
              </div>
              {errors.nickname && <p className="text-red-500 text-sm mt-1">{errors.nickname}</p>}
            </div>
            {/* 추가 정보 필드 */}
            <div>
              <Label>이름</Label>
              <Input value={formData.name} onChange={(e) => handleChange("name", e.target.value)} />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div>
              <Label>생년월일</Label>
              <Input value={formData.birthdate} onChange={(e) => handleChange("birthdate", e.target.value)} />
              {errors.birthdate && <p className="text-red-500 text-sm mt-1">{errors.birthdate}</p>}
            </div>
            <div>
              <Label>연락처</Label>
              <Input value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
            <div>
              <Label>주소</Label>
              <Input value={formData.address} onChange={(e) => handleChange("address", e.target.value)} />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>
          </div>
          <div className="flex gap-3 mt-8"><Button onClick={onBack} variant="outline" className="flex-1">취소</Button><Button onClick={handleSubmit} className="flex-1 bg-yellow-300 text-gray-900 hover:bg-yellow-400">회원가입</Button></div>
        </div>
      </div>
    </div>
  );
}