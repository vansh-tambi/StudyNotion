import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import React from "react";
import ReactDOM from "react-dom/client";

import "./App.css";

import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import {configureStore} from "@reduxjs/toolkit"
import { Toaster } from "react-hot-toast";

import rootReducer from "./reducer";


const store = configureStore({
  reducer:rootReducer,
});


createRoot(document.getElementById('root')).render(
  <Provider store = {store}>
    <BrowserRouter>
        <App />
        <Toaster/>
      </BrowserRouter>
  </Provider>
)