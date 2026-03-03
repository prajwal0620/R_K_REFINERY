package com.rkrefinery.backend.auth;

import com.rkrefinery.backend.user.Role;

public class AuthResponse {

    private String token;
    private String username;
    private Role role;

    public AuthResponse() {
    }

    public AuthResponse(String token, String username, Role role) {
        this.token = token;
        this.username = username;
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public String getUsername() {
        return username;
    }

    public Role getRole() {
        return role;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}