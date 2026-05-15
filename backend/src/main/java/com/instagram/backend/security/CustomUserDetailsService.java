package com.instagram.backend.security;

import com.instagram.backend.entity.User;
import com.instagram.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.core.userdetails.*;

import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService
        implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(
            String email
    ) throws UsernameNotFoundException {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "User not found"
                        )
                );

        return org.springframework.security.core.userdetails
                .User.builder()

                .username(user.getEmail())

                .password(user.getPassword())

                .roles(user.getRole())

                .build();
    }
}