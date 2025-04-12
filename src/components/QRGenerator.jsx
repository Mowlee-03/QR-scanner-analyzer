import React, { useState, useRef } from "react";
import QRCode from "react-qr-code";
import { toPng } from "html-to-image";
import axios from "axios";
import { GENERATE_QR } from "../auth/api";

const QRGenerator = () => {
  const [formData, setFormData] = useState({
    type: "vehicle",
    id: "",
    name: "",
    vehicleId: "",
    specs: "",
  });
  const [qrValue, setQrValue] = useState("");
  const qrRef = useRef(null);
       console.log(formData);
                                              
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData };
    if (payload.type === "part") {
      payload.specs = payload.specs
    } else {
      delete payload.vehicleId;
      delete payload.specs;
    }

    try {
      const res = await axios.post(GENERATE_QR,formData)
console.log(res);

      if (res.statusText==='OK') {
        setQrValue(formData.id);
        alert("Saved and QR generated");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = () => {
    if (!qrRef.current) return;

    toPng(qrRef.current, { cacheBust: true, pixelRatio: 2 })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `${formData.id || "qr-code"}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error("Failed to download PNG:", err);
      });
  };

  const handleClear = () => {
    setFormData({
      type: "vehicle",
      id: "",
      name: "",
      vehicleId: "",
      specs: "",
    });
    setQrValue("");
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">QR Code Generator</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          name="type"
          className="w-full border p-2 rounded"
          value={formData.type}
          onChange={handleChange}
        >
          <option value="vehicle">Vehicle</option>
          <option value="part">Part</option>
        </select>
        <input
          name="id"
          placeholder="ID"
          className="w-full border p-2 rounded"
          value={formData.id}
          onChange={handleChange}
        />
        <input
          name="name"
          placeholder="Name"
          className="w-full border p-2 rounded"
          value={formData.name}
          onChange={handleChange}
        />
        {formData.type === "part" && (
          <>
            {/* <input
              name="vehicleId"
              placeholder="Vehicle ID"
              className="w-full border p-2 rounded"
              value={formData.vehicleId}
              onChange={handleChange}
            /> */}
            <textarea
              name="specs"
              placeholder='Specs'
              className="w-full border p-2 rounded"
              value={formData.specs}
              onChange={handleChange}
            />
          </>
        )}
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Generate QR
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Clear
            </button>
          </div>
      </form>

      {qrValue && (
        <div className="mt-6 text-center">
          <p className="mb-2">Generated QR:</p>
          <div ref={qrRef} className="inline-block bg-white p-2 rounded">
            <QRCode value={qrValue} size={200} />
          </div>
          <button
            onClick={handleDownload}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
          >
            Download as PNG
          </button>
        </div>
      )}
    </div>
  );
};

export default QRGenerator;
