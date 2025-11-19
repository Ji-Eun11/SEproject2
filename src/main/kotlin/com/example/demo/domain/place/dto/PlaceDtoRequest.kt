package com.example.demo.domain.place.dto

// 1. 장소 등록/수정 주문서
data class PlaceRequest(
    val name: String,
    val address: String,
    val phone: String? = null,
    val operationHours: String? = null,
    val petPolicy: String? = null,
    val latitude: Double? = null,
    val longitude: Double? = null,
    val photos: List<String> = emptyList()
)