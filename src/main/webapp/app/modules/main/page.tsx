import React from 'react';
import styles from './page.module.css';
import Navbar from './Navbar';
import Tabs from "./Tabs";
import { AppProvider } from './Context';

export default function Main() {
  return (
    <div className={styles.main} id="mainPage">
      <AppProvider>
        <Navbar />
        <Tabs />
      </AppProvider>
    </div>
  );
}
