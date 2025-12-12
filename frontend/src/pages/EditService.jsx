import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";

function EditService() {
  const { id } = useParams();

  const [form, setForm] = useState({
    vehicleNumber: "",
    vehicleType: "",
    lastServiceDate: "",
    nextServiceDate: "",
    lastKm: "",
    nextServiceKm: "",
    notes: ""
  });

  const [loading, setLoading] = useState(true);

  // Load existing service
  useEffect(() => {
    const loadService = async () => {
      try {
        const res = await API.get(`/services/${id}`);
        setForm({
          vehicleNumber: res.data.vehicleNumber || "",
          vehicleType: res.data.vehicleType || "",
          lastServiceDate: res.data.lastServiceDate || "",
          nextServiceDate: res.data.nextServiceDate || "",
          lastKm: res.data.lastKm || "",
          nextServiceKm: res.data.nextServiceKm || "",
          notes: res.data.notes || ""
        });
        setLoading(false);
      } catch (err) {
        alert("Error fetching service");
        setLoading(false);
      }
    };

    loadService();
  }, [id]);

  // Updating form fields
  const updateField = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Save updated service
  const save = async () => {
    try {
      await API.put(`/services/${id}`, form);
      alert("Service updated successfully");
      window.location.href = "/dashboard";
    } catch {
      alert("Update failed — check console/network for details");
    }
  };

  if (loading) return <h3>Loading...</h3>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Edit Service</h2>

      <input
        name="vehicleNumber"
        value={form.vehicleNumber}
        placeholder="Vehicle Number"
        onChange={updateField}
      />

      <input
        name="vehicleType"
        value={form.vehicleType}
        placeholder="Vehicle Type"
        onChange={updateField}
      />

      <input
        type="date"
        name="lastServiceDate"
        value={form.lastServiceDate}
        onChange={updateField}
      />

      <input
        type="date"
        name="nextServiceDate"
        value={form.nextServiceDate}
        onChange={updateField}
      />

      <input
        name="lastKm"
        value={form.lastKm}
        placeholder="Last Km"
        onChange={updateField}
      />

      <input
        name="nextServiceKm"
        value={form.nextServiceKm}
        placeholder="Next Service KM"
        onChange={updateField}
      />

      <textarea
        name="notes"
        value={form.notes}
        placeholder="Notes"
        onChange={updateField}
      ></textarea>

      <br />

      <button onClick={save}>Update Service</button>
    </div>
  );
}

export default EditService;
