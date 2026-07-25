import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PrescriptionPage.css";
import SideBar from "./Components/SideBar";
import Cookies from "universal-cookie";

import profileIcon from "./assets/profile.png";
import deleteIcon from "./assets/Remove.png";
import shieldIcon from "./assets/Shield.png";

const PrescriptionPage = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [notes, setNotes] = useState("");

  const [medications, setMedications] = useState([
    { medicine_id: "", dosage: "", frequency: "", duration: "" }
  ]);

  const [patientQuery, setPatientQuery] = useState("");
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const cookie = new Cookies();
  const token = cookie.get("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  };

  // ================= PRESCRIPTIONS =================
  useEffect(() => {async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/doctor/prescriptions",
        config
      );

      setPrescriptions(res.data.data || []);
    } catch (err) {
      console.log(err.response?.data , err);
    }
  };
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/doctor/prescriptions",
        config
      );

      setPrescriptions(res.data.data || []);
    } catch (err) {
      console.log(err.response?.data , err);
    }
  };

  // ================= PATIENT SEARCH (FIXED) =================
  const searchPatients = async (value) => {
    if (!value||  value.trim() === "") {
      setPatients([]);
      return;
    }

    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/v1/patients/search",
        {
          ...config,
          params: {
            query: value.trim(), // 🔥 أهم سطر
          },
        }
      );

      setPatients(res.data.data || []);
    } catch (err) {
      console.log("SEARCH ERROR:", err.response?.data || err);
      setPatients([]);
    }
  };

  // ================= DEBOUNCE =================
  useEffect(() => {
    const delay = setTimeout(async () => {
      const q = patientQuery.trim();
  
      if (!q) {
        setPatients([]);
        return;
      }
  
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/api/v1/patients/search",
          {
            ...config,
            params: {
              query: q,   // 🔥 أهم شي
            },
          }
        );
  
        console.log("RESULT:", res.data);
  
        setPatients(res.data.data||  []);
      } catch (err) {
        console.log("SEARCH ERROR:", err.response?.data);
        setPatients([]);
      }
    }, 400);
  
    return () => clearTimeout(delay);
  }, [patientQuery]);

  // ================= MEDICATIONS =================
  const handleMedChange = (index, field, value) => {
    const updated = [...medications];
    updated[index][field] = value;
    setMedications(updated);
  };

  const addMedication = () => {
    setMedications([
      ...medications,
      { name: "", dosage: "", frequency: "", duration: "" }
    ]);
  };

  const removeMedication = (index) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  // ================= CREATE PRESCRIPTION =================
  const createPrescription = async () => {
    try {
      const items = medications.map((m) => ({
        medicine_id:  Number(m.medicine_id), // ⚠️ لاحقاً لازم ربطه مع medicines API
        quantity: 1,
        dosage: m.dosage,
        frequency: m.frequency,
        duration: m.duration,
      }));

      await axios.post(
        "http://127.0.0.1:8000/api/doctor/prescriptions",
        {
          patient_id: selectedPatient?.id,
          prescription_date: new Date().toISOString(),
          items,
          notes,
        },
        config
      );

      alert("Prescription created successfully!");

      setNotes("");
      setMedications([{ name: "", dosage: "", frequency: "", duration: "" }]);
      setSelectedPatient(null);
      setPatientQuery("");
      setPatients([]);
fetchPrescriptions();
    } catch (err) {
      console.log("CREATE ERROR:", err.response?.data || err);
    }
  };

  return (
    <div className="page-layout">
      <SideBar />

      <div className="prescription-container">

        <div className="page-header">
          <h1>Create Digital Prescription</h1>
          <p>Securely issue and sign electronic prescription</p>
        </div>

        <div className="top-grid">

          {/* ================= PATIENT ================= */}
          <div className="card patient-card">
            <h2>Patient Information</h2>

            {selectedPatient ? (
              <div className="patient-info-box">
                <img src={profileIcon} alt="patient" />

                <div>
                  <h3>{selectedPatient.name}</h3>
                  <p>{selectedPatient.email}</p>
                  <p>{selectedPatient.phone}</p>

                  <button onClick={() => setSelectedPatient(null)}>
                    Change Patient
                  </button>
                </div>
              </div>
            ) : (
              <>
                <input
  type="text"
  placeholder="Search patient..."
  value={patientQuery}
  onChange={(e) => setPatientQuery(e.target.value)}
/>

                {patients.length > 0 && (
                  <div className="search-results">
                    {patients.map((p) => (
                      <div
                        key={p.id}
                        className="result-item"
                       onClick={() => {
  setSelectedPatient(p);
  setPatientQuery(p.name);
  setPatients([]);
}}
                      >
                        <strong>{p.name}</strong> - {p.email}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* ================= MEDICATIONS ================= */}
          <div className="card medications-card">
            <h2>Medications</h2>

            {medications.map((med, index) => (
              <div key={index} className="medication-row">
                <input
  placeholder="Medicine ID"
  value={med.medicine_id}
  onChange={(e) =>
    handleMedChange(index, "medicine_id", e.target.value)
  }
/>

                <input
                  placeholder="Dosage"
                  value={med.dosage}
                  onChange={(e) =>
                    handleMedChange(index, "dosage", e.target.value)
                  }
                />

                <input
                  placeholder="Frequency"
                  value={med.frequency}
                  onChange={(e) =>
                    handleMedChange(index, "frequency", e.target.value)
                  }
                />

                <input
                  placeholder="Duration"
                  value={med.duration}
                  onChange={(e) =>
                    handleMedChange(index, "duration", e.target.value)
                  }
                />

                <img
                  src={deleteIcon}
                  alt="delete"
                  onClick={() => removeMedication(index)}
                />
              </div>
            ))}

            <button onClick={addMedication}>
              + Add Medication
            </button>
          </div>

          {/* ================= NOTES ================= */}
          <div className="card notes-card">
            <h2>Doctor Notes</h2>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter notes..."
            />
          </div>

          {/* ================= SIGNATURE ================= */}
          <div className="card signature-card">
            <h2>Digital Signature</h2>

            <img src={shieldIcon} alt="shield" />

            <button
              onClick={createPrescription}
              disabled={!selectedPatient}
            >
              Generate & Sign
            </button>
          </div>

        </div>


        <div className="archive-section">

  <div className="archive-header">
    <h1>Prescription Archive</h1>
    <p>All created prescriptions</p>
  </div>

  <div className="archive-table">

    {/* HEADER */}
    <div className="archive-table-header">
      <span>ID</span>
      <span>Patient</span>
      <span>Date</span>
      <span>Medicines</span>
      <span>Status</span>
    </div>

    {/* ROWS */}
    {prescriptions.map((p) => (
      <div className="archive-row" key={p.id}>
        <span>#{p.id}</span>
        <span>{p.patient?.name}</span>
        <span>
          {new Date(p.created_at).toLocaleDateString()}
        </span>
        <span>{p.medicines?.length || 0}</span>
        <span className={p.status}>
          {p.status}
        </span>
      </div>
    ))}

  </div>
</div>

      </div>
    </div>
  );
};

export default PrescriptionPage;