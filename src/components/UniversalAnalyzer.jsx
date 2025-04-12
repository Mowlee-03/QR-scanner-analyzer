import { useState, useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useNavigate } from "react-router-dom";

export default function UniversalAnalyzer() {
  const [scanned, setScanned] = useState("");
  const [info, setInfo] = useState(null);
  const [startScanTrigger, setStartScanTrigger] = useState(false); // trigger scanner
  const scannerRef = useRef(null);
  const navigate = useNavigate();

  const analyzeData = (data) => {
    if (!data) return;

    setScanned(data);

    if (data.startsWith("http")) {
      setInfo({ type: "url", value: data });
    } else if (/serial|part|id|code/i.test(data)) {
      setInfo({ type: "serial", value: data });
    } else {
      setInfo({ type: "text", value: data });
    }

    if (scannerRef.current) {
      scannerRef.current.clear().catch(console.error);
    }
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(console.error);
      scannerRef.current = null;
    }
  };

  const startScanner = () => {
    const readerElement = document.getElementById("reader");
    if (!readerElement) {
      console.error("HTML Element with id=reader not found");
      return;
    }

    const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
    scannerRef.current = scanner;

    scanner.render(
      (decodedText) => {
        analyzeData(decodedText);
      },
      (error) => {
        console.warn(error);
      }
    );
  };

  useEffect(() => {
    // Initial scan on mount
    setStartScanTrigger(true);

    return () => {
      stopScanning();
    };
  }, []);

  useEffect(() => {
    if (!info && startScanTrigger) {
      // Wait for DOM to show #reader before starting scan
      const timeout = setTimeout(() => {
        startScanner();
      }, 300); // Give time for #reader to re-render

      return () => clearTimeout(timeout);
    }
  }, [info, startScanTrigger]);

  const handleRefresh = () => {
    stopScanning();
    setScanned("");
    setInfo(null);
    setStartScanTrigger(true); // retrigger scanning
  };

  const handleBackToHome = () => {
    stopScanning();
    navigate("/");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🔍 QR Code Analyzer</h2>

      {!info && <div id="reader" style={{ width: "100%" }}></div>}

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
