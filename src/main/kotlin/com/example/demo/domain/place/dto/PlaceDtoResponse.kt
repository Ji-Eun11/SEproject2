package com.example.demo.domain.place.dto

import com.example.demo.domain.place.Place

data class PlaceResponse(
    val placeId: Long,
    val name: String,
    val address: String,
    val phone: String?,
    val operationHours: String?,
    val petPolicy: String?,
    val avgRating: Double,
    val latitude: Double?,
    val longitude: Double?,
    val photos: List<String>
) {
    companion object {
        fun from(place: Place): PlaceResponse {
            return PlaceResponse(
                placeId = place.placeId,
                name = place.name,
                address = place.address,
                phone = place.phone,
                operationHours = place.operationHours,
                petPolicy = place.petPolicy,
                avgRating = place.avgRating,
                latitude = place.latitude,
                longitude = place.longitude,
                photos = place.photos
            )
        }
    }
}