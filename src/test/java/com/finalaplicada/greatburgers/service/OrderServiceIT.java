package com.finalaplicada.greatburgers.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;

import com.finalaplicada.greatburgers.IntegrationTest;
import com.finalaplicada.greatburgers.domain.Order;
import com.finalaplicada.greatburgers.domain.OrderDet;
import com.finalaplicada.greatburgers.domain.Product;
import com.finalaplicada.greatburgers.domain.User;
import com.finalaplicada.greatburgers.repository.OrderDetRepository;
import com.finalaplicada.greatburgers.repository.OrderRepository;
import com.finalaplicada.greatburgers.repository.ProductRepository;
import java.time.LocalDateTime;
import java.util.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.auditing.AuditingHandler;
import org.springframework.data.auditing.DateTimeProvider;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for {@link OrderService}.
 */
@IntegrationTest
@Transactional
class OrderServiceIT {

    private static final String DEFAULT_CLIENT_NAME = "johndoe";
    private static final Boolean DEFAULT_IS_DELIVERED = false;
    private Order DEFAULT_ORDER = new Order();

    private OrderDet DEFAULT_ORDER_DETAIL = new OrderDet();

    private Product DEFAULT_PRODUCT = new Product();

    @Autowired
    private OrderRepository orderRepository;

    @MockBean
    private OrderDetRepository orderDetRepository;

    @Autowired
    private ProductRepository productRepository;

    @MockBean
    private ProductService productService;

    @MockBean
    private OrderDetService orderDetService;

    @Autowired
    private AuditingHandler auditingHandler;

    @MockBean
    private DateTimeProvider dateTimeProvider;

    private User user;

    @BeforeEach
    public void init() {
        productRepository.deleteAll();
        orderRepository.deleteAll();

        Order order = new Order();
        order.setClientName(DEFAULT_CLIENT_NAME);
        order.setIsDelivered(DEFAULT_IS_DELIVERED);
        DEFAULT_ORDER = order;

        when(dateTimeProvider.getNow()).thenReturn(Optional.of(LocalDateTime.now()));
        auditingHandler.setDateTimeProvider(dateTimeProvider);

        Product product1 = new Product();

        product1.setId(1L);
        product1.setProductName("Dummy product");
        product1.setDescription("A dummy product");
        product1.setStock(10);
        product1.setPrice(3.99);
        DEFAULT_PRODUCT = product1;

        OrderDet orderDetail1 = new OrderDet();

        orderDetail1.setOrder(order);
        orderDetail1.setQuantity(5);
        DEFAULT_ORDER_DETAIL = orderDetail1;
    }

    @Test
    @Transactional
    void assertOrderNotCreatedWithUnexistingProduct() {
        DEFAULT_ORDER_DETAIL.setProduct(DEFAULT_PRODUCT);
        Set<OrderDet> orderDets = new HashSet<>();
        OrderService orderService = new OrderService(orderRepository, orderDetRepository, productRepository);
        orderDets.add(DEFAULT_ORDER_DETAIL);
        assertThatThrownBy(() -> orderService.save(DEFAULT_ORDER, orderDets))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("Product not found");
    }

    @Test
    @Transactional
    void assertOrderCreatedAndReducedProductStock() {
        Product product = productRepository.save(DEFAULT_PRODUCT);
        productRepository.flush();
        DEFAULT_ORDER_DETAIL.setProduct(product);
        OrderService orderService = new OrderService(orderRepository, orderDetRepository, productRepository);
        Set<OrderDet> orderDets = new HashSet<>();
        orderDets.add(DEFAULT_ORDER_DETAIL);
        orderService.save(DEFAULT_ORDER, orderDets);
        List<Order> orders = orderRepository.findAll();
        assertThat(orders).hasSize(1);
        assertThat(orders.get(0)).isEqualTo(DEFAULT_ORDER);
        List<Product> products = productRepository.findAll();
        assertThat(products).hasSize(1);
        assertThat(products.get(0).getStock()).isEqualTo(5);
    }

    @Test
    @Transactional
    void assertOrderNotCreatedWithInsufficientProductStock() {
        Product product = productRepository.save(DEFAULT_PRODUCT);
        productRepository.flush();
        DEFAULT_ORDER_DETAIL.setProduct(product);
        OrderService orderService = new OrderService(orderRepository, orderDetRepository, productRepository);
        DEFAULT_ORDER_DETAIL.setQuantity(15);
        Set<OrderDet> orderDets = new HashSet<>();
        orderDets.add(DEFAULT_ORDER_DETAIL);
        assertThatThrownBy(() -> orderService.save(DEFAULT_ORDER, orderDets))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("Product out of stock");
    }
}
