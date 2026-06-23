package com.instagram.backend;

import com.instagram.backend.entity.User;
import com.instagram.backend.repository.FollowRepository;
import com.instagram.backend.repository.LikeRepository;
import com.instagram.backend.repository.PostRepository;
import com.instagram.backend.repository.UserRepository;
import com.instagram.backend.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class FollowControllerTest {

    @Value("${local.server.port}")
    private int port;

    private RestTemplate restTemplate = new RestTemplate();

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FollowRepository followRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private String token;
    private Long userId1;
    private Long userId2;

    @BeforeEach
    void setUp() {
        likeRepository.deleteAll();
        followRepository.deleteAll();
        postRepository.deleteAll();
        userRepository.deleteAll();

        User user1 = new User();
        user1.setUsername("user1");
        user1.setEmail("user1@example.com");
        user1.setPassword(passwordEncoder.encode("password"));
        user1 = userRepository.save(user1);
        userId1 = user1.getId();

        User user2 = new User();
        user2.setUsername("user2");
        user2.setEmail("user2@example.com");
        user2.setPassword(passwordEncoder.encode("password"));
        user2 = userRepository.save(user2);
        userId2 = user2.getId();

        token = jwtUtil.generateToken("user1@example.com");
    }

    @Test
    void testFollowAndGetFollowers() {
        String baseUrl = "http://localhost:" + port + "/api/follow";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + token);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        // Test POST /api/follow/{userId}
        try {
            ResponseEntity<String> postResponse = restTemplate.exchange(
                    baseUrl + "/" + userId2,
                    HttpMethod.POST,
                    entity,
                    String.class
            );
            System.out.println("POST Response: " + postResponse.getStatusCode() + " - " + postResponse.getBody());
            assertEquals(200, postResponse.getStatusCode().value());
        } catch (Exception e) {
            System.out.println("POST Exception: " + e.getMessage());
            throw e;
        }

        // Test GET /api/follow/followers/{userId}
        try {
            ResponseEntity<String> getResponse = restTemplate.exchange(
                    baseUrl + "/followers/" + userId2,
                    HttpMethod.GET,
                    entity,
                    String.class
            );
            System.out.println("GET Response: " + getResponse.getStatusCode() + " - " + getResponse.getBody());
            assertEquals(200, getResponse.getStatusCode().value());
        } catch (Exception e) {
            System.out.println("GET Exception: " + e.getMessage());
            throw e;
        }
    }
}
