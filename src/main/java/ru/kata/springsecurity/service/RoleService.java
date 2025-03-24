package ru.kata.springsecurity.service;

import ru.kata.springsecurity.entity.Role;
import java.util.List;
import java.util.Optional;

public interface RoleService {
    List<Role> findAll();
    Optional<Role> findById(Long id);
    Optional<Role> findByName(String name);
    Role save(Role role);
    void deleteById(Long id);
}
