import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from './Layout';

import Candlestick from './Pages/Candlestick'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Candlestick />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
