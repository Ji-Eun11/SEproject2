package com.example.demo.domain.place

import org.springframework.data.jpa.repository.JpaRepository

interface PlaceRepository : JpaRepository<Place, Long> {

    // 검색 기능: 장소 이름에 특정 단어가 포함된 곳 찾기
    fun findByNameContainingIgnoreCase(keyword: String): List<Place>

    // 지역 검색: 주소에 특정 지역명이 포함된 곳 찾기 (예: "강남구")
    fun findByAddressContainingIgnoreCase(region: String): List<Place>
}