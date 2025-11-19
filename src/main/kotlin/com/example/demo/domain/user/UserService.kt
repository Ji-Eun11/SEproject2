package com.example.demo.domain.user
// (수정) import하는 DTO 클래스명 변경
import com.example.demo.domain.user.dto.UserRegisterRequest
import com.example.demo.domain.user.dto.UserLoginRequest
import com.example.demo.domain.user.dto.UserResponse
import com.example.demo.domain.user.dto.UpdateProfileRequest
import com.example.demo.domain.user.dto.ChangePasswordRequest
import com.example.demo.domain.user.dto.LoginResponse

import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class UserService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder
    // private val jwtTokenProvider: JwtTokenProvider // (추가 권장) 실제 토큰 발급용
) {

    @Transactional
    fun signUp(request: UserRegisterRequest): UserResponse { // (수정) DTO 변경
        // (추가) 아이디 중복 체크
        if (userRepository.existsByLoginId(request.loginId!!)) {
            throw IllegalArgumentException("이미 사용 중인 아이디입니다")
        }

        // 이메일 중복 체크
        if (userRepository.existsByEmail(request.email!!)) {
            throw IllegalArgumentException("이미 사용 중인 이메일입니다")
        }

        // 비밀번호 암호화 (수정) request.password -> request.passwordRaw
        val encodedPassword = passwordEncoder.encode(request.passwordRaw!!)

        // 사용자 생성 (수정) loginId 추가
        val user = User(
            loginId = request.loginId,
            email = request.email,
            passwordHash = encodedPassword,
            nickname = request.nickname!!,
            profileImage = request.profileImage
        )

        val savedUser = userRepository.save(user)
        return UserResponse.from(savedUser) // (수정) MemberResponse -> UserResponse
    }

    // (수정) 반환 타입을 Boolean -> LoginResponse (실제 토큰 반환)
    fun login(request: UserLoginRequest): LoginResponse { // (수정) DTO 및 반환 타입 변경
        // (수정) 이메일이 아닌 loginId로 사용자 조회
        val user = userRepository.findByLoginId(request.loginId!!)
            ?: throw IllegalArgumentException("존재하지 않는 사용자입니다")

        if (!user.isActive) {
            throw IllegalStateException("비활성화된 계정입니다")
        }

        // 비밀번호 검증 (수정) request.password -> request.passwordRaw
        if (!passwordEncoder.matches(request.passwordRaw!!, user.passwordHash)) {
            throw IllegalArgumentException("비밀번호가 일치하지 않습니다") // (수정) false 반환 대신 예외 발생
        }

        // (추가) 실제 토큰 생성 로직 (예시)
        // val accessToken = jwtTokenProvider.createAccessToken(user.id, user.role)
        // val refreshToken = jwtTokenProvider.createRefreshToken(user.id)

        // (임시)
        val accessToken = "dummy-access-token"
        val refreshToken = "dummy-refresh-token"


        return LoginResponse(
            accessToken = accessToken,
            refreshToken = refreshToken,
            user = UserResponse.from(user) // (수정) MemberResponse -> UserResponse
        )
    }

    @Transactional(readOnly = true)
    fun getUserById(userId: Long): UserResponse {
        val user = userRepository.findById(userId).orElseThrow {
            IllegalArgumentException("존재하지 않는 사용자입니다")
        }
        return UserResponse.from(user)
    }

    @Transactional(readOnly = true)
    fun getUserByEmail(email: String): UserResponse {
        val user = userRepository.findByEmail(email)
            ?: throw IllegalArgumentException("존재하지 않는 사용자입니다")
        return UserResponse.from(user)
    }

    @Transactional
    fun updateProfile(userId: Long, request: UpdateProfileRequest): UserResponse {
        val user = userRepository.findById(userId).orElseThrow {
            IllegalArgumentException("존재하지 않는 사용자입니다")
        }

        user.updateProfile(
            nickname = request.nickname!!,
            profileImage = request.profileImage
        )

        return UserResponse.from(user)
    }

    @Transactional
    fun changePassword(userId: Long, request: ChangePasswordRequest) {
        val user = userRepository.findById(userId).orElseThrow {
            IllegalArgumentException("존재하지 않는 사용자입니다")
        }

        // 현재 비밀번호 검증
        if (!passwordEncoder.matches(request.currentPassword!!, user.passwordHash)) {
            throw IllegalArgumentException("현재 비밀번호가 일치하지 않습니다")
        }

        // 새 비밀번호 암호화 및 업데이트
        val newEncodedPassword = passwordEncoder.encode(request.newPassword!!)
        user.updatePassword(newEncodedPassword)
    }

    @Transactional
    fun deleteAccount(userId: Long) {
        val user = userRepository.findById(userId).orElseThrow {
            IllegalArgumentException("존재하지 않는 사용자입니다")
        }
        user.deactivate() // Soft delete
    }

    @Transactional(readOnly = true)
    fun getAllUsers(): List<UserResponse> {
        return userRepository.findAll()
            .map { UserResponse.from(it) }
    }
}