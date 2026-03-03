package com.rkrefinery.backend.bill.dto;

import java.time.LocalDate;
import java.util.List;

public class BillRequest {

    private Long customerId;
    private String customerName;
    private String mobile;
    private LocalDate billDate;
    private Double ratePerGram;
    private List<BillItemDto> items;

    public BillRequest() {
    }

    public Long getCustomerId() {
        return customerId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public String getMobile() {
        return mobile;
    }

    public LocalDate getBillDate() {
        return billDate;
    }

    public Double getRatePerGram() {
        return ratePerGram;
    }

    public List<BillItemDto> getItems() {
        return items;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public void setBillDate(LocalDate billDate) {
        this.billDate = billDate;
    }

    public void setRatePerGram(Double ratePerGram) {
        this.ratePerGram = ratePerGram;
    }

    public void setItems(List<BillItemDto> items) {
        this.items = items;
    }
}