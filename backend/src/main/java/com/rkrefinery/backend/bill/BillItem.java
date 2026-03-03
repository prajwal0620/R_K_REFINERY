package com.rkrefinery.backend.bill;

import jakarta.persistence.*;

@Entity
@Table(name = "bill_items")
public class BillItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many items -> one bill
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bill_id")
    private Bill bill;

    @Column(nullable = false, length = 120)
    private String description;

    @Column(nullable = false)
    private double weight;

    @Column(nullable = false)
    private double touch;

    @Column(nullable = false)
    private double purity;

    public BillItem() {
    }

    public BillItem(Long id,
                    Bill bill,
                    String description,
                    double weight,
                    double touch,
                    double purity) {
        this.id = id;
        this.bill = bill;
        this.description = description;
        this.weight = weight;
        this.touch = touch;
        this.purity = purity;
    }

    // ===== Getters / Setters =====

    public Long getId() {
        return id;
    }

    public Bill getBill() {
        return bill;
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

    public void setBill(Bill bill) {
        this.bill = bill;
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