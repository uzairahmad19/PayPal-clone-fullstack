package com.clone.paypal.user_service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private RestTemplate restTemplate;

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);

        restTemplate.postForObject("http://WALLET-SERVICE/api/wallets",
                new WalletCreationRequest(savedUser.getId()),
                Map.class);

        return ResponseEntity.ok(savedUser);
    }

    public static class LoginRequest {
        public String email;
        public String password;
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        Optional<User> userOptional = userRepository.findByEmail(loginRequest.email);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (passwordEncoder.matches(loginRequest.password, user.getPassword())) {
                boolean transactionPasswordSet = user.getTransactionPassword() != null && !user.getTransactionPassword().isEmpty();
                return ResponseEntity.ok(new LoginResponse("dummy-jwt-token-for-" + user.getId(), user.getId(), user.getFullName(), transactionPasswordSet));
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> userOptional = userRepository.findById(id);
        return userOptional.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        return userOptional.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/me")
    public ResponseEntity<User> getAuthenticatedUser(@RequestHeader("Authorization") String authorizationHeader) {
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer dummy-jwt-token-for-")) {
            try {
                Long userId = Long.parseLong(authorizationHeader.substring("Bearer dummy-jwt-token-for-".length()));
                Optional<User> userOptional = userRepository.findById(userId);
                return userOptional.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
            } catch (NumberFormatException e) {
                return ResponseEntity.badRequest().build();
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam String q) {
        List<User> users = userRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCase(q, q, q);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/analytics/{id}")
    public ResponseEntity<?> getUserAnalytics(@PathVariable Long id) {
        try {
            String transactionServiceUrl = "http://TRANSACTION-SERVICE/api/transactions/user/" + id;
            ResponseEntity<Map> transactionResponse = restTemplate.getForEntity(transactionServiceUrl, Map.class);

            String walletServiceUrl = "http://WALLET-SERVICE/api/wallets/user/" + id;
            ResponseEntity<Map> walletResponse = restTemplate.getForEntity(walletServiceUrl, Map.class);

            Map<String, Object> analytics = Map.of(
                    "transactions", transactionResponse.getBody() != null ? transactionResponse.getBody() : Map.of(),
                    "wallet", walletResponse.getBody() != null ? walletResponse.getBody() : Map.of(),
                    "summary", Map.of(
                            "totalTransactions", 0,
                            "totalSpent", 0,
                            "totalReceived", 0
                    )
            );

            return ResponseEntity.ok(analytics);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch user analytics"));
        }
    }

    public static class PasswordChangeRequest {
        public String currentPassword;
        public String newPassword;
    }

    @PutMapping("/{id}/password")
    public ResponseEntity<?> changePassword(@PathVariable Long id, @RequestBody PasswordChangeRequest passwordChangeRequest) {
        Optional<User> userOptional = userRepository.findById(id);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (passwordEncoder.matches(passwordChangeRequest.currentPassword, user.getPassword())) {
                user.setPassword(passwordEncoder.encode(passwordChangeRequest.newPassword));
                userRepository.save(user);
                return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid current password");
            }
        }

        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            // 1. Delete wallet
            restTemplate.delete("http://WALLET-SERVICE/api/wallets/user/" + id);
            // 2. Delete transactions
            restTemplate.delete("http://TRANSACTION-SERVICE/api/transactions/user/" + id);
            // 3. Delete notifications
            restTemplate.delete("http://NOTIFICATION-SERVICE/api/notifications/user/" + id);
            // 4. Delete user
            userRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Failed to delete user"));
        }
    }
    @PostMapping("/{id}/transaction-password")
    public ResponseEntity<?> setTransactionPassword(@PathVariable Long id, @RequestBody SetTransactionPasswordRequest request) {
        Optional<User> userOptional = userRepository.findById(id);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setTransactionPassword(passwordEncoder.encode(request.getPassword()));
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("message", "Transaction password set successfully"));
        }

        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/transaction-password")
    public ResponseEntity<?> changeTransactionPassword(@PathVariable Long id, @RequestBody ChangeTransactionPasswordRequest request) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOptional.get();

        // Verify user's current login password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Incorrect account password."));
        }

        // Set the new transaction password
        user.setTransactionPassword(passwordEncoder.encode(request.getNewTxnPassword()));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Transaction PIN changed successfully."));
    }

    @PostMapping("/verify-transaction-password")
    public ResponseEntity<?> verifyTransactionPassword(@RequestBody VerifyTransactionPasswordRequest request) {
        Optional<User> userOptional = userRepository.findById(request.getUserId());

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (user.getTransactionPassword() == null) {
                return ResponseEntity.status(HttpStatus.PRECONDITION_FAILED).body(Map.of("verified", false, "error", "Transaction password not set"));
            }
            if (passwordEncoder.matches(request.getTransactionPassword(), user.getTransactionPassword())) {
                return ResponseEntity.ok(Map.of("verified", true));
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("verified", false, "error", "Invalid transaction password"));
    }
    @PutMapping("/{id}/name")
    public ResponseEntity<?> updateUserName(@PathVariable Long id, @RequestBody UpdateNameRequest request) {
        Optional<User> userOptional = userRepository.findById(id);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("message", "Name updated successfully"));
        }

        return ResponseEntity.notFound().build();
    }
}