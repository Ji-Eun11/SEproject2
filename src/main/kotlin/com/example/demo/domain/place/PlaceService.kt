package com.example.demo.domain.place

import com.example.demo.domain.place.dto.PlaceRequest
import com.example.demo.domain.place.dto.PlaceResponse
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class PlaceService(
    private val placeRepository: PlaceRepository
) {

    // 1. 장소 등록 (관리자용 기능)
    @Transactional
    fun createPlace(request: PlaceRequest): PlaceResponse {
        val place = Place(
            name = request.name,
            address = request.address,
            phone = request.phone,
            operationHours = request.operationHours,
            petPolicy = request.petPolicy,
            latitude = request.latitude,
            longitude = request.longitude
        ).apply {
            this.photos.addAll(request.photos)
        }

        val savedPlace = placeRepository.save(place)
        return PlaceResponse.from(savedPlace)
    }

    // 2. 전체 장소 조회
    @Transactional(readOnly = true)
    fun getAllPlaces(): List<PlaceResponse> {
        return placeRepository.findAll().map { PlaceResponse.from(it) }
    }

    // 3. 특정 장소 상세 조회
    @Transactional(readOnly = true)
    fun getPlaceById(placeId: Long): PlaceResponse {
        val place = placeRepository.findByIdOrNull(placeId)
            ?: throw IllegalArgumentException("존재하지 않는 장소입니다.")
        return PlaceResponse.from(place)
    }

    // 4. 장소 검색 (이름 또는 주소)
    @Transactional(readOnly = true)
    fun searchPlaces(keyword: String): List<PlaceResponse> {
        // 이름이나 주소에 키워드가 포함된 장소 검색
        val places = placeRepository.findByNameContaining(keyword)
            .ifEmpty { placeRepository.findByAddressContaining(keyword) }

        return places.map { PlaceResponse.from(it) }
    }
}