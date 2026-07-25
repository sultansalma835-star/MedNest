import { Link } from "react-router-dom";
import "./NoSafe.css";

import error from "./assets/error.png";
import Footer from "./components/Footer";
import SideBar from "./components/SideBar";
export default function NoSafe() {
  return (
    <div className="body">
      <SideBar/>

      <div className="analize">
        Analyzing your order....
      </div>

      <div className="nosafe">

        <div className="wait">
          <i class="fa-solid fa-x"></i>
       
        </div>

        <div className="warning-message">

          <h2>Drug interaction detected!</h2>
          <div className="error">
          <img src={error} alt="error" />
        </div>

          <h4>
            This prescription may cause harmful interaction.
          </h4>

          <div className="container">

            <h4>Do not use these two medications together</h4>
            <h4>Avoid taking both drugs at the same time</h4>
            <h4>Consult a pharmacist or healthcare provider</h4>

          </div>

        
          <Link to="/recommendations" className="button">
            <button>Back to Recommendations</button>
          </Link>

        </div>
        <Footer />
      </div>
    </div>
  );
}