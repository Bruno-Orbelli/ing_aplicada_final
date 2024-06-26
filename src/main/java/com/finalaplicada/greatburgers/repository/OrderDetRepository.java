package com.finalaplicada.greatburgers.repository;

import com.finalaplicada.greatburgers.domain.OrderDet;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Spring Data JPA repository for the OrderDet entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OrderDetRepository extends JpaRepository<OrderDet, Long> {
    @EntityGraph(attributePaths = {"product"})
    List<OrderDet> findByOrderId(Long orderId);
    @EntityGraph(attributePaths = {"product"})
    List<OrderDet> findAll();
}
