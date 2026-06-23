package com.instagram.backend.controller;

import com.instagram.backend.service.FollowService;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/follow")
@CrossOrigin(origins = "http://localhost:5173")
public class FollowController {

    private final FollowService followService;

    public FollowController(
            FollowService followService
    ) {
        this.followService = followService;
    }

    @PostMapping("/{userId}")
    public Map<String, Object> followUser(
            @PathVariable Long userId
    ) {
        return followService.followUser(userId);
    }

    @DeleteMapping("/{userId}")
    public Map<String, Object> unfollowUser(
            @PathVariable Long userId
    ) {
        return followService.unfollowUser(userId);
    }

    @GetMapping("/followers/{userId}")
    public List<Map<String, Object>> getFollowers(
            @PathVariable Long userId
    ) {
        return followService.getFollowers(userId);
    }

    @GetMapping("/following/{userId}")
    public List<Map<String, Object>> getFollowing(
            @PathVariable Long userId
    ) {
        return followService.getFollowing(userId);
    }

    @GetMapping("/followers-count/{userId}")
    public long followersCount(
            @PathVariable Long userId
    ) {
        return followService.getFollowersCount(userId);
    }

    @GetMapping("/following-count/{userId}")
    public long followingCount(
            @PathVariable Long userId
    ) {
        return followService.getFollowingCount(userId);
    }

    @GetMapping("/is-following/{targetUserId}")
    public Map<String, Object> isFollowing(
            @PathVariable Long targetUserId
    ) {
        boolean following = followService.isFollowing(targetUserId);
        Map<String, Object> result = new HashMap<>();
        result.put("following", following);
        return result;
    }
}