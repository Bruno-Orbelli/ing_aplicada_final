package com.finalaplicada.greatburgers.repository;

import java.util.List;

import com.finalaplicada.greatburgers.domain.Order;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.EntityGraph;

/**
 * Spring Data JPA repository for the Order entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    @EntityGraph(attributePaths = {"orderDetails", "orderDetails.product"})
    List<Order> findAll();
}
