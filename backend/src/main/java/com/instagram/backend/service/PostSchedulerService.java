package com.instagram.backend.service;

import com.instagram.backend.entity.Post;
import com.instagram.backend.repository.PostRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PostSchedulerService {

    @Autowired
    private PostRepository postRepository;

    @Scheduled(fixedRate = 60000)
    public void publishScheduledPosts() {

        List<Post> posts =
                postRepository
                .findByScheduledTrueAndPublishedFalse();

        LocalDateTime now =
                LocalDateTime.now();

        for(Post post : posts) {

            if(post.getScheduledTime()
                    .isBefore(now)) {

                post.setPublished(true);

                postRepository.save(post);

                System.out.println(
                        "Published scheduled post: "
                        + post.getId()
                );
            }
        }
    }
}