package com.example.demo.domain.pet

import com.example.demo.domain.user.User
import jakarta.persistence.*
import java.time.LocalDate
import com.example.demo.global.entity.BaseTimeEntity

@Entity
@Table(name = "pets")
class Pet(
    @Column(nullable = false)
    var name: String,

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    var gender: PetGender,

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    var size: Size,

    var birthDate: LocalDate? = null,
    
    var age: Int = 0, 
    var weight: Double? = null,
    var specialNotes: String? = null,
    var breed: String? = null,
    var photoUrl: String? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    var owner: User
) : BaseTimeEntity() {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val petId: Long = 0

    fun updateInfo(
        name: String, gender: PetGender, size: Size, birthDate: LocalDate?, age: Int,
        weight: Double?, specialNotes: String?, breed: String?, photoUrl: String?
    ) {
        this.name = name
        this.gender = gender
        this.size = size
        this.birthDate = birthDate
        this.age = age
        this.weight = weight
        this.specialNotes = specialNotes
        this.breed = breed
        this.photoUrl = photoUrl
    }
}

enum class PetGender { MALE, FEMALE, UNKNOWN }
enum class Size { BIG, MEDIUM, SMALL }