// ActiveOrder.tsx
import React, { useContext } from 'react';
import './ActiveOrder.css';
import { AppContext } from './Context';

interface Order {
  id: number;
  clientName: string;
  orderedAt: Date;
  isDelivered: boolean;
  deliveredAt: Date | null;
  orderDetails: {
    product: string;
    quantity: number;
  }[];
}

interface ActiveOrderProps {
  order: Order;
}

const ActiveOrder: React.FC<ActiveOrderProps> = ({ order }) => {
  const { setSelectedOrder, setShowModal } = useContext(AppContext);

  const handleClick = () => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  return (
    <div className="active-order" onClick={handleClick}>
      <img
        key={order.id}
        src="../../content/images/order.webp"
        alt={`Order ${order.id}`}
        className="order-image"
      />
    </div>
  );
};

export default ActiveOrder;
