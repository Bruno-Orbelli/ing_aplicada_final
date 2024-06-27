import { APP_ORDER_URL } from 'app/config/constants';
import axios from 'axios';
import React, { useContext } from 'react';
import swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { AppContext } from './Context';

const OrderConfirmationModal = ({ items, getOrders }) => {
  const { showModal, setShowModal, resetSelectedCounters } = useContext(AppContext);

  const calculateSubtotal = item => {
    return item.price * item.selectedCounter;
  };

  const calculateTotalPrice = () => {
    return items.reduce((acc, item) => acc + item.price * item.selectedCounter, 0);
  };

  const handleProceed = async () => {
    const orderDetails = items.map(item => ({
      quantity: item.selectedCounter,
      product: { id: item.id },
    }));

    const token = sessionStorage.getItem('jhi-authenticationToken');
    const decodedToken = jwtDecode(token); // Import the jwt_decode module

    const clientName = decodedToken.sub;
    const order = {
      clientName: clientName,
      orderDetails: orderDetails,
    };

    try {
      const response = await axios.post(`${APP_ORDER_URL}`, order);
      if (response.status === 201) {
        swal.fire({
          title: 'Success',
          text: 'Order placed successfully',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          position: 'bottom-start',
        });
        resetSelectedCounters();
        getOrders();
      } else {
        swal.fire({
          title: 'Error',
          text: 'There was an error placing the order',
          icon: 'error',
          timer: 2000,
          showConfirmButton: false,
          position: 'bottom-start',
        });
      }
    } catch (error) {
      swal.fire({
        title: 'Error',
        text: 'There was an error placing the order',
        icon: 'error',
        timer: 2000,
        showConfirmButton: false,
        position: 'bottom-start',
      });
    } finally {
      setShowModal(false);
    }
  };

  return (
    <Modal isOpen={showModal} toggle={() => setShowModal(false)}>
      <ModalHeader toggle={() => setShowModal(false)}>Order Confirmation</ModalHeader>
      <ModalBody>
        <p>You are about to place an order with the following items:</p>
        <ul>
          {items.map((item, index) => (
            <li key={index}>
              {item.name} x {item.selectedCounter} - ${calculateSubtotal(item)}
            </li>
          ))}
        </ul>
        <p>TOTAL: ${calculateTotalPrice()}</p>
        <p>Would you like to proceed?</p>
      </ModalBody>
      <ModalFooter>
        <Button color="success" onClick={handleProceed} data-cy="modalConfirmOrderButton">
          Yes, proceed
        </Button>{' '}
        <Button color="secondary" onClick={() => setShowModal(false)}>
          No, go back
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default OrderConfirmationModal;
