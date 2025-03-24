package ru.kata.springsecurity.controllers;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import ru.kata.springsecurity.security.CustomUserDetails;

@Controller
@RequestMapping("/user")
public class UserController {

    @GetMapping("/home")
    public String userHome(Model model, @AuthenticationPrincipal CustomUserDetails userDetails) {
        model.addAttribute("user", userDetails.getUser()); // Передаем объект User в шаблон
        return "user-panel";
    }
}
