package com.rkrefinery.backend.customer;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @GetMapping
    public ResponseEntity<List<CustomerDto>> listCustomers(
            @RequestParam(value = "search", required = false) String search
    ) {
        return ResponseEntity.ok(customerService.getAll(search));
    }

    @PostMapping
    public ResponseEntity<CustomerDto> createCustomer(@Valid @RequestBody CustomerDto dto) {
        if (dto.getName() == null || dto.getName().isBlank()
                || dto.getMobile() == null || dto.getMobile().isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(customerService.create(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerDto> getCustomer(@PathVariable Long id) {
        CustomerDto dto = customerService.getById(id);
        return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.notFound().build();
    }
}