package com.esign.platform.repository;

import com.esign.platform.model.Document;
import com.esign.platform.model.DocumentField;
import com.esign.platform.model.SignerInvite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DocumentFieldRepository extends JpaRepository<DocumentField, UUID> {

    List<DocumentField> findByDocumentOrderByPageNumberAsc(Document document);

    List<DocumentField> findByDocumentId(UUID documentId);

    List<DocumentField> findBySignerInvite(SignerInvite signerInvite);

    void deleteByDocument(Document document);
}

