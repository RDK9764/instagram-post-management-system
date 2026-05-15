package com.instagram.backend.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PostResponseDTO {

    private Long id;

    private String caption;

    private String imageUrl;

    private String hashtags;

    private LocalDateTime timestamp;
}