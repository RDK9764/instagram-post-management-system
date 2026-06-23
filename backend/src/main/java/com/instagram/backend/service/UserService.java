package com.instagram.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.instagram.backend.entity.User;
import com.instagram.backend.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> searchUsers(
            String username
    ) {

        return userRepository
                .findByUsernameContainingIgnoreCase(
                        username
                );
    }

    public User getUserByEmail(String email) {
        return userRepository
                .findByEmail(email)
                .orElse(null);
    }

    public User getUserById(Long id) {
        return userRepository
                .findById(id)
                .orElse(null);
    }
}