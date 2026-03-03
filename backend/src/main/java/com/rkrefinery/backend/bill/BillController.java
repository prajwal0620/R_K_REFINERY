package com.rkrefinery.backend.bill;

import com.rkrefinery.backend.bill.dto.BillRequest;
import com.rkrefinery.backend.bill.dto.BillResponse;
import com.rkrefinery.backend.bill.dto.BillSummaryDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/bills")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class BillController {

    @Autowired
    private BillService billService;

    @PostMapping
    public ResponseEntity<?> createBill(@RequestBody BillRequest request) {
        try {
            BillResponse response = billService.createBill(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<BillResponse> getBill(@PathVariable Long id) {
        BillResponse response = billService.getBill(id);
        return response != null ? ResponseEntity.ok(response) : ResponseEntity.notFound().build();
    }

    @GetMapping
    public ResponseEntity<List<BillSummaryDto>> listBills(
            @RequestParam(value = "fromDate", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(value = "toDate", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(value = "customerName", required = false) String customerName,
            @RequestParam(value = "mobile", required = false) String mobile
    ) {
        return ResponseEntity.ok(
                billService.listBills(fromDate, toDate, customerName, mobile)
        );
    }

    @GetMapping("/summary/today")
    public ResponseEntity<BillService.BillSummaryToday> getTodaySummary() {
        return ResponseEntity.ok(billService.getTodaySummary());
    }
}