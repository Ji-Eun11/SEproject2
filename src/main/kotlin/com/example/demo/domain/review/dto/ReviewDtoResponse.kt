package com.example.demo.domain.review.dto

import com.example.demo.domain.review.Review
import java.time.LocalDateTime

data class ReviewDtoResponse(
    val reviewId: Long,
    val userNickname : String,
    val content: String,
    val rating: Int,
    val photos: List<String>,
    val userId: Long,
    val placeId: Long,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
) {
    companion object {
        fun from(review: Review): ReviewDtoResponse {
            return ReviewDtoResponse(
                reviewId = review.reviewId,
                userNickname = review.user.nickname,
                content = review.content,
                rating = review.rating,
                photos = review.photos,
                userId = review.user.userId,
                placeId = review.place.placeId,
                createdAt = review.createdAt,
                updatedAt = review.updatedAt
            )
        }
    }
}