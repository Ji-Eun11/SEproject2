package com.example.demo.domain.place

import com.example.demo.domain.place.dto.PlaceRequest
import com.example.demo.domain.place.dto.PlaceResponse
import com.example.demo.domain.user.dto.ApiResponse
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/places")
class PlaceController(
    private val placeService: PlaceService
) {

    // 1. 장소 등록 (POST /api/places)
    @PostMapping
    fun createPlace(@Valid @RequestBody request: PlaceRequest): ResponseEntity<ApiResponse<PlaceResponse>> {
        val place = placeService.createPlace(request)
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse(success = true, message = "장소가 등록되었습니다.", data = place))
    }

    // 2. 전체 장소 조회 (GET /api/places)
    @GetMapping
    fun getAllPlaces(): ResponseEntity<ApiResponse<List<PlaceResponse>>> {
        val places = placeService.getAllPlaces()
        return ResponseEntity.ok(ApiResponse(success = true, message = "전체 장소 목록 조회 성공", data = places))
    }

    // 3. 장소 상세 조회 (GET /api/places/{placeId})
    @GetMapping("/{placeId}")
    fun getPlace(@PathVariable placeId: Long): ResponseEntity<ApiResponse<PlaceResponse>> {
        val place = placeService.getPlaceById(placeId)
        return ResponseEntity.ok(ApiResponse(success = true, message = "장소 상세 조회 성공", data = place))
    }

    // 4. 장소 검색 (GET /api/places/search?keyword=강남)
    @GetMapping("/search")
    fun searchPlaces(@RequestParam keyword: String): ResponseEntity<ApiResponse<List<PlaceResponse>>> {
        val places = placeService.searchPlaces(keyword)
        return ResponseEntity.ok(ApiResponse(success = true, message = "검색 결과 조회 성공", data = places))
    }
}