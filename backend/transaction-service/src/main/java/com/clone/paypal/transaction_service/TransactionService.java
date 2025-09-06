package com.clone.paypal.transaction_service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.http.HttpStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Map;

@Service
public class TransactionService {
    @Autowired private TransactionRepository transactionRepository;
    @Autowired private RestTemplate restTemplate;
    @Autowired private KafkaProducerService kafkaProducerService;

    private final String walletServiceUrl = "http://WALLET-SERVICE/api/wallets";
    private final String userServiceUrl = "http://USER-SERVICE/api/users";

    public Transaction performTransaction(Long senderId, String recipientEmail, BigDecimal amount, String description, String transactionPassword) {
        Transaction transaction = new Transaction();
        transaction.setSenderId(senderId);
        transaction.setRecipientId(null);
        transaction.setAmount(amount);
        transaction.setDescription(description);
        transaction.setTimestamp(LocalDateTime.now(ZoneId.of("Asia/Kolkata")));

        try {
            restTemplate.postForEntity(
                    userServiceUrl + "/verify-transaction-password",
                    new VerifyTransactionPasswordRequest(senderId, transactionPassword),
                    Map.class);
        } catch (HttpClientErrorException e) {
            if (e.getStatusCode() == HttpStatus.PRECONDITION_FAILED) {
                transaction.setStatus("FAILED: Transaction password not set");
            } else if (e.getStatusCode() == HttpStatus.UNAUTHORIZED) {
                transaction.setStatus("FAILED: Invalid transaction password");
            } else {
                transaction.setStatus("FAILED: Error verifying transaction password: " + e.getMessage());
            }
            return transactionRepository.save(transaction);
        } catch (Exception e) {
            transaction.setStatus("FAILED: Error verifying transaction password: " + e.getMessage());
            return transactionRepository.save(transaction);
        }

        User recipientUser = null;
        User senderUser = null;
        try {
            senderUser = restTemplate.getForObject(userServiceUrl + "/" + senderId, User.class);
        } catch (Exception e) {
            transaction.setStatus("FAILED: Error fetching sender user details");
            return transactionRepository.save(transaction);
        }

        try {
            recipientUser = restTemplate.getForObject(userServiceUrl + "/email/" + recipientEmail, User.class);
        } catch (HttpClientErrorException.NotFound e) {
            transaction.setStatus("FAILED: Recipient user not found");
            return transactionRepository.save(transaction);
        } catch (Exception e) {
            transaction.setStatus("FAILED: Error fetching recipient user: " + e.getMessage());
            return transactionRepository.save(transaction);
        }

        if (recipientUser == null || recipientUser.getId() == null) {
            transaction.setStatus("FAILED: Recipient user not found or invalid");
            return transactionRepository.save(transaction);
        }

        Long recipientId = recipientUser.getId();
        transaction.setRecipientId(recipientId);

        try {
            restTemplate.postForObject(walletServiceUrl + "/debit", new WalletTransactionRequest(senderId, amount), Void.class);
        } catch (HttpClientErrorException.BadRequest e) {
            transaction.setStatus("FAILED: Insufficient balance");
            String errorMsg = String.format("Transaction of %.2f to %s failed due to insufficient balance.", amount.doubleValue(), recipientEmail);
            kafkaProducerService.sendNotificationEvent(new NotificationRequest(senderId, errorMsg, "Transaction"));
            return transactionRepository.save(transaction);
        } catch (Exception e) {
            transaction.setStatus("FAILED: " + e.getMessage());
            return transactionRepository.save(transaction);
        }

        try {
            restTemplate.postForObject(walletServiceUrl + "/credit", new WalletTransactionRequest(recipientId, amount), Void.class);
            transaction.setStatus("COMPLETED");

            String sentMsg = String.format("You sent %.2f to %s.", amount.doubleValue(), recipientUser.getName());
            kafkaProducerService.sendNotificationEvent(new NotificationRequest(senderId, sentMsg, "Transaction"));

            String receivedMsg = String.format("You received %.2f from %s.", amount.doubleValue(), senderUser.getName());
            kafkaProducerService.sendNotificationEvent(new NotificationRequest(recipientId, receivedMsg, "Transaction"));
        } catch (Exception e) {
            transaction.setStatus("FAILED: " + e.getMessage());
        }
        return transactionRepository.save(transaction);
    }
}