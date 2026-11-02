package com.esign.platform.repository;

import com.esign.platform.model.User;
import com.esign.platform.model.Webhook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface WebhookRepository extends JpaRepository<Webhook, UUID> {

    List<Webhook> findByUser(User user);

    List<Webhook> findByActiveTrue();
}

