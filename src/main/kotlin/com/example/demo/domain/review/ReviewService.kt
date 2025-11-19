package com.example.demo.domain.review

import com.example.demo.domain.place.PlaceRepository
import com.example.demo.domain.review.dto.ReviewCreateRequest
import com.example.demo.domain.review.dto.ReviewDtoResponse
import com.example.demo.domain.review.dto.ReviewUpdateRequest
import com.example.demo.domain.user.UserRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ReviewService(
    private val reviewRepository: ReviewRepository,
    private val userRepository: UserRepository, // 작성자 확인용
    private val placeRepository: PlaceRepository // 장소 확인용
) {

    // 1. 리뷰 등록
    @Transactional
    fun createReview(userId: Long, placeId: Long, request: ReviewCreateRequest): ReviewDtoResponse {
        val user = userRepository.findByIdOrNull(userId)
            ?: throw IllegalArgumentException("존재하지 않는 사용자입니다.")

        val place = placeRepository.findByIdOrNull(placeId)
            ?: throw IllegalArgumentException("존재하지 않는 장소입니다.")

        val review = Review(
            content = request.content,
            rating = request.rating,
            user = user,
            place = place
        ).apply {
            this.photos.addAll(request.photos)
        }

        val savedReview = reviewRepository.save(review)
        return ReviewDtoResponse.from(savedReview)
    }

    // 2. 리뷰 수정
    @Transactional
    fun updateReview(userId: Long, reviewId: Long, request: ReviewUpdateRequest): ReviewDtoResponse {
        val review = reviewRepository.findByIdOrNull(reviewId)
            ?: throw IllegalArgumentException("존재하지 않는 리뷰입니다.")

        // 본인 확인
        if (review.user.userId != userId) {
            throw IllegalArgumentException("수정 권한이 없습니다.")
        }

        review.updateInfo(request.content, request.rating, request.photos)

        return ReviewDtoResponse.from(review)
    }

    // 3. 리뷰 삭제
    @Transactional
    fun deleteReview(userId: Long, reviewId: Long) {
        val review = reviewRepository.findByIdOrNull(reviewId)
            ?: throw IllegalArgumentException("존재하지 않는 리뷰입니다.")

        if (review.user.userId != userId) {
            throw IllegalArgumentException("삭제 권한이 없습니다.")
        }

        reviewRepository.delete(review)
    }

    // 4. 특정 장소의 리뷰 목록 조회
    @Transactional(readOnly = true)
    fun getReviewsByPlace(placeId: Long): List<ReviewDtoResponse> {
        return reviewRepository.findAllByPlace_PlaceIdOrderByCreatedAtDesc(placeId)
            .map { ReviewDtoResponse.from(it) }
    }
}