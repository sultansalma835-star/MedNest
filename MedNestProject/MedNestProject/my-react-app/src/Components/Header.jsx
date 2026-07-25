
import "./style.css";
import axios from "axios";

export default function Header({
  setMedicines,
  token,
  search,
  setSearch,
}) {
const handleSearch = async (value) => {
  const cleanValue = value.toLowerCase(); 

  setSearch(value);

  try {
    let url = "";

    if (cleanValue.trim() === "") {
      url = "http://127.0.0.1:8000/api/medicines";
    } else {
      url = `http://127.0.0.1:8000/api/v1/medicines/search?query=${cleanValue}`;
    }

    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    setMedicines(res.data.data );
  } catch (err) {
    console.log(err);
    setMedicines([]);
  }
};

  return (
    <div className="Header">

     
      <div className="header-top">
        <i className="fas fa-staff-snake icon"></i>

        <div className="title-text">
          <h1>Welcome to Mednest Website</h1>
          <h4>Smart & Safe Medication Management</h4>
        </div>
      </div>

     
      <div className="header-bottom">

        <div className="ask-text">
          What do you need today?
        </div>

        <div >
          <input
            type="search"
            placeholder="Search for medicines"
            value={search}
            className="search-box"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

      </div>

    </div>
  );
}