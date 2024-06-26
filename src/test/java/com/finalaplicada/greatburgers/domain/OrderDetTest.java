package com.finalaplicada.greatburgers.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.finalaplicada.greatburgers.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class OrderDetTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(OrderDet.class);
        OrderDet orderDet1 = new OrderDet();
        orderDet1.setId(1L);
        OrderDet orderDet2 = new OrderDet();
        orderDet2.setId(orderDet1.getId());
        assertThat(orderDet1).isEqualTo(orderDet2);
        orderDet2.setId(2L);
        assertThat(orderDet1).isNotEqualTo(orderDet2);
        orderDet1.setId(null);
        assertThat(orderDet1).isNotEqualTo(orderDet2);
    }
}
