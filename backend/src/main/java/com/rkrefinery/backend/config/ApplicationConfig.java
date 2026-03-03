// src/main/java/com/rkrefinery/backend/config/ApplicationConfig.java
package com.rkrefinery.backend.config;

import com.rkrefinery.backend.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class ApplicationConfig {

    @Autowired
    private UserService userService;

    // JWT filter ke liye UserDetailsService
    @Bean
    public UserDetailsService userDetailsService() {
        return userService;
    }

    // Password encoder (BCrypt)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // ❌ Yahan koi AuthenticationManager ya DaoAuthenticationProvider
    // ka bean define NAHIN kar rahe (hum manual login use kar rahe hain)
}