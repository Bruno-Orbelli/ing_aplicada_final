package com.finalaplicada.greatburgers.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.finalaplicada.greatburgers.IntegrationTest;
import com.finalaplicada.greatburgers.domain.OrderDet;
import com.finalaplicada.greatburgers.repository.OrderDetRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link OrderDetResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class OrderDetResourceIT {

    private static final Integer DEFAULT_QUANTITY = 1;
    private static final Integer UPDATED_QUANTITY = 2;

    private static final String ENTITY_API_URL = "/api/order-dets";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private OrderDetRepository orderDetRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restOrderDetMockMvc;

    private OrderDet orderDet;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OrderDet createEntity(EntityManager em) {
        OrderDet orderDet = new OrderDet().quantity(DEFAULT_QUANTITY);
        return orderDet;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OrderDet createUpdatedEntity(EntityManager em) {
        OrderDet orderDet = new OrderDet().quantity(UPDATED_QUANTITY);
        return orderDet;
    }

    @BeforeEach
    public void initTest() {
        orderDet = createEntity(em);
    }

    @Test
    @Transactional
    void createOrderDet() throws Exception {
        int databaseSizeBeforeCreate = orderDetRepository.findAll().size();
        // Create the OrderDet
        restOrderDetMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(orderDet)))
            .andExpect(status().isCreated());

        // Validate the OrderDet in the database
        List<OrderDet> orderDetList = orderDetRepository.findAll();
        assertThat(orderDetList).hasSize(databaseSizeBeforeCreate + 1);
        OrderDet testOrderDet = orderDetList.get(orderDetList.size() - 1);
        assertThat(testOrderDet.getQuantity()).isEqualTo(DEFAULT_QUANTITY);
    }

    @Test
    @Transactional
    void createOrderDetWithExistingId() throws Exception {
        // Create the OrderDet with an existing ID
        orderDet.setId(1L);

        int databaseSizeBeforeCreate = orderDetRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restOrderDetMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(orderDet)))
            .andExpect(status().isBadRequest());

        // Validate the OrderDet in the database
        List<OrderDet> orderDetList = orderDetRepository.findAll();
        assertThat(orderDetList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllOrderDets() throws Exception {
        // Initialize the database
        orderDetRepository.saveAndFlush(orderDet);

        // Get all the orderDetList
        restOrderDetMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(orderDet.getId().intValue())))
            .andExpect(jsonPath("$.[*].quantity").value(hasItem(DEFAULT_QUANTITY)));
    }

    @Test
    @Transactional
    void getOrderDet() throws Exception {
        // Initialize the database
        orderDetRepository.saveAndFlush(orderDet);

        // Get the orderDet
        restOrderDetMockMvc
            .perform(get(ENTITY_API_URL_ID, orderDet.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(orderDet.getId().intValue()))
            .andExpect(jsonPath("$.quantity").value(DEFAULT_QUANTITY));
    }

    @Test
    @Transactional
    void getNonExistingOrderDet() throws Exception {
        // Get the orderDet
        restOrderDetMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingOrderDet() throws Exception {
        // Initialize the database
        orderDetRepository.saveAndFlush(orderDet);

        int databaseSizeBeforeUpdate = orderDetRepository.findAll().size();

        // Update the orderDet
        OrderDet updatedOrderDet = orderDetRepository.findById(orderDet.getId()).get();
        // Disconnect from session so that the updates on updatedOrderDet are not directly saved in db
        em.detach(updatedOrderDet);
        updatedOrderDet.quantity(UPDATED_QUANTITY);

        restOrderDetMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedOrderDet.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedOrderDet))
            )
            .andExpect(status().isOk());

        // Validate the OrderDet in the database
        List<OrderDet> orderDetList = orderDetRepository.findAll();
        assertThat(orderDetList).hasSize(databaseSizeBeforeUpdate);
        OrderDet testOrderDet = orderDetList.get(orderDetList.size() - 1);
        assertThat(testOrderDet.getQuantity()).isEqualTo(UPDATED_QUANTITY);
    }

    @Test
    @Transactional
    void putNonExistingOrderDet() throws Exception {
        int databaseSizeBeforeUpdate = orderDetRepository.findAll().size();
        orderDet.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOrderDetMockMvc
            .perform(
                put(ENTITY_API_URL_ID, orderDet.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(orderDet))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrderDet in the database
        List<OrderDet> orderDetList = orderDetRepository.findAll();
        assertThat(orderDetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchOrderDet() throws Exception {
        int databaseSizeBeforeUpdate = orderDetRepository.findAll().size();
        orderDet.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrderDetMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(orderDet))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrderDet in the database
        List<OrderDet> orderDetList = orderDetRepository.findAll();
        assertThat(orderDetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamOrderDet() throws Exception {
        int databaseSizeBeforeUpdate = orderDetRepository.findAll().size();
        orderDet.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrderDetMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(orderDet)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the OrderDet in the database
        List<OrderDet> orderDetList = orderDetRepository.findAll();
        assertThat(orderDetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateOrderDetWithPatch() throws Exception {
        // Initialize the database
        orderDetRepository.saveAndFlush(orderDet);

        int databaseSizeBeforeUpdate = orderDetRepository.findAll().size();

        // Update the orderDet using partial update
        OrderDet partialUpdatedOrderDet = new OrderDet();
        partialUpdatedOrderDet.setId(orderDet.getId());

        partialUpdatedOrderDet.quantity(UPDATED_QUANTITY);

        restOrderDetMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOrderDet.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOrderDet))
            )
            .andExpect(status().isOk());

        // Validate the OrderDet in the database
        List<OrderDet> orderDetList = orderDetRepository.findAll();
        assertThat(orderDetList).hasSize(databaseSizeBeforeUpdate);
        OrderDet testOrderDet = orderDetList.get(orderDetList.size() - 1);
        assertThat(testOrderDet.getQuantity()).isEqualTo(UPDATED_QUANTITY);
    }

    @Test
    @Transactional
    void fullUpdateOrderDetWithPatch() throws Exception {
        // Initialize the database
        orderDetRepository.saveAndFlush(orderDet);

        int databaseSizeBeforeUpdate = orderDetRepository.findAll().size();

        // Update the orderDet using partial update
        OrderDet partialUpdatedOrderDet = new OrderDet();
        partialUpdatedOrderDet.setId(orderDet.getId());

        partialUpdatedOrderDet.quantity(UPDATED_QUANTITY);

        restOrderDetMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOrderDet.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOrderDet))
            )
            .andExpect(status().isOk());

        // Validate the OrderDet in the database
        List<OrderDet> orderDetList = orderDetRepository.findAll();
        assertThat(orderDetList).hasSize(databaseSizeBeforeUpdate);
        OrderDet testOrderDet = orderDetList.get(orderDetList.size() - 1);
        assertThat(testOrderDet.getQuantity()).isEqualTo(UPDATED_QUANTITY);
    }

    @Test
    @Transactional
    void patchNonExistingOrderDet() throws Exception {
        int databaseSizeBeforeUpdate = orderDetRepository.findAll().size();
        orderDet.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOrderDetMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, orderDet.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(orderDet))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrderDet in the database
        List<OrderDet> orderDetList = orderDetRepository.findAll();
        assertThat(orderDetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchOrderDet() throws Exception {
        int databaseSizeBeforeUpdate = orderDetRepository.findAll().size();
        orderDet.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrderDetMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(orderDet))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrderDet in the database
        List<OrderDet> orderDetList = orderDetRepository.findAll();
        assertThat(orderDetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamOrderDet() throws Exception {
        int databaseSizeBeforeUpdate = orderDetRepository.findAll().size();
        orderDet.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrderDetMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(orderDet)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the OrderDet in the database
        List<OrderDet> orderDetList = orderDetRepository.findAll();
        assertThat(orderDetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteOrderDet() throws Exception {
        // Initialize the database
        orderDetRepository.saveAndFlush(orderDet);

        int databaseSizeBeforeDelete = orderDetRepository.findAll().size();

        // Delete the orderDet
        restOrderDetMockMvc
            .perform(delete(ENTITY_API_URL_ID, orderDet.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<OrderDet> orderDetList = orderDetRepository.findAll();
        assertThat(orderDetList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
