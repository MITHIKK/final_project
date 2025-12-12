import { useState } from "react";
import axios from "axios";

function AddService() {
  const [form, setForm] = useState({
    vehicleNumber: "",
    vehicleType: "",
    lastServiceDate: "",
    nextServiceDate: "",
    lastKm: "",
    nextServiceKm: "",
    notes: ""
  });

  const handle = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    const token = localStorage.getItem("token");

    await axios.post("http://localhost:5000/api/services", form, {
      headers: { Authorization: `Bearer ${token}` }
    });

    alert("Service Added!");
    window.location.href = "/dashboard";
  };

  return (
    <div>
      <h2>Add Service</h2>

      <input name="vehicleNumber" placeholder="Vehicle Number" onChange={handle} />
      <input name="vehicleType" placeholder="Vehicle Type" onChange={handle} />
      <input type="date" name="lastServiceDate" onChange={handle} />
      <input type="date" name="nextServiceDate" onChange={handle} />
      <input name="lastKm" placeholder="Last KM" onChange={handle} />
      <input name="nextServiceKm" placeholder="Next Service KM" onChange={handle} />
      <textarea name="notes" placeholder="Notes" onChange={handle}></textarea>

      <button onClick={submit}>Add Service</button>
    </div>
  );
}

export default AddService;
