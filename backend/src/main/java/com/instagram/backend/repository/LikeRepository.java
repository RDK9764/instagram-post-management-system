package com.instagram.backend.repository;

import com.instagram.backend.entity.Like;
import com.instagram.backend.entity.Post;
import com.instagram.backend.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LikeRepository
        extends JpaRepository<Like, Long> {

    boolean existsByUserAndPost(
            User user,
            Post post
    );

    Optional<Like> findByUserAndPost(
            User user,
            Post post
    );

    long countByPost(Post post);

    List<Like> findByUser(User user);

    void deleteByUserAndPost(
            User user,
            Post post
    );
}
