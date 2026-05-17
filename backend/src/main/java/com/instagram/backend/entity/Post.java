package com.instagram.backend.entity;

import jakarta.persistence.*;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class Post {

    @Id
    @GeneratedValue(
            strategy =
            GenerationType.IDENTITY
    )
    private Long id;

    @NotBlank(
            message =
            "Caption cannot be empty"
    )
    @Size(
            min = 3,
            max = 100,
            message =
            "Caption must be between 3 and 100 characters"
    )
    private String caption;

    @NotBlank(
            message =
            "Image URL cannot be empty"
    )
    private String imageUrl;

    @NotBlank(
            message =
            "Hashtags cannot be empty"
    )
    private String hashtags;

    // Likes
    private int likes = 0;

    // Created Time
    private LocalDateTime timestamp;

    // Updated Time
    private LocalDateTime updatedAt;

    // Post Owner
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    private boolean scheduled = false;

    private LocalDateTime scheduledTime;

    private boolean published = true;
}