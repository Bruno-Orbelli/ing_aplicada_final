import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IOrderDet } from 'app/shared/model/order-det.model';
import { getEntities } from './order-det.reducer';

export const OrderDet = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();
  const navigate = useNavigate();

  const orderDetList = useAppSelector(state => state.orderDet.entities);
  const loading = useAppSelector(state => state.orderDet.loading);

  useEffect(() => {
    dispatch(getEntities({}));
  }, []);

  const handleSyncList = () => {
    dispatch(getEntities({}));
  };

  return (
    <div>
      <h2 id="order-det-heading" data-cy="OrderDetHeading">
        Order Dets
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} /> Refresh list
          </Button>
          <Link to="/order-det/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp; Create a new Order Det
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {orderDetList && orderDetList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Quantity</th>
                <th>Product</th>
                <th>Order</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {orderDetList.map((orderDet, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/order-det/${orderDet.id}`} color="link" size="sm">
                      {orderDet.id}
                    </Button>
                  </td>
                  <td>{orderDet.quantity}</td>
                  <td>{orderDet.product ? <Link to={`/product/${orderDet.product.id}`}>{orderDet.product.id}</Link> : ''}</td>
                  <td>{orderDet.order ? <Link to={`/order/${orderDet.order.id}`}>{orderDet.order.id}</Link> : ''}</td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/order-det/${orderDet.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">View</span>
                      </Button>
                      <Button tag={Link} to={`/order-det/${orderDet.id}/edit`} color="primary" size="sm" data-cy="entityEditButton">
                        <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
                      </Button>
                      <Button tag={Link} to={`/order-det/${orderDet.id}/delete`} color="danger" size="sm" data-cy="entityDeleteButton">
                        <FontAwesomeIcon icon="trash" /> <span className="d-none d-md-inline">Delete</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && <div className="alert alert-warning">No Order Dets found</div>
        )}
      </div>
    </div>
  );
};

export default OrderDet;
