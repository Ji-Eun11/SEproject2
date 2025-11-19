package com.example.demo.domain.place

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "places")
class Place(
    @Column(nullable = false)
    var name: String, // 장소명

    @Column(nullable = false)
    var address: String, // 주소

    var phone: String? = null, // 전화번호

    var operationHours: String? = null, // 운영 시간 (예: "09:00 - 18:00")

    var petPolicy: String? = null, // 반려동물 정책 (예: "대형견 가능")

    var latitude: Double? = null, // 위도 (지도 표시용)

    var longitude: Double? = null // 경도 (지도 표시용)

) {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val placeId: Long = 0

    @Column(nullable = false)
    var avgRating: Double = 0.0 // 평균 평점 (리뷰가 쌓이면 갱신)
        protected set

    // 사진 URL 목록 (별도의 테이블로 관리됨)
    @ElementCollection
    @CollectionTable(name = "place_photos", joinColumns = [JoinColumn(name = "place_id")])
    @Column(name = "photo_url")
    var photos: MutableList<String> = mutableListOf()

    @Column(nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now()

    @Column(nullable = false)
    var updatedAt: LocalDateTime = LocalDateTime.now()
        protected set

    // 정보 수정 메서드
    fun updateInfo(name: String, address: String, phone: String?, operationHours: String?, petPolicy: String?) {
        this.name = name
        this.address = address
        this.phone = phone
        this.operationHours = operationHours
        this.petPolicy = petPolicy
        this.updatedAt = LocalDateTime.now()
    }

    // 평점 업데이트 메서드 (Review 기능 추가 시 사용)
    fun updateAvgRating(newRating: Double) {
        this.avgRating = newRating
    }
}