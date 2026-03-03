package com.rkrefinery.backend.customer;

public class CustomerDto {

    private Long id;
    private String name;
    private String mobile;

    public CustomerDto() {
    }

    public CustomerDto(Long id, String name, String mobile) {
        this.id = id;
        this.name = name;
        this.mobile = mobile;
    }

    public static CustomerDto fromEntity(Customer c) {
        return new CustomerDto(c.getId(), c.getName(), c.getMobile());
    }

    // Getters / Setters

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getMobile() {
        return mobile;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }
}