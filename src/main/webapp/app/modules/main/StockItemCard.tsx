'use client';

import React, { useEffect, useState } from 'react';
import './StockItemCard.css';
import { useContext } from 'react';
import { AppContext } from './Context';

export default function StockItemCard(props: { name: string }) {
  const { foodItems, setFoodItems } = useContext(AppContext);
  let item = foodItems.find(elem => elem.name === props.name);

  const handlePlusButtonClick = () => {
    const newFoodItems = foodItems.map(elem => {
      if (elem.name === props.name) {
        return { ...elem, stockCounter: elem.stockCounter + 1 };
      }
      return elem;
    });
    setFoodItems(newFoodItems);
    item = newFoodItems.find(elem => elem.name === props.name);
  };

  const handleMinusButtonClick = () => {
    const newFoodItems = foodItems.map(elem => {
      if (elem.name === props.name) {
        return { ...elem, stockCounter: Math.max(0, elem.stockCounter - 1) };
      }
      return elem;
    });
    setFoodItems(newFoodItems);
    item = newFoodItems.find(elem => elem.name === props.name);
  };

  return (
    <div className="card" id="stockItemCard">
      <img src={item.image} className="card-img-top" alt={item.name} />
      <div className="card-body text-center">
        <h5 className="card-title">{item.name}</h5>
        <p className="card-text">{'On stock: ' + item.initialStock}</p>
        <div className="row">
          <div className="col">
            <button
              className="btn btn-success"
              id="plusButton"
              data-cy={item.name.toLowerCase().split(' ').join('') + 'StockPlusButton'}
              onClick={handlePlusButtonClick}
            >
              +
            </button>
          </div>
          <div className="col">
            <p id="counter" data-cy={item.name.toLowerCase().split(' ').join('') + 'StockCount'}>
              {item.stockCounter}
            </p>
          </div>
          <div className="col">
            <button
              className="btn btn-danger"
              id="minusButton"
              data-cy={item.name.toLowerCase().split(' ').join('') + 'StockMinusButton'}
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
