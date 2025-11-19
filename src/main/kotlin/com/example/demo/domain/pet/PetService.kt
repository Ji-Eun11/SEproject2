package com.example.demo.domain.pet

import com.example.demo.domain.pet.dto.PetDtoCreateRequest
import com.example.demo.domain.pet.dto.PetDtoResponse
import com.example.demo.domain.pet.dto.PetDtoUpdateRequest
import com.example.demo.domain.user.UserRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class PetService(
    private val petRepository: PetRepository,
    private val userRepository: UserRepository // '주인'을 찾기 위해 UserRepository도 필요
) {

    /**
     * 1. 펫 등록 (C)
     * (userId: 펫 주인의 ID, request: 펫 등록 주문서)
     */
    @Transactional
    fun createPet(userId: Long, request: PetDtoCreateRequest): PetDtoResponse {
        // 1. 주인을 찾는다 (없으면 예외 발생)
        val owner = userRepository.findByIdOrNull(userId)
            ?: throw IllegalArgumentException("존재하지 않는 사용자입니다.")

        // 2. 펫 엔티티(보관함) 생성
        val pet = Pet(
            name = request.name,
            gender = request.gender,
            size = request.size,
            birthDate = request.birthDate,
            weight = request.weight,
            specialNotes = request.specialNotes,
            owner = owner // ⭐️ 펫의 주인으로 방금 찾은 user를 지정
        )

        // 3. 펫 창고에 저장
        val savedPet = petRepository.save(pet)

        // 4. 서빙 쟁반(PetResponse)에 담아 반환
        return PetDtoResponse.from(savedPet)
    }

    /**
     * 2. 특정 사용자의 모든 펫 조회 (R)
     */
    @Transactional(readOnly = true)
    fun getPetsByUserId(userId: Long): List<PetDtoResponse> {
        // 1. 펫 창고 관리자에게 "이 주인(userId)의 펫 다 찾아줘"
        val pets = petRepository.findAllByOwnerUserId(userId)

        // 2. 펫 목록을 서빙 쟁반(PetResponse) 목록으로 변환
        return pets.map { pet -> PetDtoResponse.from(pet) }
    }

    /**
     * 3. 펫 정보 수정 (U)
     * (userId: 수정을 *시도*하는 사람, petId: 수정 *대상* 펫, request: 수정 주문서)
     */
    @Transactional
    fun updatePet(userId: Long, petId: Long, request: PetDtoUpdateRequest): PetDtoResponse {
        // 1. "이 펫(petId)의 주인(userId)이 맞는지" 확인하며 펫을 찾음
        val pet = petRepository.findByPetIdAndOwnerUserId(petId, userId)
            ?: throw IllegalArgumentException("펫이 존재하지 않거나 수정 권한이 없습니다.")

        // 2. 펫 정보 수정 (Pet 엔티티의 헬퍼 메서드 사용)
        pet.updateInfo(
            name = request.name,
            gender = request.gender,
            size = request.size,
            birthDate = request.birthDate,
            weight = request.weight,
            specialNotes = request.specialNotes
        )

        // 3. (save를 안해도 @Transactional 덕분에 자동 저장됨)
        return PetDtoResponse.from(pet)
    }

    /**
     * 4. 펫 삭제 (D)
     * (userId: 삭제를 *시도*하는 사람, petId: 삭제 *대상* 펫)
     */
    @Transactional
    fun deletePet(userId: Long, petId: Long) {
        // 1. "이 펫(petId)의 주인(userId)이 맞는지" 확인하며 펫을 찾음
        val pet = petRepository.findByPetIdAndOwnerUserId(petId, userId)
            ?: throw IllegalArgumentException("펫이 존재하지 않습니다.")

        // 2. 펫 창고에서 삭제
        petRepository.delete(pet)
    }
}