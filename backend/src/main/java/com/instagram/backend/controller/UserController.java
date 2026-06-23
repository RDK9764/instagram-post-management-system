package com.instagram.backend.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.instagram.backend.entity.User;
import com.instagram.backend.service.FollowService;
import com.instagram.backend.service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private FollowService followService;

    @GetMapping("/search")
    public List<Map<String, Object>> searchUsers(

            @RequestParam String username

    ) {
        Authentication auth = SecurityContextHolder
                .getContext()
                .getAuthentication();
        Long currentUserId = null;
        if (auth != null && auth.isAuthenticated()
                && !"anonymousUser".equals(auth.getName())) {
            User currentUser = userService.getUserByEmail(auth.getName());
            if (currentUser != null) {
                currentUserId = currentUser.getId();
            }
        }

        List<User> users = userService.searchUsers(username);
        List<Map<String, Object>> result = new ArrayList<>();
        for (User u : users) {
            Map<String, Object> m = new HashMap<>();
            m.put("id", u.getId());
            m.put("username", u.getUsername());
            m.put("email", u.getEmail());
            if (currentUserId != null && !currentUserId.equals(u.getId())) {
                m.put("isFollowing", followService.isFollowing(u.getId()));
            } else {
                m.put("isFollowing", false);
            }
            result.add(m);
        }
        return result;
    }

    @GetMapping("/me")
    public Map<String, Object> getCurrentUser() {

        Authentication auth = SecurityContextHolder
                .getContext()
                .getAuthentication();

        String email = auth.getName();

        User user = userService.getUserByEmail(email);

        Map<String, Object> result = new HashMap<>();

        result.put("id", user.getId());

        result.put("username", user.getUsername());

        result.put("email", user.getEmail());

        return result;
    }

    @GetMapping("/{id}")
    public Map<String, Object> getUserById(

            @PathVariable Long id

    ) {

        User user = userService.getUserById(id);

        Map<String, Object> result = new HashMap<>();

        result.put("id", user.getId());

        result.put("username", user.getUsername());

        result.put("email", user.getEmail());

        return result;
    }
}