package com.finalaplicada.greatburgers.service;

import com.finalaplicada.greatburgers.domain.OrderDet;
import com.finalaplicada.greatburgers.repository.OrderDetRepository;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link OrderDet}.
 */
@Service
@Transactional
public class OrderDetService {

    private final Logger log = LoggerFactory.getLogger(OrderDetService.class);

    private final OrderDetRepository orderDetRepository;

    public OrderDetService(OrderDetRepository orderDetRepository) {
        this.orderDetRepository = orderDetRepository;
    }

    /**
     * Save a orderDet.
     *
     * @param orderDet the entity to save.
     * @return the persisted entity.
     */
    public OrderDet save(OrderDet orderDet) {
        log.debug("Request to save OrderDet : {}", orderDet);
        return orderDetRepository.save(orderDet);
    }

    /**
     * Update a orderDet.
     *
     * @param orderDet the entity to save.
     * @return the persisted entity.
     */
    public OrderDet update(OrderDet orderDet) {
        log.debug("Request to update OrderDet : {}", orderDet);
        return orderDetRepository.save(orderDet);
    }

    /**
     * Partially update a orderDet.
     *
     * @param orderDet the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<OrderDet> partialUpdate(OrderDet orderDet) {
        log.debug("Request to partially update OrderDet : {}", orderDet);

        return orderDetRepository
            .findById(orderDet.getId())
            .map(existingOrderDet -> {
                if (orderDet.getQuantity() != null) {
                    existingOrderDet.setQuantity(orderDet.getQuantity());
                }

                return existingOrderDet;
            })
            .map(orderDetRepository::save);
    }

    /**
     * Get all the orderDets.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<OrderDet> findAll() {
        log.debug("Request to get all OrderDets");
        return orderDetRepository.findAll();
    }

    /**
     * Get one orderDet by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<OrderDet> findOne(Long id) {
        log.debug("Request to get OrderDet : {}", id);
        return orderDetRepository.findById(id);
    }

    /**
     * Delete the orderDet by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete OrderDet : {}", id);
        orderDetRepository.deleteById(id);
    }
}
