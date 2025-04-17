import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/Login'
import Home from '../pages/Home'
import QRGenerator from '../components/QRGenerator'
import QRScanner from '../components/QRScanner'
import UniversalAnalyzer from '../components/UniversalAnalyzer'
import QRScannerInput from '../components/QRscannerInput'

const AppRouting = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/" element={<Navigate to="/home/analyze" replace />} />
      
      <Route path="/home" element={<Home />}>
        <Route path="generate" element={<QRGenerator />} />
        <Route path="scan" element={<QRScanner />} />
        <Route path="analyze" element={<UniversalAnalyzer />} />
        <Route path="device_scanner" element={<QRScannerInput />} />
      </Route>

      {/* Fallback route for any unknown paths */}
      <Route path="*" element={<Navigate to="/home/analyze" replace />} />
    </Routes>
  )
}

export default AppRouting
