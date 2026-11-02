package com.esign.platform.repository;

import com.esign.platform.model.SignerInvite;
import com.esign.platform.model.SigningRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SignerInviteRepository extends JpaRepository<SignerInvite, UUID> {

    Optional<SignerInvite> findBySigningToken(UUID signingToken);

    List<SignerInvite> findBySigningRequestOrderBySignOrderAsc(SigningRequest signingRequest);

    List<SignerInvite> findBySignerEmailOrderByCreatedAtDesc(String signerEmail);

    long countBySigningRequestAndStatus(SigningRequest signingRequest, SignerInvite.Status status);

    long countBySigningRequest(SigningRequest signingRequest);

    Optional<SignerInvite> findFirstBySigningRequestAndStatusOrderBySignOrderAsc(
            SigningRequest signingRequest, SignerInvite.Status status);
}

