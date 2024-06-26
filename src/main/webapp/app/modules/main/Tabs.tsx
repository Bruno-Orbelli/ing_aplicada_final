import React, { useEffect, useContext } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { Button } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Tabs.css';
import OrderConfirmationModal from './OrderConfirmationModal';
import OrderItemCard from './OrderItemCard';
import StockConfirmationModal from './StockConfirmationModal';
import StockItemCard from './StockItemCard';
import ActiveOrder from './ActiveOrder';
import OrderInformationModal from './OrderInformationModal';
import { APP_ORDER_URL, APP_PRODUCT_URL } from 'app/config/constants';
import axios from 'axios';
import { AppContext } from './Context';

const MyTabs = () => {
  const {
    foodItems, setFoodItems,
    orderItems, setOrderItems,
    showModal, setShowModal,
    selectedOrder, setSelectedOrder,
    resetSelectedCounters, resetStockCounters,
    removeOrder,
    activeTab, setActiveTab,
    updateStock,
  } = useContext(AppContext);

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
  
  useEffect(() => {    
    getOrderItems();
    getFoodItems();
  }, [setFoodItems, setOrderItems]);

  const handleModal = () => {
    setShowModal(true);
  };

  const changeTab = (tab) => {
    setActiveTab(tab);
    getFoodItems();
    getOrderItems();
  }

  return (
    <>
      <div className="d-flex-inline flex-grow-2 w-100 h-100" id="mainPage">
      <Tabs defaultActiveKey="new-order" id="navTabs" className="nav nav-underline justify-content-center" onSelect={(tab) => changeTab(tab)}>
          <Tab eventKey="new-order" title="Make an order">
            <div id="underline-new-order" className="tab-pane fade show" role="tabpanel">
              <div className="row justify-content-center">
                {foodItems.map(item => (
                  <div className="col-md-3 my-2 mx-5" key={item.name}>
                    <OrderItemCard
                      name={item.name}
                    />
                  </div>
                ))}
              </div>
              <div className="d-flex justify-content-center mt-3">
                <Button color="success" id="confirmationButton" onClick={handleModal}>Confirm order</Button>
              </div>
            </div>
          </Tab>
          <Tab eventKey="current-orders" title="Active orders">
            <div id="underline-current-orders" className="tab-pane fade show active" role="tabpanel">
              <div className="row justify-content-center">
                {orderItems.map(item => (
                  <div className="col-md-3 my-2 mx-5" key={item.id}>
                    <ActiveOrder
                      order={item}
                    />
                  </div>
                ))}
              </div>
            </div>
          </Tab>
          <Tab eventKey="stock" title="Add stock">
            <div id="underline-stock" className="tab-pane fade show active" role="tabpanel">
              <div className="row justify-content-center">
                {foodItems.map(item => (
                  <div className="col-md-3 my-2 mx-5" key={item.name}>
                    <StockItemCard
                      name={item.name}
                    />
                  </div>
                ))}
              </div>
              <div className="d-flex justify-content-center mt-3">
                <Button color="success" id="confirmationButton" onClick={handleModal}>Confirm restocking</Button>
              </div>
            </div>
          </Tab>
        </Tabs>
      </div>
      {activeTab === "new-order" && (<OrderConfirmationModal 
        items={foodItems.filter(item => item.selectedCounter > 0)}
        getOrders={getOrderItems}
      />)}
      {activeTab === "current-orders" && selectedOrder && (
        <OrderInformationModal/>
      )}
      {activeTab === "stock" && (<StockConfirmationModal 
        items={foodItems.filter(item => item.stockCounter > 0)}
        updateStock={updateStock}
      />)}
    </>
  );
};

export default MyTabs;
