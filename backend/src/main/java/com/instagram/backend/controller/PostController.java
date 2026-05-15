package com.instagram.backend.controller;

import com.instagram.backend.dto.PostRequestDTO;
import com.instagram.backend.dto.PostResponseDTO;
import com.instagram.backend.entity.Post;
import com.instagram.backend.service.PostService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

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
    public Post likePost(@PathVariable Long id) {

        return postService.likePost(id);
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
}