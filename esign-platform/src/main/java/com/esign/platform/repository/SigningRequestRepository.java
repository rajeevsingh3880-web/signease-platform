package com.esign.platform.repository;

import com.esign.platform.model.Document;
import com.esign.platform.model.SigningRequest;
import com.esign.platform.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SigningRequestRepository extends JpaRepository<SigningRequest, UUID> {

    List<SigningRequest> findByRequestedByOrderByCreatedAtDesc(User user);

    Optional<SigningRequest> findByDocument(Document document);

    List<SigningRequest> findByStatus(SigningRequest.Status status);
}

