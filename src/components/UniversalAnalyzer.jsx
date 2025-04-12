import { useState, useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GET_QR_DATA } from "../auth/api";

export default function UniversalAnalyzer() {
  const [scanned, setScanned] = useState("");
  const [info, setInfo] = useState(null);
  const [startScanTrigger, setStartScanTrigger] = useState(false);
  const scannerRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // const analyzeData = (data) => {
  //   if (!data) return;

  //   setScanned(data);

  //   if (data.startsWith("http")) {
  //     setInfo({ type: "url", value: data });
  //   } else if (/serial|part|id|code/i.test(data)) {
  //     setInfo({ type: "serial", value: data });
  //   } else {
  //     setInfo({ type: "text", value: data });
  //   }

  //   if (scannerRef.current?.clear) {
  //     scannerRef.current.clear().catch(console.error);
  //   }
  // };


  const analyzeData = async (data) => {
    if (!data) return;
  
    setScanned(data);
  
    try {
      console.log(data);
      
      const res = await axios.get(GET_QR_DATA(data));
  
      if (res.status === 200 && res.data?.data) {
        setInfo({ type: "qr-data", value: res.data.data }); // ✅ Data found in DB
      } else {
        // ❌ Not in DB – Fallback logic
        fallbackAnalyze(data);
      }
    } catch (err) {
      console.error("Axios error:", err);
      fallbackAnalyze(data); // Fallback on error too
    }
  
    // 🛑 Stop webcam scanner
    if (scannerRef.current?.clear) {
      scannerRef.current.clear().catch(console.error);
    }
  };

  const fallbackAnalyze = (data) => {
    if (data.startsWith("http")) {
      setInfo({ type: "url", value: data });
    } else if (/serial|part|id|code/i.test(data)) {
      setInfo({ type: "serial", value: data });
    } else {
      setInfo({ type: "text", value: data });
    }
  };
  


  const stopScanning = () => {
    if (scannerRef.current?.clear) {
      scannerRef.current.clear().catch(console.error);
      scannerRef.current = null;
    }
  };

  const startScanner = () => {
    const readerElement = document.getElementById("reader");
    if (!readerElement) return;

    const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
    scannerRef.current = scanner;

    scanner.render(
      (decodedText) => analyzeData(decodedText),
      (error) => console.warn(error)
    );
  };

  // Listen to keyboard-based scanner input
  const handleInput = (e) => {
    const value = e.target.value;

    if (value.endsWith("\n") || value.endsWith("\r")) {
      analyzeData(value.trim());
      e.target.value = "";
    }
  };

  // WebSocket for serial/Bluetooth scanner
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080"); // Use your Node bridge if needed

    ws.onmessage = (event) => {
      analyzeData(event.data);
    };

    return () => ws.close();
  }, []);

  useEffect(() => {
    setStartScanTrigger(true);
    if (inputRef.current) inputRef.current.focus();

    return () => stopScanning();
  }, []);

  useEffect(() => {
    if (!info && startScanTrigger && isMobile) {
      const timeout = setTimeout(() => {
        startScanner();
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [info, startScanTrigger, isMobile]);

  const handleRefresh = () => {
    stopScanning();
    setScanned("");
    setInfo(null);
    setStartScanTrigger(true);
  };

  const handleBackToHome = () => {
    stopScanning();
    navigate("/");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🔍 QR Code Analyzer</h2>

      {!info && (
        <>
          {/* Webcam scanner for mobile */}
          {isMobile && <div id="reader" style={{ width: "100%" }}></div>}

          {/* Input for keyboard/Bluetooth scanner */}
          <input
            ref={inputRef}
            onChange={handleInput}
            onPaste={(e) => analyzeData(e.clipboardData.getData("Text"))}
            placeholder="Scan QR here"
            style={{ width: "100%", padding: "12px", marginTop: "16px" }}
          />
        </>
      )}
      {info?.type === "qr-data" && (
  <div>
    <h3>📦 QR Code Details from DB</h3>
    <pre>{JSON.stringify(info.value, null, 2)}</pre>
  </div>
)}

      {info && (
        <div style={{ marginTop: "20px" }}>
          <p>
            <strong>Scanned:</strong> {scanned}
          </p>

          {info.type === "url" && (
            <a href={info.value} target="_blank" rel="noreferrer">
              🔗 Open Link
            </a>
          )}

          {info.type === "serial" && (
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(info.value)}`}
              target="_blank"
              rel="noreferrer"
            >
              🔎 Search Part Info
            </a>
          )}

          {info.type === "text" && (
            <>
              <p>📝 Raw Text: {info.value}</p>
              <button onClick={() => navigator.clipboard.writeText(info.value)}>
                📋 Copy
              </button>
            </>
          )}

          <div style={{ marginTop: "20px" }}>
            <button onClick={handleRefresh}>🔄 Scan Again</button>
            <button
              onClick={handleBackToHome}
              style={{ marginBottom: "20px", padding: "10px 20px" }}
            >
              🏠 Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
