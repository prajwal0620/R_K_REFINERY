package com.rkrefinery.backend.bill;

import com.rkrefinery.backend.bill.dto.BillItemDto;
import com.rkrefinery.backend.bill.dto.BillRequest;
import com.rkrefinery.backend.bill.dto.BillResponse;
import com.rkrefinery.backend.bill.dto.BillSummaryDto;
import com.rkrefinery.backend.customer.Customer;
import com.rkrefinery.backend.customer.CustomerRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

@Service
public class BillService {

    private final BillRepository billRepository;
    private final CustomerRepository customerRepository;

    public BillService(BillRepository billRepository,
                       CustomerRepository customerRepository) {
        this.billRepository = billRepository;
        this.customerRepository = customerRepository;
    }

    @Transactional
    public BillResponse createBill(BillRequest request) {
        if (request.getCustomerName() == null || request.getCustomerName().isBlank()
                || request.getMobile() == null || request.getMobile().isBlank()) {
            throw new IllegalArgumentException("Customer name and mobile required");
        }
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException("At least one item required");
        }

        // Find or create customer
        Customer customer = null;
        if (request.getCustomerId() != null) {
            customer = customerRepository.findById(request.getCustomerId())
                    .orElse(null);
        }
        if (customer == null) {
            customer = customerRepository.findByMobile(request.getMobile().trim())
                    .orElse(null);
            if (customer == null) {
                customer = new Customer();
                customer.setName(request.getCustomerName().trim());
                customer.setMobile(request.getMobile().trim());
                customer = customerRepository.save(customer);
            }
        }

        LocalDate billDate = request.getBillDate() != null
                ? request.getBillDate()
                : LocalDate.now();

        Bill bill = new Bill();
        bill.setCustomer(customer);
        bill.setBillDate(billDate);
        bill.setRatePerGram(request.getRatePerGram());

        double totalWeight = 0;
        double totalPurity = 0;

        for (BillItemDto itemDto : request.getItems()) {
            if (itemDto.getWeight() <= 0) continue;

            double weight = itemDto.getWeight();
            double touch = itemDto.getTouch();
            double purity = (weight * touch) / 100.0;

            BillItem item = new BillItem();
            String desc = itemDto.getDescription();
            if (desc == null || desc.isBlank()) {
                desc = "Item";
            }
            item.setDescription(desc.trim());
            item.setWeight(weight);
            item.setTouch(touch);
            item.setPurity(purity);

            bill.addItem(item);

            totalWeight += weight;
            totalPurity += purity;
        }

        bill.setTotalWeight(totalWeight);
        bill.setTotalPurity(totalPurity);

        double rate = request.getRatePerGram() != null ? request.getRatePerGram() : 0.0;
        bill.setTotalAmount(Math.round(totalPurity * rate));

        // Save to get ID
        Bill saved = billRepository.save(bill);

        if (saved.getBillNumber() == null) {
            String billNumber = String.format("BILL-%04d", saved.getId());
            saved.setBillNumber(billNumber);
            saved = billRepository.save(saved);
        }

        return BillResponse.fromEntity(saved);
    }

    public BillResponse getBill(Long id) {
        return billRepository.findById(id)
                .map(BillResponse::fromEntity)
                .orElse(null);
    }

    public List<BillSummaryDto> listBills(LocalDate fromDate,
                                          LocalDate toDate,
                                          String customerName,
                                          String mobile) {

        List<Bill> bills;
        if (fromDate != null && toDate != null) {
            bills = billRepository.findByBillDateBetween(fromDate, toDate);
        } else {
            bills = billRepository.findAll();
        }

        bills = bills.stream()
                .filter(b -> {
                    if (fromDate != null && b.getBillDate().isBefore(fromDate)) return false;
                    if (toDate != null && b.getBillDate().isAfter(toDate)) return false;

                    if (customerName != null && !customerName.isBlank()) {
                        if (!b.getCustomer().getName().toLowerCase()
                                .contains(customerName.toLowerCase().trim())) {
                            return false;
                        }
                    }

                    if (mobile != null && !mobile.isBlank()) {
                        if (!b.getCustomer().getMobile().contains(mobile.trim())) {
                            return false;
                        }
                    }

                    return true;
                })
                .sorted(Comparator.comparing(Bill::getBillDate).reversed()
                        .thenComparing(Bill::getId).reversed())
                .toList();

        return bills.stream()
                .map(BillSummaryDto::fromEntity)
                .toList();
    }

    public BillSummaryToday getTodaySummary() {
        LocalDate today = LocalDate.now();
        List<Bill> todayBills = billRepository.findByBillDate(today);

        long totalBills = todayBills.size();
        double totalWeight = todayBills.stream()
                .mapToDouble(Bill::getTotalWeight)
                .sum();
        double totalAmount = todayBills.stream()
                .mapToDouble(Bill::getTotalAmount)
                .sum();

        return new BillSummaryToday(totalBills, totalWeight, totalAmount);
    }

    public record BillSummaryToday(long totalBillsToday,
                                   double totalWeight,
                                   double totalAmount) {}
}