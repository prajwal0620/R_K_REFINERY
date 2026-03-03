package com.rkrefinery.backend.bill.dto;

import com.rkrefinery.backend.bill.Bill;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class BillResponse {

    private Long id;
    private String billNumber;

    private Long customerId;
    private String customerName;
    private String mobile;

    private LocalDate billDate;
    private Double ratePerGram;

    private double totalWeight;
    private double totalPurity;
    private double totalAmount;

    private List<BillItemDto> items;

    public BillResponse() {
    }

    public BillResponse(Long id,
                        String billNumber,
                        Long customerId,
                        String customerName,
                        String mobile,
                        LocalDate billDate,
                        Double ratePerGram,
                        double totalWeight,
                        double totalPurity,
                        double totalAmount,
                        List<BillItemDto> items) {
        this.id = id;
        this.billNumber = billNumber;
        this.customerId = customerId;
        this.customerName = customerName;
        this.mobile = mobile;
        this.billDate = billDate;
        this.ratePerGram = ratePerGram;
        this.totalWeight = totalWeight;
        this.totalPurity = totalPurity;
        this.totalAmount = totalAmount;
        this.items = items;
    }

    public static BillResponse fromEntity(Bill bill) {
        List<BillItemDto> itemDtos = new ArrayList<>();
        if (bill.getItems() != null) {
            for (var item : bill.getItems()) {
                itemDtos.add(BillItemDto.fromEntity(item));
            }
        }

        return new BillResponse(
                bill.getId(),
                bill.getBillNumber(),
                bill.getCustomer().getId(),
                bill.getCustomer().getName(),
                bill.getCustomer().getMobile(),
                bill.getBillDate(),
                bill.getRatePerGram(),
                bill.getTotalWeight(),
                bill.getTotalPurity(),
                bill.getTotalAmount(),
                itemDtos
        );
    }

    // ===== Getters / Setters =====

    public Long getId() {
        return id;
    }

    public String getBillNumber() {
        return billNumber;
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

    public double getTotalWeight() {
        return totalWeight;
    }

    public double getTotalPurity() {
        return totalPurity;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public List<BillItemDto> getItems() {
        return items;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setBillNumber(String billNumber) {
        this.billNumber = billNumber;
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

    public void setTotalWeight(double totalWeight) {
        this.totalWeight = totalWeight;
    }

    public void setTotalPurity(double totalPurity) {
        this.totalPurity = totalPurity;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public void setItems(List<BillItemDto> items) {
        this.items = items;
    }
}