package com.instagram.backend.service;

import com.instagram.backend.dto.PostRequestDTO;
import com.instagram.backend.dto.PostResponseDTO;

import com.instagram.backend.entity.Post;
import com.instagram.backend.entity.User;

import com.instagram.backend.exception.PostNotFoundException;

import com.instagram.backend.repository.PostRepository;
import com.instagram.backend.repository.UserRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PostService {

    private static final Logger logger =
            LoggerFactory.getLogger(PostService.class);

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    // Get Current Logged-in User
    private User getCurrentUser() {

        Authentication auth =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = auth.getName();

        return userRepository
                .findByEmail(email)
                .orElseThrow();
    }

    // Save Post
    public PostResponseDTO savePost(
            PostRequestDTO postDTO
    ) {

        logger.info("Saving post");

        User currentUser =
                getCurrentUser();

        Post post = new Post();

        post.setCaption(
                postDTO.getCaption()
        );

        post.setImageUrl(
                postDTO.getImageUrl()
        );

        post.setHashtags(
                postDTO.getHashtags()
        );

        post.setTimestamp(
                LocalDateTime.now()
        );

        post.setUser(currentUser);

        // Scheduled Post Logic
        post.setScheduled(
                postDTO.isScheduled()
        );

        post.setScheduledTime(
                postDTO.getScheduledTime()
        );

        if(postDTO.isScheduled()) {

            post.setPublished(false);

        } else {

            post.setPublished(true);
        }

        Post savedPost =
                postRepository.save(post);

        logger.info(
                "Post saved successfully"
        );

        PostResponseDTO responseDTO =
                new PostResponseDTO();

        responseDTO.setId(
                savedPost.getId()
        );

        responseDTO.setCaption(
                savedPost.getCaption()
        );

        responseDTO.setImageUrl(
                savedPost.getImageUrl()
        );

        responseDTO.setHashtags(
                savedPost.getHashtags()
        );

        responseDTO.setTimestamp(
                savedPost.getTimestamp()
        );

        return responseDTO;
    }

    // Get All Published Posts
    public List<Post> getAllPosts() {

    logger.info(
            "Fetching published posts"
    );

    User currentUser =
            getCurrentUser();

    return postRepository
            .findByUser(currentUser)
            .stream()
            .filter(post ->

                    Boolean.TRUE.equals(
                            post.isPublished()
                    )
            )
            .toList();
}

    // Search Posts By Hashtag
    public List<Post> getPostsByHashtag(
            String tag
    ) {

        User currentUser =
                getCurrentUser();

        return postRepository
                .findByUser(currentUser)
                .stream()
                .filter(post ->

                        post.isPublished()
                        &&

                        post.getHashtags()
                                .contains(tag)
                )
                .toList();
    }

    // Delete Post
    public void deletePost(Long id) {

        User currentUser =
                getCurrentUser();

        Post post =
                postRepository.findById(id)
                        .orElseThrow(() ->

                                new PostNotFoundException(
                                        "Post not found"
                                )
                        );

        // Ownership Check
        if (!post.getUser()
                .getId()
                .equals(currentUser.getId())) {

            throw new RuntimeException(
                    "Unauthorized"
            );
        }

        postRepository.delete(post);

        logger.info(
                "Post deleted successfully"
        );
    }

    // Update Post
    public Post updatePost(
            Long id,
            Post updatedPost
    ) {

        User currentUser =
                getCurrentUser();

        Post existingPost =
                postRepository.findById(id)
                        .orElseThrow(() ->

                                new PostNotFoundException(
                                        "Post not found"
                                )
                        );

        // Ownership Check
        if (!existingPost.getUser()
                .getId()
                .equals(currentUser.getId())) {

            throw new RuntimeException(
                    "Unauthorized"
            );
        }

        existingPost.setCaption(
                updatedPost.getCaption()
        );

        existingPost.setImageUrl(
                updatedPost.getImageUrl()
        );

        existingPost.setHashtags(
                updatedPost.getHashtags()
        );

        existingPost.setUpdatedAt(
                LocalDateTime.now()
        );

        Post updated =
                postRepository.save(existingPost);

        logger.info(
                "Post updated successfully"
        );

        return updated;
    }

    // Like Post
    public Post likePost(Long id) {

        Post post =
                postRepository.findById(id)
                        .orElseThrow(() ->

                                new PostNotFoundException(
                                        "Post not found"
                                )
                        );

        post.setLikes(
                post.getLikes() + 1
        );

        return postRepository.save(post);
    }

    // Sort Descending
    public List<Post>
    getPostsSortedDescending() {

        User currentUser =
                getCurrentUser();

        return postRepository
                .findByUser(currentUser)
                .stream()
                .filter(Post::isPublished)
                .sorted((a, b) ->

                        b.getTimestamp()
                                .compareTo(
                                        a.getTimestamp()
                                )
                )
                .toList();
    }

    // Sort Ascending
    public List<Post>
    getPostsSortedAscending() {

        User currentUser =
                getCurrentUser();

        return postRepository
                .findByUser(currentUser)
                .stream()
                .filter(Post::isPublished)
                .sorted((a, b) ->

                        a.getTimestamp()
                                .compareTo(
                                        b.getTimestamp()
                                )
                )
                .toList();
    }
}