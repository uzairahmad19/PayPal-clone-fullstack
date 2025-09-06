package com.clone.paypal.transaction_service;

public class VerifyTransactionPasswordRequest {
    private Long userId;
    private String transactionPassword;

    public VerifyTransactionPasswordRequest(Long userId, String transactionPassword) {
        this.userId = userId;
        this.transactionPassword = transactionPassword;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getTransactionPassword() {
        return transactionPassword;
    }

    public void setTransactionPassword(String transactionPassword) {
        this.transactionPassword = transactionPassword;
    }
}