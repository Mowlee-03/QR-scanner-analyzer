import React from 'react'
import { Link, Outlet } from 'react-router-dom'

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-800">Welcome to the QR Code System</h1>
        <p className="text-lg text-gray-600">Choose an option below to get started:</p>
        <div className="mt-6 flex justify-center space-x-4">
          {/* <Link to="analyze" className="bg-orange-400 p-3 rounded-md hover:bg-black hover:text-white transition-all duration-75">
            Analyze
          </Link>
          <Link to="scan" className="bg-orange-400 p-3 rounded-md hover:bg-black hover:text-white transition-all duration-75">
            Internal Scan
          </Link>
          <Link to="generate" className="bg-orange-400 p-3 rounded-md hover:bg-black hover:text-white transition-all duration-75">
            Generate
          </Link> */}
        </div>
      </div>
      
      {/* Outlet renders the component for the current route */}
      <div className="mt-8 w-full px-4">
        <Outlet />
      </div>
    </div>
  )
}

export default Home
