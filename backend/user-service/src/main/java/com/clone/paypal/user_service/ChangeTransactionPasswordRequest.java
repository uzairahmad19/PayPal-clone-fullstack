package com.clone.paypal.user_service;

public class ChangeTransactionPasswordRequest {
    private String currentPassword;
    private String newTxnPassword;

    public String getCurrentPassword() {
        return currentPassword;
    }

    public void setCurrentPassword(String currentPassword) {
        this.currentPassword = currentPassword;
    }

    public String getNewTxnPassword() {
        return newTxnPassword;
    }

    public void setNewTxnPassword(String newTxnPassword) {
        this.newTxnPassword = newTxnPassword;
    }
}