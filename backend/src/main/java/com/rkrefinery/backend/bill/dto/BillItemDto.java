package com.rkrefinery.backend.bill.dto;

import com.rkrefinery.backend.bill.BillItem;

public class BillItemDto {

    private Long id;
    private String description;
    private double weight;
    private double touch;
    private double purity;

    public BillItemDto() {
    }

    public BillItemDto(Long id,
                       String description,
                       double weight,
                       double touch,
                       double purity) {
        this.id = id;
        this.description = description;
        this.weight = weight;
        this.touch = touch;
        this.purity = purity;
    }

    public static BillItemDto fromEntity(BillItem item) {
        return new BillItemDto(
                item.getId(),
                item.getDescription(),
                item.getWeight(),
                item.getTouch(),
                item.getPurity()
        );
    }

    // ===== Getters / Setters =====

    public Long getId() {
        return id;
    }

    public String getDescription() {
        return description;
    }

    public double getWeight() {
        return weight;
    }

    public double getTouch() {
        return touch;
    }

    public double getPurity() {
        return purity;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }

    public void setTouch(double touch) {
        this.touch = touch;
    }

    public void setPurity(double purity) {
        this.purity = purity;
    }
}