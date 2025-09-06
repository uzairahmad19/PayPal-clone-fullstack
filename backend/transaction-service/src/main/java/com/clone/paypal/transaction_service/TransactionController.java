// backend/transaction-service/src/main/java/com/clone/paypal/transaction_service/TransactionController.java

package com.clone.paypal.transaction_service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import org.springframework.transaction.annotation.Transactional;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
    @Autowired private TransactionService transactionService;
    @Autowired private TransactionRepository transactionRepository;

    @PostMapping
    public ResponseEntity<?> createTransaction(@RequestBody TransactionRequest request) {
        Transaction newTransaction = transactionService.performTransaction(
                request.getSenderId(),
                request.getRecipientEmail(),
                request.getAmount(),
                request.getDescription(),
                request.getTransactionPassword()
        );

        if (newTransaction.getStatus().startsWith("FAILED")) {
            String errorMessage = newTransaction.getStatus().replace("FAILED: ", "");
            return ResponseEntity.badRequest().body(Map.of("message", errorMessage));
        }

        return ResponseEntity.ok(newTransaction);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Transaction>> getTransactionsByUserId(@PathVariable Long userId) {
        List<Transaction> transactions = transactionRepository.findBySenderIdOrRecipientId(userId, userId);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Transaction> getTransactionById(@PathVariable Long id) {
        return transactionRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/user/{userId}")
    @Transactional
    public ResponseEntity<Void> deleteTransactionsByUserId(@PathVariable Long userId) {
        transactionRepository.deleteBySenderIdOrRecipientId(userId, userId);
        return ResponseEntity.ok().build();
    }
}