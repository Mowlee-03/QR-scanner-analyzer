import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/Login'
import Home from '../pages/Home'
import QRGenerator from '../components/QRGenerator'
import QRScanner from '../components/QRScanner'
import UniversalAnalyzer from '../components/UniversalAnalyzer'

const AppRouting = () => {
  return (
    <Routes>
        <Route path="/login" element={<Login />} />
     
          <Route index element={<Navigate to="/home/analyze" replace />} />
          <Route path='/home' element={<Home/>}>
            <Route path="generate" element={<QRGenerator />} />
            <Route path="scan" element={<QRScanner />} />
            <Route path="analyze" element={<UniversalAnalyzer />} />
          </Route>
          

    </Routes>
  )
}

export default AppRouting
