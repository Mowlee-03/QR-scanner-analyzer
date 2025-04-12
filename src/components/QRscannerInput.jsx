import { useEffect, useRef, useState } from "react";

const QRScannerInput = () => {
  const [scannedValue, setScannedValue] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    const ws = new WebSocket("ws://localhost:8080"); // Replace with actual backend IP

    ws.onmessage = (event) => {
      const code = event.data;
      console.log("Received from Serial/Bluetooth:", code);
      setScannedValue(code);
    };

    return () => ws.close();
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    if (value.endsWith("\n") || value.endsWith("\r")) {
      console.log("Keyboard Emulated Scanner:", value.trim());
      setScannedValue("");
    } else {
      setScannedValue(value);
    }
  };

  return (
    <input
      ref={inputRef}
      value={scannedValue}
      onChange={handleChange}
      placeholder="Scan QR code here"
      className="p-2 border rounded w-full"
    />
  );
};

export default QRScannerInput;
