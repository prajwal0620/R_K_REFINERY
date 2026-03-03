package com.rkrefinery.backend.bill.dto;

import com.rkrefinery.backend.bill.Bill;

import java.time.LocalDate;

public class BillSummaryDto {

    private Long id;
    private String billNumber;
    private LocalDate billDate;
    private String customerName;
    private String mobile;
    private double totalWeight;
    private double totalPurity;

    public BillSummaryDto() {
    }

    public BillSummaryDto(Long id,
                          String billNumber,
                          LocalDate billDate,
                          String customerName,
                          String mobile,
                          double totalWeight,
                          double totalPurity) {
        this.id = id;
        this.billNumber = billNumber;
        this.billDate = billDate;
        this.customerName = customerName;
        this.mobile = mobile;
        this.totalWeight = totalWeight;
        this.totalPurity = totalPurity;
    }

    public static BillSummaryDto fromEntity(Bill bill) {
        return new BillSummaryDto(
                bill.getId(),
                bill.getBillNumber(),
                bill.getBillDate(),
                bill.getCustomer().getName(),
                bill.getCustomer().getMobile(),
                bill.getTotalWeight(),
                bill.getTotalPurity()
        );
    }

    // ===== Getters / Setters =====

    public Long getId() {
        return id;
    }

    public String getBillNumber() {
        return billNumber;
    }

    public LocalDate getBillDate() {
        return billDate;
    }

    public String getCustomerName() {
        return customerName;
    }

    public String getMobile() {
        return mobile;
    }

    public double getTotalWeight() {
        return totalWeight;
    }

    public double getTotalPurity() {
        return totalPurity;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setBillNumber(String billNumber) {
        this.billNumber = billNumber;
    }

    public void setBillDate(LocalDate billDate) {
        this.billDate = billDate;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public void setTotalWeight(double totalWeight) {
        this.totalWeight = totalWeight;
    }

    public void setTotalPurity(double totalPurity) {
        this.totalPurity = totalPurity;
    }
}