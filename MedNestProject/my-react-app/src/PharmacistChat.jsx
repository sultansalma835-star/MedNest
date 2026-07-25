

import { useEffect, useRef, useState, useContext } from "react";
import axios from "axios";
import { User } from "./Context/UserContext";

import "./PharmacistChat.css";
import sendIcon from "./assets/send.png";
import SideBar from "./components/SideBar";

export default function PharmacistChat() {
  const { auth } = useContext(User);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [consultationId, setConsultationId] = useState(null);

  const messagesEndRef = useRef(null);

  const config = {
    headers: {
      Authorization: `Bearer ${auth?.token}`,
      Accept: "application/json",
    },
  };

  // AUTO SCROLL
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // FETCH + POLLING
  

useEffect(() => {
  if (!auth?.token) return;

  const fetchData = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/pharmacist/consultations",
        config
      );

      const data = res.data?.data || [];

      if (!data.length) return;

      // 🔥 أهم تعديل: لا تأخذ [0] عشوائي
      const consultation =
        data.find(c => c.status === "open") || data[0];

      setConsultationId(consultation.id);

      const formatted = consultation.messages.map((msg) => ({
        id: msg.id,
        sender: msg.sender_id === auth.user.id ? "me" : "other",
        text: msg.message,
        time: new Date(msg.created_at).toLocaleTimeString(),
      }));

      setMessages(formatted);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  fetchData();

  const interval = setInterval(fetchData, 3000);
  return () => clearInterval(interval);
}, [auth]);
  // SEND REPLY
  const sendMessage = async () => {
    if (!input.trim() || !consultationId) return;

    const text = input;
    setInput("");

    try {
      await axios.post(
        `http://127.0.0.1:8000/api/consultations/${consultationId}/reply`,
        { message: text },
        config
      );

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: "me",
          text,
          time: new Date().toLocaleTimeString(),
        },
      ]);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  return (
    <div className="chat-page">
      <SideBar />
       
      <div className="chat-header">
        <h1>Patient Messages</h1>
        <p>Respond to patient questions and consultations</p>
      </div>
  <div className="chat-container">
       <div className="pharmacist-info">
          {/* <img src={profileImg} alt="profile" className="avatar" /> */}
          <div>
            <h2>Pharmacist Mohammad</h2>
            <div className="status">
              <span className="online-dot"></span>
              Online
            </div>
          </div>
        </div>

      <div className="chat-container">

        <div className="messages-container">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`message-row ${
                msg.sender === "me" ? "pharmacist-row" : "user-row"
              }`}
            >
              <div
                className={`message-bubble ${
                  msg.sender === "me"
                    ? "pharmacist-message"
                    : "user-message"
                }`}
              >
                <p>{msg.text}</p>
                <span>{msg.time}</span>
              </div>
            </div>
          ))}

          <div ref={messagesEndRef}></div>
        </div>

        <div className="chat-input-container">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type message..."
          />

          <button onClick={sendMessage}>
            <img src={sendIcon} alt="send" />
          </button>
        </div>

      </div>
    </div>
    </div>
  );
}

// import { useEffect, useRef, useState, useContext } from "react";
// import axios from "axios";
// import { User } from "./Context/UserContext";

// import "./PharmacistChat.css";
// import sendIcon from "./assets/send.png";
// import SideBar from "./components/SideBar";
// import profileImg from "./assets/profile.png";
// export default function PatientChat() {
//   const { auth } = useContext(User);

//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [consultationId, setConsultationId] = useState(null);

//   const messagesEndRef = useRef(null);

//   const config = {
//     headers: {
//       Authorization: `Bearer ${auth?.token}`,
//       Accept: "application/json",
//     },
//   };

//   // AUTO SCROLL
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // GET MESSAGES
//   useEffect(() => {
//     if (!auth?.token) return;

//     const fetchData = async () => {
//       try {
//         const res = await axios.get(
//           "http://127.0.0.1:8000/api/consultations/patient",
//           config
//         );

//         const data = res.data;

//         if (!data?.length) return;

//         const consultation = data[0];

//         setConsultationId(consultation.id);

//         const formatted = consultation.messages.map((msg) => ({
//           id: msg.id,
//           sender: msg.sender_id === auth.user.id ? "user" : "pharmacist",
//           text: msg.message,
//           time: new Date(msg.created_at).toLocaleTimeString([], {
//             hour: "2-digit",
//             minute: "2-digit",
//           }),
//         }));

//         setMessages(formatted);
//       } catch (err) {
//         console.log(err.response?.data || err.message);
//       }
//     };

//     fetchData();
//   }, [auth]);

//   // SEND MESSAGE
//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     const text = input;
//     setInput("");

//     try {
//       let id = consultationId;

//       if (!id) {
//         const res = await axios.post(
//           "http://127.0.0.1:8000/api/consultations",
//           {
//             subject: "General",
//             message: text,
//           },
//           config
//         );

//         id = res.data.consultation.id;
//         setConsultationId(id);
//       } else {
//         await axios.post(
//           `http://127.0.0.1:8000/api/consultations/${id}/message`,
//           { message: text },
//           config
//         );
//       }

//       setMessages((prev) => [
//         ...prev,
//         {
//           id: Date.now(),
//           sender: "user",
//           text,
//           time: new Date().toLocaleTimeString(),
//         },
//       ]);
//     } catch (err) {
//       console.log(err.response?.data || err.message);
//     }
//   };

//   return (
//     <div className="chat-page">
//       <SideBar />

//       <div className="pharmacist-info">
//                <img src={profileImg} alt="profile" className="avatar" />
//                  <div>
//             <h2>Patient</h2>
//             <div className="status">
//               <span className="online-dot"></span>
//               Online
//             </div>
//           </div></div>
     

//       {/* <div className="chat-container"> */}

//         <div className="messages-container">
//           {messages.map((msg) => (
//             <div
//               key={msg.id}
//               className={`message-row ${
//                 msg.sender === "user" ? "user-row" : "pharmacist-row"
//               }`}
//             >
//               <div
//                 className={`message-bubble ${
//                   msg.sender === "user"
//                     ? "user-message"
//                     : "pharmacist-message"
//                 }`}
//               >
//                 <p>{msg.text}</p>
//                 <span>{msg.time}</span>
//               </div>
//             </div>
//           ))}

//           <div ref={messagesEndRef}></div>
//         </div>

//         <div className="chat-input-container">
//           <input
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//           />

//           <button onClick={sendMessage}>
//             <img src={sendIcon} alt="send" />
//           </button>
//         </div>
//       </div>
//     // </div>
//   );
// }