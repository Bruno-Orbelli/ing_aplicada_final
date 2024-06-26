import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import OrderDet from './order-det';
import OrderDetDetail from './order-det-detail';
import OrderDetUpdate from './order-det-update';
import OrderDetDeleteDialog from './order-det-delete-dialog';

const OrderDetRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<OrderDet />} />
    <Route path="new" element={<OrderDetUpdate />} />
    <Route path=":id">
      <Route index element={<OrderDetDetail />} />
      <Route path="edit" element={<OrderDetUpdate />} />
      <Route path="delete" element={<OrderDetDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default OrderDetRoutes;
