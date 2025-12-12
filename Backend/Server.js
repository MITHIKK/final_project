require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());


mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log("MongoDB Error:", err));



const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});
const User = mongoose.model("User", userSchema);



const serviceSchema = new mongoose.Schema({
    vehicleNumber: String,
    vehicleType: String,
    lastServiceDate: String,
    nextServiceDate: String,
    lastKm: Number,
    nextServiceKm: Number,
    notes: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});
const Service = mongoose.model("Service", serviceSchema);



const verifyToken = (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) return res.status(401).send("Token missing");

    token = token.replace("Bearer ", "");

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).send("Invalid token");

        req.userId = decoded.userId;
        next();
    });
};



app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const oldUser = await User.findOne({ email });
        if (oldUser) return res.status(400).send("Email already exists");

        const hashed = await bcrypt.hash(password, 10);

        const user = new User({ name, email, password: hashed });
        await user.save();

        res.send("User registered");
    } catch (err) {
        res.status(500).send("Error registering");
    }
});


app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).send("Invalid email or password");

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).send("Invalid email or password");

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET
        );

        res.json({ token });
    } catch {
        res.status(500).send("Server error");
    }
});



app.post('/api/services', verifyToken, async (req, res) => {
    const service = new Service({
        vehicleNumber: req.body.vehicleNumber,
        vehicleType: req.body.vehicleType,
        lastServiceDate: req.body.lastServiceDate,
        nextServiceDate: req.body.nextServiceDate,
        lastKm: req.body.lastKm,
        nextServiceKm: req.body.nextServiceKm,
        notes: req.body.notes,
        user: req.userId
    });

    await service.save();
    res.json(service);
});


app.get('/api/services', verifyToken, async (req, res) => {
    const list = await Service.find({ user: req.userId });
    res.json(list);
});



app.get('/api/services/:id', verifyToken, async (req, res) => {
    const data = await Service.findOne({
        _id: req.params.id,
        user: req.userId
    });

    if (!data) return res.status(404).send("Not found");
    res.json(data);
});



app.put('/api/services/:id', verifyToken, async (req, res) => {
    const updated = await Service.findOneAndUpdate(
        { _id: req.params.id, user: req.userId },
        req.body,
        { new: true }
    );

    if (!updated) return res.status(404).send("Not found");
    res.json(updated);
});



app.delete('/api/services/:id', verifyToken, async (req, res) => {
    const deleted = await Service.findOneAndDelete({
        _id: req.params.id,
        user: req.userId
    });

    if (!deleted) return res.status(404).send("Not found");
    res.json({ message: "Service deleted" });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
