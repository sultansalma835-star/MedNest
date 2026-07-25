
 import "./Prescription.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudUploadAlt,
  faCheckCircle,
  faShieldAlt,
  faBrain,
} from "@fortawesome/free-solid-svg-icons";

import SideBar from "./Components/SideBar";
import Footer from "./Components/Footer";

import { useState, useRef } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";

export default function Prescription() {
  const [file, setFile] = useState(null);
  const [available, setAvailable] = useState([]);
  const [missing, setMissing] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);
  const cookie = new Cookies();
  const navigate = useNavigate();

  const handleFile = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setSuccess(false);
    setError("");
    setShowResult(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  async function handleUpload(e) {
    e.preventDefault();

    const token = cookie.get("token");

    if (!file) return setError("Choose a file first.");
    if (!token) return setError("You are not logged in.");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const res = await axios.post(
        "http://127.0.0.1:8000/api/prescriptions/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAvailable(res.data.available_medicines || []);
      setMissing(res.data.missing_medicines || []);
      setSuccess(true);
      setShowResult(true);
      setError("");
    } catch (err) {
      console.log(err);
      setError("Upload failed");
    } finally {
      setLoading(false);
    }
  }


  const addToCart = async () => {
    const token = cookie.get("token");

    if (!available.length) {
      setError("No medicines to add");
      return;
    }

    try {
      setLoading(true);

      
      await Promise.all(
        available.map((med) =>
          axios.post(
            "http://127.0.0.1:8000/api/cart/items",
            {
              medicine_id: med.id,   
              quantity: 1,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
              },
            }
          )
        )
      );

     
      navigate("/cart");

    } catch (err) {
      console.log(err);
      setError("Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  return (
<>
      <SideBar />
    <div className="prescription-containe">
      <SideBar />

      <div className="upload-section">
        <h2>Upload Prescription</h2>

        <div className="upload-box">
          <FontAwesomeIcon icon={faCloudUploadAlt} size="3x" />
          <p>
            Drag & Drop your Prescription <br />
            or{" "}
            <span onClick={handleUploadClick} style={{ color: "blue", cursor: "pointer" }}>
              click to Upload
            </span>
          </p>

          <input
            type="file"
            hidden
            ref={fileInputRef}
            onChange={handleFile}
            accept="image/png,image/jpeg,application/pdf"
          />
        </div>

        {file && <p>Selected: {file.name}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <button className="upload-btn" onClick={handleUpload}>
          {loading ? "Uploading..." : "Upload Prescription"}
        </button>

        {success && (
          <p style={{ color: "green" }}>
            <FontAwesomeIcon icon={faCheckCircle} /> Upload successful
          </p>
        )}
      </div>

      {showResult && (
        <div className="result-section">
          <div className="result-card">
            {available.map((m, i) => (
              <p key={i}> {m.name}</p>
            ))}

            {missing.map((m, i) => (
              <p key={i} style={{ color: "red" }}>
                 {m}
              </p>
            ))}
          </div>

        
          <button className="order-btn" onClick={addToCart}>
            Add to Cart
          </button>
        </div>
      )}

      <div className="features">
        <div className="feature">
          <FontAwesomeIcon icon={faShieldAlt} />
          Secure Upload
        </div>

        <div className="feature">
          <FontAwesomeIcon icon={faBrain} />
          AI Analysis
        </div>

        <div className="feature">
          <FontAwesomeIcon icon={faCheckCircle} />
          Safe Medication
        </div>
      </div>

      <Footer />
    </div>
    </>
  );
}

// import "./Prescription.css";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faCloudUploadAlt,
//   faCheckCircle,
//   faShieldAlt,
//   faBrain,
// } from "@fortawesome/free-solid-svg-icons";

// import SideBar from "./Components/SideBar";
// import Footer from "./Components/Footer";

// import { useState, useRef } from "react";
// import axios from "axios";
// import Cookies from "universal-cookie";
// import { useNavigate } from "react-router-dom";

// export default function Prescription() {
//   const [file, setFile] = useState(null);
//   const [available, setAvailable] = useState([]);
//   const [missing, setMissing] = useState([]);
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState("");
//   const [showResult, setShowResult] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const fileInputRef = useRef(null);
//   const cookie = new Cookies();
//   const navigate = useNavigate();

//   const handleFile = (e) => {
//     const selectedFile = e.target.files[0];
//     if (!selectedFile) return;

//     setFile(selectedFile);
//     setSuccess(false);
//     setError("");
//     setShowResult(false);
//   };

//   const handleUploadClick = () => {
//     fileInputRef.current.click();
//   };

//   async function handleUpload(e) {
//     e.preventDefault();

//     const token = cookie.get("token");

//     if (!file) return setError("Choose a file first.");
//     if (!token) return setError("You are not logged in.");

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       setLoading(true);

//       const res = await axios.post(
//         "http://127.0.0.1:8000/api/prescriptions/upload",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setAvailable(res.data.available_medicines || []);
//       setMissing(res.data.missing_medicines || []);
//       setSuccess(true);
//       setShowResult(true);
//       setError("");
//     } catch (err) {
//       console.log(err);
//       setError("Upload failed");
//     } finally {
//       setLoading(false);
//     }
//   }

//   const addToCart = async () => {
//     const token = cookie.get("token");

//     if (!available.length) {
//       setError("No medicines to add");
//       return;
//     }

//     try {
//       setLoading(true);

//       await Promise.all(
//         available.map((med) =>
//           axios.post(
//             "http://127.0.0.1:8000/api/cart/items",
//             {
//               medicine_id: med.id,
//               quantity: 1,
//             },
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//                 Accept: "application/json",
//               },
//             }
//           )
//         )
//       );

//       navigate("/cart");
//     } catch (err) {
//       console.log(err);
//       setError("Failed to add to cart");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="app-layout" >
//       <SideBar />

//       <div className="prescription-container">
//         <div className="upload-section">
//           <h2>Upload Prescription</h2>

//           <div className="upload-box">
//             <FontAwesomeIcon icon={faCloudUploadAlt} size="3x" />
//             <p>
//               Drag & Drop your Prescription <br />
//               or{" "}
//               <span onClick={handleUploadClick}>
//                 click to Upload
//               </span>
//             </p>

//             <input
//               type="file"
//               hidden
//               ref={fileInputRef}
//               onChange={handleFile}
//               accept="image/png,image/jpeg,application/pdf"
//             />
//           </div>

//           {file && <p>Selected: {file.name}</p>}
//           {error && <p style={{ color: "red" }}>{error}</p>}

//           <button className="upload-btn" onClick={handleUpload}>
//             {loading ? "Uploading..." : "Upload Prescription"}
//           </button>

//           {success && (
//             <p style={{ color: "green" }}>
//               <FontAwesomeIcon icon={faCheckCircle} /> Upload successful
//             </p>
//           )}
//         </div>

//         {showResult && (
//           <div className="result-section">
//             <div className="result-card">
//               {available.map((m, i) => (
//                 <p key={i}>{m.name}</p>
//               ))}

//               {missing.map((m, i) => (
//                 <p key={i} style={{ color: "red" }}>
//                   {m}
//                 </p>
//               ))}
//             </div>

//             <button className="order-btn" onClick={addToCart}>
//               Add to Cart
//             </button>
//           </div>
//         )}

//         <div className="features">
//           <div className="feature">
//             <FontAwesomeIcon icon={faShieldAlt} />
//             Secure Upload
//           </div>

//           <div className="feature">
//             <FontAwesomeIcon icon={faBrain} />
//             AI Analysis
//           </div>

//           <div className="feature">
//             <FontAwesomeIcon icon={faCheckCircle} />
//             Safe Medication
//           </div>
//         </div>

//         <Footer />
//       </div>
//     </div>
//   );
// }