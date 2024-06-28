import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import './StockConfirmationModal.css';
import axios from 'axios';
import { APP_PRODUCT_URL } from 'app/config/constants';
import Swal from 'sweetalert2';
import { useContext } from 'react';
import { AppContext } from './Context';

interface Props {
  items: Array<{
    id: number;
    name: string;
    description: string;
    initialStock: number;
    stockCounter: number;
    image: string;
  }>;
  updateStock: () => void;
}

const StockConfirmationModal: React.FC<Props> = ({ items, updateStock }) => {
  const { showModal, setShowModal, resetStockCounters } = useContext(AppContext);

  const handleProceed = async () => {
    for (const item of items) {
      try {
        const response = await axios.patch(`${APP_PRODUCT_URL}/${item.id}`, { id: item.id, stock: item.initialStock + item.stockCounter });
        if (response.status !== 200) {
          Swal.fire({
            title: 'Error',
            text: 'There was an error updating the stock',
            icon: 'error',
            timer: 2000,
            showConfirmButton: false,
            position: 'bottom-start',
          });
        }
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'There was an error updating the stock',
          icon: 'error',
          timer: 2000,
          showConfirmButton: false,
          position: 'bottom-start',
        });
      }
    }
    resetStockCounters();
    updateStock();
    setShowModal(false);
  };

  const handleProceedWrapper = () => {
    handleProceed();
  };

  const handleGoBack = () => {
    setShowModal(false);
  };

  return (
    <Modal isOpen={showModal} id="confirmationModal" toggle={() => setShowModal(false)}>
      <ModalHeader toggle={() => setShowModal(false)}>Stock</ModalHeader>
      <ModalBody>
        <p>You are about to restock the following items:</p>
        <ul>
          {items.map((item, index) => (
            <li key={index}>
              {item.name} - {item.stockCounter}
            </li>
          ))}
        </ul>
        <p>Would you like to proceed?</p>
      </ModalBody>
      <ModalFooter>
        <Button color="success" onClick={handleProceedWrapper} data-cy="modalConfirmStockButton">
          Yes, proceed
        </Button>{' '}
        <Button color="secondary" onClick={handleGoBack}>
          No, go back
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default StockConfirmationModal;
