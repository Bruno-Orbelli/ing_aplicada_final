import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from './Context';
import './OrderItemCard.css';

export default function OrderItemCard(props: { name: string }) {
  const { foodItems, setFoodItems } = useContext(AppContext);
  let item = foodItems.find(elem => elem.name === props.name);

  const handlePlusButtonClick = () => {
    const newFoodItems = foodItems.map(elem => {
      if (elem.name === props.name) {
        return { ...elem, selectedCounter: elem.selectedCounter + 1 };
      }
      return elem;
    });
    setFoodItems(newFoodItems);
    item = newFoodItems.find(elem => elem.name === props.name);
  };

  const handleMinusButtonClick = () => {
    const newFoodItems = foodItems.map(elem => {
      if (elem.name === props.name) {
        return { ...elem, selectedCounter: Math.max(0, elem.selectedCounter - 1) };
      }
      return elem;
    });
    setFoodItems(newFoodItems);
    item = newFoodItems.find(elem => elem.name === props.name);
  };

  return (
    <div className="card" id="orderItemCard">
      <img src={item.image} className="card-img-top" alt={props.name} />
      <div className="card-body text-center">
        <h5 className="card-title">{item.name}</h5>
        <p className="card-text">{item.description}</p>
        <p className="card-text" id="price">
          {'$' + item.price}
        </p>
        <div className="row">
          <div className="col">
            <button
              className="btn btn-success"
              id="plusButton"
              data-cy={item.name.toLowerCase().split(' ').join('') + 'ProductPlusButton'}
              onClick={handlePlusButtonClick}
            >
              +
            </button>
          </div>
          <div className="col">
            <p id="counter" data-cy={item.name.toLowerCase().split(' ').join('') + 'SelectedCount'}>
              {item.selectedCounter}
            </p>
          </div>
          <div className="col">
            <button
              className="btn btn-danger"
              id="minusButton"
              data-cy={item.name.toLowerCase().split(' ').join('') + 'ProductMinusButton'}
              onClick={handleMinusButtonClick}
            >
              -
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
