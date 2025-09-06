# PayClone - A Full-Stack PayPal Clone

PayClone is a full-stack, microservices-based payment platform that mirrors the core functionalities of PayPal. It's built with a modern, decoupled architecture using Java Spring Boot for the backend and Next.js with TypeScript for the frontend. This project demonstrates a comprehensive understanding of distributed systems, modern web development, and system design principles.

## High-Level Architecture

The system follows a microservices pattern with an **API Gateway** as the single entry point for all client requests. The gateway communicates with a **Service Discovery** server (Eureka) to route requests to the appropriate downstream microservice. Asynchronous communication for features like notifications is handled by an **Apache Kafka** message broker, ensuring resilience and decoupling between services.



<img width="1688" height="867" alt="architcture" src="https://github.com/user-attachments/assets/3986e7c3-db5c-4086-a1e1-84acb8e934e7" />




---

## Features

* **User Authentication:** Secure user registration and login with password hashing.
* **Wallet Management:** Create and manage user wallets and balances.
* **Transactions:** Perform financial transactions between users.
* **Real-time Notifications:** Asynchronous, real-time notifications for events like transactions and money requests.
* **Money Requests:** Users can request money from other users.
* **Transaction History:** View a detailed history of all transactions with filtering and search capabilities.
* **User Profile Management:** Users can view and update their profile information.

---

## Technologies Used

### Backend

* **Java 17 & Spring Boot:** For building robust and scalable microservices.
* **Spring Cloud:** For service discovery (Eureka) and API gateway.
* **Spring Security:** For handling password hashing.
* **Spring Data JPA (Hibernate):** For object-relational mapping.
* **MySQL:** As the primary relational database.
* **Apache Kafka:** For asynchronous, real-time messaging.
* **Maven:** For dependency management.
* **Docker:** For containerizing and running the application and its dependencies.

### Frontend

* **Next.js & React:** For building a modern, server-rendered user interface.
* **TypeScript:** For type-safe code.
* **Tailwind CSS:** For utility-first CSS styling.
* **Shadcn/ui:** For a pre-built set of accessible and reusable UI components.
* **Recharts:** For creating interactive charts and graphs.

---

## Getting Started

### Prerequisites

* Java 17 (or newer)
* Apache Maven
* MySQL Server
* Docker Desktop
* Node.js and npm (or yarn)

### Backend Setup

1.  **Navigate to the `backend` directory.**
2.  **Create a `.env` file** in the `backend` directory with your MySQL credentials:
    ```
    DB_USER=your_mysql_user
    DB_PASSWORD=your_mysql_password
    ```
3.  **Create the necessary MySQL databases:**
    ```sql
    CREATE DATABASE paypal_users;
    CREATE DATABASE paypal_wallets;
    CREATE DATABASE paypal_transactions;
    CREATE DATABASE money_requests;
    ```
4.  **Start all backend services using Docker Compose:**
    ```bash
    docker-compose up --build
    ```
    This command will build the Docker images for each microservice and start all the necessary containers, including Kafka, Zookeeper, and all the Spring Boot applications.

    Verify that all services are registered by visiting the Eureka dashboard at `http://localhost:8761`.

### Frontend Setup

1.  **Navigate to the `src` directory.**
2.  **Install the dependencies:**
    ```bash
    npm install
    ```
3.  **Run the Frontend:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

---

## Screenshots

**Landing Page:**

<img width="1920" height="905" alt="Screenshot 2025-09-06 204647" src="https://github.com/user-attachments/assets/67d42294-7618-477a-b0ff-0a5c5928cf06" />
<img width="1920" height="905" alt="Screenshot 2025-09-06 204707" src="https://github.com/user-attachments/assets/8f858225-d872-41c4-ba51-b06097f5358e" />
<img width="1920" height="902" alt="Screenshot 2025-09-06 204715" src="https://github.com/user-attachments/assets/c0b48301-8799-4670-9cbd-b19b99cac1ba" />


**Dashboard:**

<img width="1920" height="905" alt="Screenshot 2025-09-06 024156" src="https://github.com/user-attachments/assets/93ff06bc-8b23-48bc-a189-fa05f410c57c" />
<img width="1920" height="908" alt="Screenshot 2025-09-06 024657" src="https://github.com/user-attachments/assets/c1276382-5c7f-42ad-8bb0-900d24658c7f" />
<img width="1920" height="905" alt="Screenshot 2025-09-06 024225" src="https://github.com/user-attachments/assets/813cd28c-f97f-4829-9270-311a2ecc2855" />
<img width="1920" height="905" alt="Screenshot 2025-09-06 024235" src="https://github.com/user-attachments/assets/cce01329-3229-4fef-8327-c8d78ec31f92" />


**Send Money:**

<img width="1920" height="902" alt="Screenshot 2025-09-06 024247" src="https://github.com/user-attachments/assets/d36e63c4-fc3e-4236-937f-0989b60b0144" />


**Add Money:**

<img width="1920" height="902" alt="Screenshot 2025-09-06 024332" src="https://github.com/user-attachments/assets/353bc3b0-d155-4fc0-a220-a48f62c8697d" />


**Notification:**

<img width="611" height="905" alt="Screenshot 2025-09-06 024313" src="https://github.com/user-attachments/assets/15efd83d-b030-4784-8ad3-e92e8c6d9f48" />


**Transaction History Page:**

<img width="1920" height="912" alt="Screenshot 2025-09-06 024344" src="https://github.com/user-attachments/assets/34f97ece-8f5d-4b81-bc6c-64f7d6f7c245" />


**Money Request Page:**

<img width="1920" height="908" alt="Screenshot 2025-09-06 024407" src="https://github.com/user-attachments/assets/dac08ccf-1a2a-4acb-8f6a-ea87e6e02cd5" />


**Profile Page**
<img width="1920" height="902" alt="Screenshot 2025-09-06 024418" src="https://github.com/user-attachments/assets/3787909a-3638-41a4-b21b-5829cc503234" />

