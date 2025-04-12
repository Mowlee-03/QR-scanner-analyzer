import React, { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const QRScanner = () => {
  const [result, setResult] = useState(null);

  const handleScan = (data) => {
    if (data) {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/scan/${data}`)
        .then((res) => res.json())
        .then((data) => setResult(data))
        .catch(console.error);
    }
  };

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
    scanner.render(
      (decodedText) => {
        handleScan(decodedText);
        scanner.clear();
      },
      (error) => {
        console.warn(error);
      }
    );
    return () => scanner.clear().catch(console.error);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">QR Scanner</h2>
      <div id="reader"></div>
      {result && (
        <pre className="mt-4 bg-gray-100 p-2 rounded">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default QRScanner;