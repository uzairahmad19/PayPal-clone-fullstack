# ---- Build Stage ----
FROM maven:3.8.5-openjdk-17 AS build

WORKDIR /app

# Copy parent pom.xml and all service pom.xmls
COPY pom.xml ./
COPY ./api-gateway/pom.xml ./api-gateway/
COPY ./service-discovery/pom.xml ./service-discovery/
COPY ./user-service/pom.xml ./user-service/
COPY ./wallet-service/pom.xml ./wallet-service/
COPY ./transaction-service/pom.xml ./transaction-service/
COPY ./notification-service/pom.xml ./notification-service/

# Build argument to select service
ARG SERVICE_PATH

# Copy source code of the selected service
COPY ${SERVICE_PATH}/src ./${SERVICE_PATH}/src

# Build the service JAR
RUN mvn -pl ${SERVICE_PATH} -am clean package -Dmaven.test.skip=true

# ---- Runtime Stage ----
FROM openjdk:17-jdk-slim

WORKDIR /app

# Pass SERVICE_PATH as environment variable
ARG SERVICE_PATH
ENV SERVICE_PATH=${SERVICE_PATH}

# Copy the built JAR
COPY --from=build /app/${SERVICE_PATH}/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app.jar"]
