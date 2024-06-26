import { APP_ORDER_URL, APP_PRODUCT_URL } from 'app/config/constants';
import axios from 'axios';
import React, { createContext, useState } from 'react';

const AppContext = createContext(null);

const AppProvider = ({ children }) => {
  const [foodItems, setFoodItems] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState('new-order');
  
  const getFoodItems = async () => {
    try {
      const imageMapping = {
        'Burger': '../../content/images/burger.webp',
        'French Fries': '../../content/images/french-fries.png',
        'Salad': '../../content/images/salad.png',
        'Soda': '../../content/images/soda.webp',
        'Ice Cream': '../../content/images/ice-cream.webp',
      };   
      axios.get(APP_PRODUCT_URL).then(response => {
        const foodItems = response.data.map((item) => ({
          id: item.id,
          name: item.productName,
          description: item.description,
          price: item.price,
          image: imageMapping[item.productName],
          selectedCounter: 0,
          initialStock: item.stock,
          stockCounter: 0,
        }));
        setFoodItems(foodItems);
        console.log(foodItems);
      });
    } catch (error) {
      console.error('Error fetching food items:', error);
    }
  }
  
  const getOrderItems = async () => {
    try {
      axios.get(APP_ORDER_URL).then(response => {
        const newOrderItems = response.data.map((item) => ({
          id: item.id,
          clientName: item.clientName,
          orderedAt: item.orderedAt,
          isDelivered: item.isDelivered,
          deliveredAt: item.deliveredAt,
          orderDetails: item.orderDetails,
        }));
        const filteredItems = newOrderItems.filter(item => !item.isDelivered);
        setOrderItems(filteredItems);
      });
    } catch (error) {
      console.error('Error fetching order items:', error);
    }
  }
  
  const updateStock = () => {
    setFoodItems(prevItems =>
      prevItems.map(item => ({ ...item, initialStock: item.initialStock + item.stockCounter }))
    );
  }
  
  const resetSelectedCounters = () => {
    setFoodItems(prevItems =>
      prevItems.map(item => ({ ...item, selectedCounter: 0 }))
    );
  };

  const resetStockCounters = () => {
    setFoodItems(prevItems =>
      prevItems.map(item => ({ ...item, stockCounter: 0 }))
    );
  };

  const removeOrder = (orderId) => {
    setOrderItems(prevOrders => prevOrders.filter(order => order.id !== orderId));
  };

  return (
    <AppContext.Provider
      value={{
        foodItems,
        setFoodItems,
        orderItems,
        setOrderItems,// OrderInformationModal.tsx
        showModal,
        setShowModal,
        activeTab,
        setActiveTab,
        selectedOrder,
        setSelectedOrder,
        resetSelectedCounters,
        resetStockCounters,
        removeOrder,
        updateStock,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
