package com.rkrefinery.backend.customer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    @Autowired
    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public List<CustomerDto> getAll(String search) {
        List<Customer> customers;
        if (search != null && !search.isBlank()) {
            customers = customerRepository.findByNameContainingIgnoreCase(search.trim());
        } else {
            customers = customerRepository.findAll();
        }
        return customers.stream()
                .map(CustomerDto::fromEntity)
                .toList();
    }

    public CustomerDto create(CustomerDto dto) {
        Customer customer = new Customer();
        customer.setName(dto.getName().trim());
        customer.setMobile(dto.getMobile().trim());
        Customer saved = customerRepository.save(customer);
        return CustomerDto.fromEntity(saved);
    }

    public CustomerDto getById(Long id) {
        return customerRepository.findById(id)
                .map(CustomerDto::fromEntity)
                .orElse(null);
    }
}