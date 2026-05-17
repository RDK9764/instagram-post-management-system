package com.instagram.backend.repository;

import com.instagram.backend.entity.Post;
import com.instagram.backend.entity.User;

import org.springframework.data.jpa.repository
        .JpaRepository;

import java.util.List;

public interface PostRepository
        extends JpaRepository<Post, Long> {

    List<Post> findByHashtagsContaining(
            String hashtag
    );

    List<Post> findByUser(User user);
    List<Post>
findByScheduledTrueAndPublishedFalse();

List<Post>
findByPublishedTrue();
}