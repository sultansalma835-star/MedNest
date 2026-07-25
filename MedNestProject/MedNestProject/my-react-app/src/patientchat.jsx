// import { useEffect, useRef, useState } from "react";
// import axios from "axios";
// import "./PatientChat.css";

// import profileImg from "./assets/profile.png";
// import sendIcon from "./assets/send.png";

// import SideBar from "./components/SideBar";

// export default function PatientChat() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [consultationId, setConsultationId] = useState(null);

//   const messagesEndRef = useRef(null);

 
//   useEffect(() => {
//     if (messagesEndRef.current) {
//         messagesEndRef.current.scrollIntoView({
//           behavior: "smooth",
//         });
//       }
//   }, [messages]);

  
//   useEffect(() => {
//     const fetchConsultations = async () => {
//       try {
//         const res = await axios.get("http://127.0.0.1:8000/api/patient/consultations");

//         const consultation = res.data && res.data[0];

//         if (consultation) {
//           setConsultationId(consultation.id);

//           const formattedMessages = consultation.messages.map((msg) => ({
//             id: msg.id,
//             sender: msg.sender,
//             text: msg.text,
//             time: new Date(msg.created_at).toLocaleTimeString([], {
//               hour: "2-digit",
//               minute: "2-digit",
//             }),
//           }));

//           setMessages(formattedMessages);
//         }
//       } catch (error) {
//         console.error("Failed to fetch consultations:", error);
//       }
//     };

//     fetchConsultations();
//   }, []);

//   // Send Message
//   const sendMessage = async () => {
//     if (!input.trim()) return;
  
//     const patientMessage = {
//       id: Date.now(),
//       sender: "user",
//       text: input,
//       time: new Date().toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       }),
//     };
  
//     setMessages((prev) => [...prev, patientMessage]);
  
//     const messageText = input;
//     setInput("");
  
//     try {
  
//       // إذا ما في consultation
//       let currentConsultationId = consultationId;
  
//       if (!currentConsultationId) {
  
//         const createRes = await axios.post(
//           "http://127.0.0.1:8000/api/consultations",
//           {}
//         );
  
//         currentConsultationId = createRes.data.id;
  
//         setConsultationId(currentConsultationId);
//       }
  
//       // إرسال الرسالة
//       await axios.post(
//         `http://127.0.0.1:8000/api/consultations/${currentConsultationId}/message`,
//         {
//           message: messageText,
//         }
//       );
  
//     } catch (error) {
//       console.error("Failed to send message:", error.response?.data || error);
//     }
//   };
//   // Send on Enter
//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       sendMessage();
//     }
//   };

//   return (
//     <div className="chat-page">

//       <SideBar />

//       <div className="chat-header">
//         <h1>Talk to Pharmacist</h1>
//         <p>Ask your pharmacist about medications anytime</p>
//       </div>

//       <div className="chat-container">

//         {/* Pharmacist Info */}
//         <div className="pharmacist-info">
//           <img src={profileImg} alt="profile" className="avatar" />

//           <div>
//             <h2>Pharmacist</h2>

//             <div className="status">
//               <span className="online-dot"></span>
//               Online
//             </div>
//           </div>
//         </div>

//         {/* Messages */}
//         <div className="messages-container">
//           {messages.map((msg) => (
//             <div
//               key={msg.id}
//               className={`message-row ${
//                 msg.sender === "user"
//                   ? "user-row"
//                   : "pharmacist-row"
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

//         {/* Input */}
//         <div className="chat-input-container">
//           <input
//             type="text"
//             placeholder="Type Your Message ..."
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={handleKeyDown}
//           />

//           <button onClick={sendMessage} className="send-btn">
//             <img src={sendIcon} alt="send" />
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }

// import { useEffect, useRef, useState, useContext } from "react";
// import axios from "axios";
// import { User } from "./Context/UserContext";

// import "./PatientChat.css";
// import sendIcon from "./assets/send.png";
// import SideBar from "./components/SideBar";
//  import profileImg from "./assets/profile.png";
//  import sendIcon from "./assets/send.png";

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

//   // ================= AUTO SCROLL =================
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // ================= GET =================
//   useEffect(() => {
//     if (!auth?.token) return;

//     const fetchData = async () => {
//       try {
//         const res = await axios.get(
//           "http://127.0.0.1:8000/api/consultations/patient",
//           config
//         );

//         const data = res.data;

//         if (!data || data.length === 0) {
//           setMessages([]);
//           return;
//         }

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

//   // ================= SEND =================
//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     const text = input;
//     setInput("");

//     try {
//       let id = consultationId;

//       // CREATE CONSULTATION
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
//           {
//             message: text,
//           },
//           config
//         );
//       }

//       // UI update
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

//       <div className="chat-container">
//         <div className="messages-container">
//           {messages.map((msg) => (
//             <div
//               key={msg.id}
//               className={`message-row ${
//                 msg.sender === "user"
//                   ? "user-row"
//                   : "pharmacist-row"
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
//             placeholder="Type message..."
//           />

//           <button onClick={sendMessage}>
//             <img src={sendIcon} alt="send" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// import { useEffect, useRef, useState, useContext } from "react";
// import axios from "axios";
// import { User } from "./Context/UserContext";

// import "./patientChat.css";
// import sendIcon from "./assets/send.png";
// import profileImg from "./assets/profile.png";
// import SideBar from "./components/SideBar";

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

//   // GET DATA
//   useEffect(() => {
//     if (!auth?.token) return;

//     const fetchData = async () => {
//       try {
//         const res = await axios.get(
//           "http://127.0.0.1:8000/api/consultations/patient",
//           config
//         );

//         const data = res.data;

//         if (!data || data.length === 0) {
//           setMessages([]);
//           return;
//         }

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

     
//       <div className="chat-container">

      
//         <div className="pharmacist-info">
//           <img src={profileImg} alt="profile" className="avatar" />

//           <div>
//             <h2>Pharmacist</h2>
//             <div className="status">
//               <span className="online-dot"></span>
//               Online
//             </div>
//           </div>
//         </div>

        
//         <div className="messages-container">

//           {messages.map((msg) => (
//             <div
//               key={msg.id}
//               className={`message-row ${
//                 msg.sender === auth.user.id
//               }`}
//             >
//               <div
//                 className={`message-bubble ${
//                   msg.sender === auth.user.id
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
//             placeholder="Type Your Message ..."
//           />

//           <button className="send-btn" onClick={sendMessage}>
//             <img src={sendIcon} alt="send" />
//           </button>

//         </div>

//       </div>
//     </div>
//   );
// }
import { useEffect, useRef, useState, useContext } from "react";
import axios from "axios";
import { User } from "./Context/UserContext";

import "./patientChat.css";
import sendIcon from "./assets/send.png";
import SideBar from "./components/SideBar";

export default function PatientChat() {
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
  if (!auth?.token) return;

  const fetchData = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/consultations/patient",
        config
      );

      const data = res.data;

      if (!data || data.length === 0) return;

      // 🔥 أهم تعديل: لا تأخذ [0] بشكل عشوائي
      // خذ آخر محادثة أو المفتوحة
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
  // SEND MESSAGE
  const sendMessage = async () => {
    if (!input.trim()) return;

    const text = input;
    setInput("");

    try {
      let id = consultationId;

      if (!id) {
        const res = await axios.post(
          "http://127.0.0.1:8000/api/consultations",
          {
            subject: "General",
            message: text,
          },
          config
        );

        id = res.data.consultation.id;
        setConsultationId(id);
      } else {
        await axios.post(
          `http://127.0.0.1:8000/api/consultations/${id}/message`,
          { message: text },
          config
        );
      }

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
        <h1>Talk to Pharmacist</h1>
        <p>Ask your pharmacist about medications anytime</p>
      </div>
      <div className="chat-container">

        <div className="messages-container">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`message-row ${
                msg.sender === "me" ? "user-row" : "pharmacist-row"
              }`}
            >
              <div
                className={`message-bubble ${
                  msg.sender === "me"
                    ? "user-message"
                    : "pharmacist-message"
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
  );
}