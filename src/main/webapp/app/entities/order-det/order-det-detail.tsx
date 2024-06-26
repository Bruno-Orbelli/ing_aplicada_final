import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import {} from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './order-det.reducer';

export const OrderDetDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const orderDetEntity = useAppSelector(state => state.orderDet.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="orderDetDetailsHeading">Order Det</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">ID</span>
          </dt>
          <dd>{orderDetEntity.id}</dd>
          <dt>
            <span id="quantity">Quantity</span>
          </dt>
          <dd>{orderDetEntity.quantity}</dd>
          <dt>Product</dt>
          <dd>{orderDetEntity.product ? orderDetEntity.product.id : ''}</dd>
          <dt>Order</dt>
          <dd>{orderDetEntity.order ? orderDetEntity.order.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/order-det" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/order-det/${orderDetEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

export default OrderDetDetail;
