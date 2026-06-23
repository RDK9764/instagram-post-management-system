package com.instagram.backend.service;

import com.instagram.backend.entity.Like;
import com.instagram.backend.entity.Post;
import com.instagram.backend.entity.User;
import com.instagram.backend.repository.FollowRepository;
import com.instagram.backend.repository.LikeRepository;
import com.instagram.backend.repository.PostRepository;
import com.instagram.backend.repository.UserRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class LikeService {

    private final LikeRepository likeRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final FollowRepository followRepository;

    public LikeService(
            LikeRepository likeRepository,
            PostRepository postRepository,
            UserRepository userRepository,
            FollowRepository followRepository
    ) {
        this.likeRepository = likeRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.followRepository = followRepository;
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder
                .getContext()
                .getAuthentication();
        String email = auth.getName();
        return userRepository.findByEmail(email)
                .orElseThrow();
    }

    public Map<String, Object> likePost(Long postId) {
        User currentUser = getCurrentUser();
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        User postOwner = post.getUser();

        // Rule 1: Cannot like own post
        if (currentUser.getId().equals(postOwner.getId())) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "You cannot like your own post");
            return error;
        }

        // Rule 2 & 3: Must follow the post owner
        boolean isFollowing = followRepository.existsByFollowerAndFollowing(
                currentUser, postOwner
        );
        if (!isFollowing) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Follow this user to like their posts");
            return error;
        }

        // Rule 4: No duplicate likes
        boolean alreadyLiked = likeRepository.existsByUserAndPost(currentUser, post);
        if (alreadyLiked) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Post already liked");
            return error;
        }

        Like like = new Like();
        like.setUser(currentUser);
        like.setPost(post);
        likeRepository.save(like);

        post.setLikes(post.getLikes() + 1);
        postRepository.save(post);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Post liked successfully");
        response.put("likes", post.getLikes());
        return response;
    }

    public Map<String, Object> unlikePost(Long postId) {
        User currentUser = getCurrentUser();
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Like like = likeRepository.findByUserAndPost(currentUser, post)
                .orElse(null);

        if (like == null) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "You have not liked this post");
            return error;
        }

        likeRepository.delete(like);

        if (post.getLikes() > 0) {
            post.setLikes(post.getLikes() - 1);
            postRepository.save(post);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Post unliked successfully");
        response.put("likes", post.getLikes());
        return response;
    }

    public List<Map<String, Object>> getLikedPosts() {
        User currentUser = getCurrentUser();
        List<Like> likes = likeRepository.findByUser(currentUser);

        List<Map<String, Object>> result = new ArrayList<>();
        for (Like like : likes) {
            Post post = like.getPost();
            Map<String, Object> m = new HashMap<>();
            m.put("id", post.getId());
            m.put("caption", post.getCaption());
            m.put("imageUrl", post.getImageUrl());
            m.put("hashtags", post.getHashtags());
            m.put("likes", post.getLikes());
            m.put("timestamp", post.getTimestamp());
            m.put("user", Map.of(
                    "id", post.getUser().getId(),
                    "username", post.getUser().getUsername()
            ));
            result.add(m);
        }
        return result;
    }
}
