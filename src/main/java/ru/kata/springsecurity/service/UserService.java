package ru.kata.springsecurity.service;

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

}
