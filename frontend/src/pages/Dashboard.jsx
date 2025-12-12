import { useEffect, useState } from "react";
import API from "../api";

function Dashboard() {
  const [list, setList] = useState([]);

  const load = async () => {
    const res = await API.get("/services");
    setList(res.data);
  };

  const deleteService = async (id) => {
    await API.delete(`/services/${id}`);
    load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h2>Your Services</h2>

      <a href="/add-service">+ Add Service</a>

      {list.map((s) => (
        <div key={s._id} style={{ border: "1px solid #aaa", margin: 10, padding: 10 }}>
          <p><b>Vehicle Number:</b> {s.vehicleNumber}</p>
          <p><b>Vehicle Type:</b> {s.vehicleType}</p>
          <p><b>Last Service:</b> {s.lastServiceDate}</p>
          <p><b>Next Service:</b> {s.nextServiceDate}</p>
          <p><b>Last KM:</b> {s.lastKm}</p>
          <p><b>Next Service KM:</b> {s.nextServiceKm}</p>
          <p><b>Notes:</b> {s.notes}</p>

          <button onClick={() => window.location.href = `/edit/${s._id}`}>Edit</button>
          <button onClick={() => deleteService(s._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
