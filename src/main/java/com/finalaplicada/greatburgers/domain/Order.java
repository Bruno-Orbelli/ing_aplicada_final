package com.finalaplicada.greatburgers.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Order.
 */
@Entity
@Table(name = "jhi_order")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Order implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "client_name")
    private String clientName;

    @Column(name = "ordered_at")
    private Instant orderedAt;

    @Column(name = "is_delivered")
    private Boolean isDelivered;

    @Column(name = "delivered_at")
    private Instant deliveredAt;

    @OneToMany(mappedBy = "order", fetch = FetchType.EAGER)
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "order" }, allowSetters = true)
    private Set<OrderDet> orderDetails = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Order id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getClientName() {
        return this.clientName;
    }

    public Order clientName(String clientName) {
        this.setClientName(clientName);
        return this;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public Instant getOrderedAt() {
        return this.orderedAt;
    }

    public Order orderedAt(Instant orderedAt) {
        this.setOrderedAt(orderedAt);
        return this;
    }

    public void setOrderedAt(Instant orderedAt) {
        this.orderedAt = orderedAt;
    }

    public Boolean getIsDelivered() {
        return this.isDelivered;
    }

    public Order isDelivered(Boolean isDelivered) {
        this.setIsDelivered(isDelivered);
        return this;
    }

    public void setIsDelivered(Boolean isDelivered) {
        this.isDelivered = isDelivered;
    }

    public Instant getDeliveredAt() {
        return this.deliveredAt;
    }

    public Order deliveredAt(Instant deliveredAt) {
        this.setDeliveredAt(deliveredAt);
        return this;
    }

    public void setDeliveredAt(Instant deliveredAt) {
        this.deliveredAt = deliveredAt;
    }

    public Set<OrderDet> getOrderDetails() {
        return this.orderDetails;
    }

    public void setOrderDetails(Set<OrderDet> orderDets) {
        if (this.orderDetails != null) {
            this.orderDetails.forEach(i -> i.setOrder(null));
        }
        if (orderDets != null) {
            orderDets.forEach(i -> i.setOrder(this));
        }
        this.orderDetails = orderDets;
    }

    public Order orderDetails(Set<OrderDet> orderDets) {
        this.setOrderDetails(orderDets);
        return this;
    }

    public Order addOrderDetails(OrderDet orderDet) {
        this.orderDetails.add(orderDet);
        orderDet.setOrder(this);
        return this;
    }

    public Order removeOrderDetails(OrderDet orderDet) {
        this.orderDetails.remove(orderDet);
        orderDet.setOrder(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Order)) {
            return false;
        }
        return id != null && id.equals(((Order) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Order{" +
            "id=" + getId() +
            ", clientName='" + getClientName() + "'" +
            ", orderedAt='" + getOrderedAt() + "'" +
            ", isDelivered='" + getIsDelivered() + "'" +
            ", deliveredAt='" + getDeliveredAt() + "'" +
            "}";
    }
}
