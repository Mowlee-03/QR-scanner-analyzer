import React, { useState } from "react";
import QRCode from "react-qr-code";


const QRGenerator = () => {
  const [formData, setFormData] = useState({
    type: "vehicle",
    id: "",
    name: "",
    vehicleId: "",
    specs: "",
  });
  const [qrValue, setQrValue] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData };
    if (payload.type === "part") {
      payload.specs = JSON.parse(payload.specs || '{}');
    } else {
      delete payload.vehicleId;
      delete payload.specs;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setQrValue(formData.id);
        alert("Saved and QR generated");
      }
    } catch (err) {
      console.error(err);
    }
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
            <input
              name="vehicleId"
              placeholder="Vehicle ID"
              className="w-full border p-2 rounded"
              value={formData.vehicleId}
              onChange={handleChange}
            />
            <textarea
              name="specs"
              placeholder='Specs (JSON format)'
              className="w-full border p-2 rounded"
              value={formData.specs}
              onChange={handleChange}
            />
          </>
        )}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Generate QR
        </button>
      </form>

      {qrValue && (
        <div className="mt-4 text-center">
          <p className="mb-2">Generated QR:</p>
          <QRCode value={qrValue} size={200} />
        </div>
      )}
    </div>
  );
};

export default QRGenerator;