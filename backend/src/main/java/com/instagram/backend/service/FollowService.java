package com.instagram.backend.service;

import com.instagram.backend.entity.Follow;
import com.instagram.backend.entity.User;
import com.instagram.backend.repository.FollowRepository;
import com.instagram.backend.repository.UserRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class FollowService {

    private final FollowRepository followRepository;
    private final UserRepository userRepository;

    public FollowService(
            FollowRepository followRepository,
            UserRepository userRepository
    ) {
        this.followRepository = followRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow();
    }

    public Map<String, Object> followUser(Long userId) {

    System.out.println(
            "Authentication = " +
            SecurityContextHolder
                    .getContext()
                    .getAuthentication()
    );

    Authentication authentication =
            SecurityContextHolder
                    .getContext()
                    .getAuthentication();

    String email = authentication.getName();

    System.out.println("Email = " + email);

    User follower =
            userRepository.findByEmail(email)
                    .orElseThrow();

        User following =
                userRepository.findById(userId)
                        .orElseThrow();

        Map<String, Object> response =
                new HashMap<>();

        response.put("followedUserId", following.getId());
        response.put("followedUsername", following.getUsername());

        if (follower.getId().equals(following.getId())) {
            response.put("success", false);
            response.put("message", "You cannot follow yourself");
            return response;
        }

        if (followRepository.existsByFollowerAndFollowing(
                follower,
                following
        )) {
            response.put("success", false);
            response.put("message", "Already following");
            return response;
        }

        Follow follow = new Follow();

        follow.setFollower(follower);
        follow.setFollowing(following);

        followRepository.save(follow);

        response.put("success", true);
        response.put("message", "User followed successfully");

        return response;
    }

    public Map<String, Object> unfollowUser(Long userId) {
        User follower = getCurrentUser();
        User following = userRepository.findById(userId)
                .orElseThrow();

        Map<String, Object> response = new HashMap<>();

        if (follower.getId().equals(following.getId())) {
            response.put("success", false);
            response.put("message", "You cannot unfollow yourself");
            return response;
        }

        Follow follow = followRepository
                .findByFollowerAndFollowing(follower, following)
                .orElse(null);

        if (follow == null) {
            response.put("success", false);
            response.put("message", "You are not following this user");
            return response;
        }

        followRepository.delete(follow);

        response.put("success", true);
        response.put("message", "User unfollowed successfully");
        response.put("unfollowedUserId", following.getId());
        response.put("unfollowedUsername", following.getUsername());
        return response;
    }
    public List<Map<String, Object>> getFollowers(Long userId) {
        List<User> users = followRepository
                .findFollowersByUserId(userId);
        List<Map<String, Object>> result = new ArrayList<>();
        for (User u : users) {
            Map<String, Object> m = new HashMap<>();
            m.put("id", u.getId());
            m.put("username", u.getUsername());
            m.put("email", u.getEmail());
            result.add(m);
        }
        return result;
    }

    public List<Map<String, Object>> getFollowing(Long userId) {
        List<User> users = followRepository
                .findFollowingByUserId(userId);
        List<Map<String, Object>> result = new ArrayList<>();
        for (User u : users) {
            Map<String, Object> m = new HashMap<>();
            m.put("id", u.getId());
            m.put("username", u.getUsername());
            m.put("email", u.getEmail());
            result.add(m);
        }
        return result;
    }

    public boolean isFollowing(Long targetUserId) {
        User currentUser = getCurrentUser();
        return followRepository
                .existsByFollowerIdAndFollowingId(
                        currentUser.getId(),
                        targetUserId
                );
    }

    public long getFollowersCount(Long userId) {

    User user = userRepository
            .findById(userId)
            .orElseThrow();

    return followRepository
            .countByFollowing(user);
}
public long getFollowingCount(Long userId) {

    User user = userRepository
            .findById(userId)
            .orElseThrow();

    return followRepository
            .countByFollower(user);
}
}