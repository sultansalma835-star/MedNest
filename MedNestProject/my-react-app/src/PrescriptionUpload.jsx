import { useState, useContext } from "react";
import axios from "axios";
// import "./prescriptionUpload.css";
import { User } from "./context/UserContext";

export default function PrescriptionUpload() {
  const { auth } = useContext(User);

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const upload = async () => {
    if (!file) return setError("Please select a file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setError("");

      const res = await axios.post(
        "http://127.0.0.1:8000/api/prescriptions/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResult(res.data);
    } catch (err) {
      setError("Upload failed",err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page">

      <div className="upload-card">
        <h2>Upload Prescription</h2>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button onClick={upload} disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>

        {error && <p className="error">{error}</p>}

        {result && (
          <div className="result-box">
            <h3>Available Medicines</h3>
            {result.available_medicines?.map((m) => (
              <p key={m.id}>{m.name}</p>
            ))}

            <h3 className="missing-title">Missing Medicines</h3>
            {result.missing_medicines?.map((m, i) => (
              <p key={i} className="missing">{m}</p>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}