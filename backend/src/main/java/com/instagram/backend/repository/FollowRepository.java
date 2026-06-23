package com.instagram.backend.repository;

import com.instagram.backend.entity.Follow;
import com.instagram.backend.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FollowRepository
        extends JpaRepository<Follow, Long> {

    boolean existsByFollowerAndFollowing(
            User follower,
            User following
    );

    Optional<Follow> findByFollowerAndFollowing(
            User follower,
            User following
    );

    List<Follow> findByFollower(User follower);

    List<Follow> findByFollowing(User following);

    long countByFollower(User follower);

    long countByFollowing(User following);

    @Query("SELECT f.follower FROM Follow f WHERE f.following.id = :userId")
    List<User> findFollowersByUserId(@Param("userId") Long userId);

    @Query("SELECT f.following FROM Follow f WHERE f.follower.id = :userId")
    List<User> findFollowingByUserId(@Param("userId") Long userId);

    @Query("SELECT CASE WHEN COUNT(f) > 0 THEN true ELSE false END FROM Follow f WHERE f.follower.id = :followerId AND f.following.id = :followingId")
    boolean existsByFollowerIdAndFollowingId(@Param("followerId") Long followerId, @Param("followingId") Long followingId);
}