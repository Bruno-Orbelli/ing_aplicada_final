package com.finalaplicada.greatburgers.web.rest;

import com.finalaplicada.greatburgers.domain.OrderDet;
import com.finalaplicada.greatburgers.repository.OrderDetRepository;
import com.finalaplicada.greatburgers.service.OrderDetService;
import com.finalaplicada.greatburgers.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.finalaplicada.greatburgers.domain.OrderDet}.
 */
@RestController
@RequestMapping("/api")
public class OrderDetResource {

    private final Logger log = LoggerFactory.getLogger(OrderDetResource.class);

    private static final String ENTITY_NAME = "orderDet";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OrderDetService orderDetService;

    private final OrderDetRepository orderDetRepository;

    public OrderDetResource(OrderDetService orderDetService, OrderDetRepository orderDetRepository) {
        this.orderDetService = orderDetService;
        this.orderDetRepository = orderDetRepository;
    }

    /**
     * {@code POST  /order-dets} : Create a new orderDet.
     *
     * @param orderDet the orderDet to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new orderDet, or with status {@code 400 (Bad Request)} if the orderDet has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/order-dets")
    public ResponseEntity<OrderDet> createOrderDet(@RequestBody OrderDet orderDet) throws URISyntaxException {
        log.debug("REST request to save OrderDet : {}", orderDet);
        if (orderDet.getId() != null) {
            throw new BadRequestAlertException("A new orderDet cannot already have an ID", ENTITY_NAME, "idexists");
        }
        OrderDet result = orderDetService.save(orderDet);
        return ResponseEntity
            .created(new URI("/api/order-dets/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /order-dets/:id} : Updates an existing orderDet.
     *
     * @param id the id of the orderDet to save.
     * @param orderDet the orderDet to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated orderDet,
     * or with status {@code 400 (Bad Request)} if the orderDet is not valid,
     * or with status {@code 500 (Internal Server Error)} if the orderDet couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/order-dets/{id}")
    public ResponseEntity<OrderDet> updateOrderDet(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody OrderDet orderDet
    ) throws URISyntaxException {
        log.debug("REST request to update OrderDet : {}, {}", id, orderDet);
        if (orderDet.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, orderDet.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!orderDetRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        OrderDet result = orderDetService.update(orderDet);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, orderDet.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /order-dets/:id} : Partial updates given fields of an existing orderDet, field will ignore if it is null
     *
     * @param id the id of the orderDet to save.
     * @param orderDet the orderDet to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated orderDet,
     * or with status {@code 400 (Bad Request)} if the orderDet is not valid,
     * or with status {@code 404 (Not Found)} if the orderDet is not found,
     * or with status {@code 500 (Internal Server Error)} if the orderDet couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/order-dets/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<OrderDet> partialUpdateOrderDet(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody OrderDet orderDet
    ) throws URISyntaxException {
        log.debug("REST request to partial update OrderDet partially : {}, {}", id, orderDet);
        if (orderDet.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, orderDet.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!orderDetRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<OrderDet> result = orderDetService.partialUpdate(orderDet);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, orderDet.getId().toString())
        );
    }

    /**
     * {@code GET  /order-dets} : get all the orderDets.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of orderDets in body.
     */
    @GetMapping("/order-dets")
    public List<OrderDet> getAllOrderDets() {
        log.debug("REST request to get all OrderDets");
        return orderDetService.findAll();
    }

    /**
     * {@code GET  /order-dets/:id} : get the "id" orderDet.
     *
     * @param id the id of the orderDet to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the orderDet, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/order-dets/{id}")
    public ResponseEntity<OrderDet> getOrderDet(@PathVariable Long id) {
        log.debug("REST request to get OrderDet : {}", id);
        Optional<OrderDet> orderDet = orderDetService.findOne(id);
        return ResponseUtil.wrapOrNotFound(orderDet);
    }

    /**
     * {@code DELETE  /order-dets/:id} : delete the "id" orderDet.
     *
     * @param id the id of the orderDet to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/order-dets/{id}")
    public ResponseEntity<Void> deleteOrderDet(@PathVariable Long id) {
        log.debug("REST request to delete OrderDet : {}", id);
        orderDetService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
