package com.finalaplicada.greatburgers.service;

import com.finalaplicada.greatburgers.domain.Order;
import com.finalaplicada.greatburgers.domain.OrderDet;
import com.finalaplicada.greatburgers.domain.Product;
import com.finalaplicada.greatburgers.repository.OrderRepository;
import com.finalaplicada.greatburgers.repository.OrderDetRepository;
import com.finalaplicada.greatburgers.repository.ProductRepository;
import java.util.List;
import java.util.Set;
import java.time.Instant;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Order}.
 */
@Service
@Transactional
public class OrderService {

    private final Logger log = LoggerFactory.getLogger(OrderService.class);
    private final OrderRepository orderRepository;
    private final OrderDetRepository orderDetRepository;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository, OrderDetRepository orderDetRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.orderDetRepository = orderDetRepository;
        this.productRepository = productRepository;
    }

    /**
     * Save a order.
     *
     * @param order the entity to save.
     * @param orderDetails the entity to save.
     * @return the persisted entity.
     */
    public Order save(Order order, Set<OrderDet> orderDetails) {
        log.debug("Request to save Order : {} with OrderDetails : {}", order, orderDetails);
        order.setOrderedAt(Instant.now());
        order.setIsDelivered(false);

        Order savedOrder = orderRepository.save(order);

        for (OrderDet orderDet : orderDetails) {
            Product product = productRepository.findById(orderDet.getProduct().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found"));
            if (product.getStock() < orderDet.getQuantity()) {
                throw new IllegalArgumentException("Product out of stock");
            }
            product.setStock(product.getStock() - orderDet.getQuantity());
            productRepository.save(product);
            orderDet.setProduct(product);
            orderDet.setOrder(savedOrder);
            orderDetRepository.save(orderDet);
        }

        savedOrder.setOrderDetails(orderDetails);
        return savedOrder;
    }

    /**
     * Update a order.
     *
     * @param order the entity to save.
     * @return the persisted entity.
     */
    public Order update(Order order) {
        log.debug("Request to update Order : {}", order);
        return orderRepository.save(order);
    }

    /**
     * Partially update a order.
     *
     * @param order the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Order> partialUpdate(Order order) {
        log.debug("Request to partially update Order : {}", order);

        return orderRepository
            .findById(order.getId())
            .map(existingOrder -> {
                if (order.getClientName() != null) {
                    existingOrder.setClientName(order.getClientName());
                }
                if (order.getOrderedAt() != null) {
                    existingOrder.setOrderedAt(order.getOrderedAt());
                }
                if (order.getIsDelivered() != null) {
                    existingOrder.setIsDelivered(order.getIsDelivered());
                }
                if (order.getDeliveredAt() != null) {
                    existingOrder.setDeliveredAt(order.getDeliveredAt());
                }

                return existingOrder;
            })
            .map(orderRepository::save);
    }

    /**
     * Get all the orders.
     *
     * @return the list of entities.
     */
    @Transactional
    public List<Order> findAll() {
        log.debug("Request to get all Orders");
        List<Order> orders = orderRepository.findAll();
        for (Order order : orders) {
            List<OrderDet> orderDetails = orderDetRepository.findByOrderId(order.getId());
            orderDetails.forEach(orderDet -> {
                Product product = productRepository.findById(orderDet.getProduct().getId())
                        .orElseThrow(() -> new IllegalArgumentException("Product not found"));
                orderDet.setProduct(product);
            });
            order.setOrderDetails(Set.copyOf(orderDetails));
        }
        return orders;
    }

    /**
     * Get one order by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Order> findOne(Long id) {
        log.debug("Request to get Order : {}", id);
        return orderRepository.findById(id);
    }

    /**
     * Delete the order by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Order : {}", id);
        orderRepository.deleteById(id);
    }
}
