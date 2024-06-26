import { APP_ORDER_URL } from 'app/config/constants';
import axios from 'axios';
import React, { useContext } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import Swal from 'sweetalert2';
import { AppContext } from './Context';

const OrderInformationModal: React.FC = () => {
  const { selectedOrder, setSelectedOrder, showModal, setShowModal, removeOrder } = useContext(AppContext);

  const handleMarkAsDelivered = async () => {
    const response = await axios.patch(`${APP_ORDER_URL}/${selectedOrder.id}`, { id: selectedOrder.id, isDelivered: true, deliveredAt: new Date() });
    if (response.status !== 200) {
      Swal.fire('Error', 'There was an error updating the order', 'error');
      setShowModal(false);
      return;
    }
    Swal.fire('Success', 'Order updated successfully', 'success');
    removeOrder(selectedOrder.id);
    setSelectedOrder(null);
    setShowModal(false);
  };

  if (!selectedOrder) return null;

  return (
    <Modal isOpen={showModal} toggle={() => setShowModal(false)}>
      <ModalHeader toggle={() => setShowModal(false)}>Order Information</ModalHeader>
      <ModalBody>
        <p>Order ID: {selectedOrder.id}</p>
        <p>Client Name: {selectedOrder.clientName}</p>
        <p>Ordered At: {new Date(selectedOrder.orderedAt).toLocaleString()}</p>
        {selectedOrder.isDelivered ? (
          <p>Delivered At: {new Date(selectedOrder.deliveredAt!).toLocaleString()}</p>
        ) : (
          <p>Status: Not delivered yet</p>
        )}
        <p>Order Details:</p>
        <ul>
          {selectedOrder.orderDetails.map((detail, index) => (
            <li key={index}>
              {detail.quantity} x {detail.product.productName} - ${detail.quantity * detail.product.price}
            </li>
          ))}
        </ul>
      </ModalBody>
      <ModalFooter>
        <Button color="success" onClick={handleMarkAsDelivered}>
          Mark as delivered
        </Button>{' '}
      </ModalFooter>
    </Modal>
  );
};

export default OrderInformationModal;
