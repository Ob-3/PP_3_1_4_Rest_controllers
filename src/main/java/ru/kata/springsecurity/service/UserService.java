package ru.kata.springsecurity.service;

import jakarta.transaction.Transactional;
import ru.kata.springsecurity.entity.User;
import java.util.List;
import java.util.Optional;

public interface UserService {
    List<User> findAll();
    Optional<User>  findById(Long id);
    Optional<User> findByUsername(String username);
    User save(User user);
    void update(User user);
    void deleteById(Long id);

    @Transactional
    User createUserWithRoles(User user, List<String> roleIds);

    @Transactional
    void registerNewUser(String username, String password, String firstName, String lastName, int age, String email);

    @Transactional
    User updateUserWithRoles(User user, List<Long> roleIds);
}
