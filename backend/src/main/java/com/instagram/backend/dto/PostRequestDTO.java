package com.instagram.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import lombok.Data;

@Data
public class PostRequestDTO {

    @NotBlank(message = "Caption cannot be empty")
    @Size(
            min = 3,
            max = 100,
            message = "Caption must be between 3 and 100 characters"
    )
    private String caption;

    @NotBlank(message = "Image URL cannot be empty")
    private String imageUrl;

    @NotBlank(message = "Hashtags cannot be empty")
    private String hashtags;
}