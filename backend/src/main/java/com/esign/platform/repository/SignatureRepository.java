package com.esign.platform.repository;

import com.esign.platform.model.Document;
import com.esign.platform.model.Signature;
import com.esign.platform.model.SignerInvite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SignatureRepository extends JpaRepository<Signature, UUID> {

    List<Signature> findByDocument(Document document);

    List<Signature> findByDocumentId(UUID documentId);

    Optional<Signature> findBySignerInvite(SignerInvite signerInvite);
}

