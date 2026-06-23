package com.instagram.backend.controller;

import com.instagram.backend.dto.PostRequestDTO;
import com.instagram.backend.dto.PostResponseDTO;
import com.instagram.backend.entity.Post;
import com.instagram.backend.service.LikeService;
import com.instagram.backend.service.PostService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private LikeService likeService;

    // Home API
    @GetMapping("/")
    public String home() {

        return "Instagram Backend Running Successfully 🚀";
    }

    // Add Post
    @PostMapping("/addPost")
    public PostResponseDTO addPost(
            @Valid @RequestBody PostRequestDTO postDTO) {

        return postService.savePost(postDTO);
    }

    // Get All Posts
    @GetMapping("/allPosts")
    public List<Post> getAllPosts() {

        return postService.getAllPosts();
    }

    // Filter By Hashtag
    @GetMapping("/byHashtag")
    public List<Post> getPostsByHashtag(
            @RequestParam String tag) {

        return postService.getPostsByHashtag(tag);
    }

    // Delete Post
    @DeleteMapping("/{id}")
    public String deletePost(@PathVariable Long id) {

        postService.deletePost(id);

        return "Post deleted successfully";
    }

    // Update Post
    @PutMapping("/update/{id}")
    public Post updatePost(
            @PathVariable Long id,
            @Valid @RequestBody Post updatedPost) {

        return postService.updatePost(id, updatedPost);
    }

    // Like Post
    @PutMapping("/like/{id}")
    public ResponseEntity<Map<String, Object>> likePost(@PathVariable Long id) {

        Map<String, Object> result = likeService.likePost(id);

        boolean success = (boolean) result.get("success");

        if (success) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(result);
        }
    }

    // Unlike Post
    @DeleteMapping("/like/{id}")
    public ResponseEntity<Map<String, Object>> unlikePost(@PathVariable Long id) {

        Map<String, Object> result = likeService.unlikePost(id);

        boolean success = (boolean) result.get("success");

        if (success) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(result);
        }
    }

    // Get Liked Posts (for Activity Page)
    @GetMapping("/liked")
    public List<Map<String, Object>> getLikedPosts() {

        return likeService.getLikedPosts();
    }

    // Get My Posts (for dashboard stats)
    @GetMapping("/my")
    public List<Post> getMyPosts() {

        return postService.getMyPosts();
    }

    // Descending Sort
    @GetMapping("/sortedDesc")
    public List<Post> getPostsSortedDescending() {

        return postService.getPostsSortedDescending();
    }

    // Ascending Sort
    @GetMapping("/sortedAsc")
    public List<Post> getPostsSortedAscending() {

        return postService.getPostsSortedAscending();
    }

    // Get Posts By User ID
    @GetMapping("/user/{userId}")
    public List<Post> getPostsByUserId(
            @PathVariable Long userId
    ) {
        return postService.getPostsByUserId(userId);
    }
}