# ==========================================
# Multi-stage Dockerfile for SignEase E-Sign
# ==========================================

# Stage 1: Build Frontend SPA
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Spring Boot JAR with embedded static frontend
FROM maven:3.9.6-eclipse-temurin-21-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/pom.xml .
RUN mvn dependency:go-offline -B
COPY backend/src ./src

# Copy built frontend assets to Spring Boot static resources
COPY --from=frontend-builder /app/frontend/dist ./src/main/resources/static/

RUN mvn clean package -DskipTests -B

# Stage 3: Lightweight Production Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Install fontconfig and fonts for PDF rendering (Apache PDFBox requires fonts)
RUN apk add --no-cache fontconfig ttf-dejavu

# Create upload directories
RUN mkdir -p /app/uploads/documents /app/uploads/sealed /app/uploads/signatures

# Copy built JAR from backend builder
COPY --from=backend-builder /app/backend/target/*.jar app.jar

ENV PORT=8080
ENV SPRING_PROFILES_ACTIVE=prod
EXPOSE 8080

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]

