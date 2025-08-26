\# PayClone - A Full-Stack PayPal Clone



PayClone is a full-stack, microservices-based payment platform that mirrors the core functionalities of PayPal. It's built with a modern, decoupled architecture using Java Spring Boot for the backend and Next.js with TypeScript for the frontend. This project demonstrates a comprehensive understanding of distributed systems, modern web development, and system design principles.



\## High-Level Architecture



The system follows a microservices pattern with an \*\*API Gateway\*\* as the single entry point for all client requests. The gateway communicates with a \*\*Service Discovery\*\* server (Eureka) to route requests to the appropriate downstream microservice. Asynchronous communication for features like notifications is handled by an \*\*Apache Kafka\*\* message broker, ensuring resilience and decoupling between services.







\[Image of a microservices architecture diagram]





---



\## Features



\* \*\*User Authentication:\*\* Secure user registration and login with password hashing.

\* \*\*Wallet Management:\*\* Create and manage user wallets and balances.

\* \*\*Transactions:\*\* Perform financial transactions between users.

\* \*\*Real-time Notifications:\*\* Asynchronous, real-time notifications for events like transactions and money requests.

\* \*\*Money Requests:\*\* Users can request money from other users.

\* \*\*Transaction History:\*\* View a detailed history of all transactions with filtering and search capabilities.

\* \*\*User Profile Management:\*\* Users can view and update their profile information.



---



\## Technologies Used



\### Backend



\* \*\*Java 17 \& Spring Boot:\*\* For building robust and scalable microservices.

\* \*\*Spring Cloud:\*\* For service discovery (Eureka) and API gateway.

\* \*\*Spring Security:\*\* For handling password hashing.

\* \*\*Spring Data JPA (Hibernate):\*\* For object-relational mapping.

\* \*\*MySQL:\*\* As the primary relational database.

\* \*\*Apache Kafka:\*\* For asynchronous, real-time messaging.

\* \*\*Maven:\*\* For dependency management.

\* \*\*Docker:\*\* For containerizing and running the application and its dependencies.



\### Frontend



\* \*\*Next.js \& React:\*\* For building a modern, server-rendered user interface.

\* \*\*TypeScript:\*\* For type-safe code.

\* \*\*Tailwind CSS:\*\* For utility-first CSS styling.

\* \*\*Shadcn/ui:\*\* For a pre-built set of accessible and reusable UI components.

\* \*\*Recharts:\*\* For creating interactive charts and graphs.



---



\## Getting Started



\### Prerequisites



\* Java 17 (or newer)

\* Apache Maven

\* MySQL Server

\* Docker Desktop

\* Node.js and npm (or yarn)



\### Backend Setup



1\.  \*\*Navigate to the `backend` directory.\*\*

2\.  \*\*Create a `.env` file\*\* in the `backend` directory with your MySQL credentials:

&nbsp;   ```

&nbsp;   DB\_USER=your\_mysql\_user

&nbsp;   DB\_PASSWORD=your\_mysql\_password

&nbsp;   ```

3\.  \*\*Create the necessary MySQL databases:\*\*

&nbsp;   ```sql

&nbsp;   CREATE DATABASE paypal\_users;

&nbsp;   CREATE DATABASE paypal\_wallets;

&nbsp;   CREATE DATABASE paypal\_transactions;

&nbsp;   CREATE DATABASE money\_requests;

&nbsp;   ```

4\.  \*\*Start all backend services using Docker Compose:\*\*

&nbsp;   ```bash

&nbsp;   docker-compose up --build

&nbsp;   ```

&nbsp;   This command will build the Docker images for each microservice and start all the necessary containers, including Kafka, Zookeeper, and all the Spring Boot applications.



&nbsp;   Verify that all services are registered by visiting the Eureka dashboard at `http://localhost:8761`.



\### Frontend Setup



1\.  \*\*Navigate to the `src` directory.\*\*

2\.  \*\*Install the dependencies:\*\*

&nbsp;   ```bash

&nbsp;   npm install

&nbsp;   ```

3\.  \*\*Run the Frontend:\*\*

&nbsp;   ```bash

&nbsp;   npm run dev

&nbsp;   ```

&nbsp;   The application will be available at `http://localhost:3000`.



---



\## Screenshots



\*\*Dashboard\*\*

!\[Dashboard](placeholder.png)



\*\*Transactions Page\*\*

!\[Transactions Page](placeholder.png)



\*\*Profile Page\*\*

!\[Profile Page](placeholder.png)

