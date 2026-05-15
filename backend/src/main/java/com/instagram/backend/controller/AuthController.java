package com.instagram.backend.controller;

import com.instagram.backend.dto.LoginRequest;
import com.instagram.backend.dto.RegisterRequest;
import com.instagram.backend.entity.User;
import com.instagram.backend.repository.UserRepository;
import com.instagram.backend.security.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // Register
    @PostMapping("/register")
    public String register(
            @RequestBody RegisterRequest request
    ) {

        User user = new User();

        user.setUsername(request.getUsername());

        user.setEmail(request.getEmail());

        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        userRepository.save(user);

        return "User Registered Successfully";
    }

    // Login
    @PostMapping("/login")
    public Map<String, String> login(
            @RequestBody LoginRequest request
    ) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow();

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        )) {

            throw new RuntimeException(
                    "Invalid Password"
            );
        }

        String token =
                jwtUtil.generateToken(
                        user.getEmail()
                );

        Map<String, String> response =
                new HashMap<>();

        response.put("token", token);

        return response;
    }
}