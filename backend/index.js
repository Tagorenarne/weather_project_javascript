import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors({
  origin: "*"
}));

app.get("/weather", async (req, res) => {
  try {
    const { city, lat, lon } = req.query;

    let url = "";

    if (lat && lon) {
      // GPS-based (most accurate)
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;
    } else if (city) {
      // City-based fallback
      url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;
    } else {
      return res.status(400).json({ error: "Location required" });
    }

    const response = await axios.get(url);
    res.json(response.data);

  } catch {
    res.status(404).json({ error: "Weather not found" });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("⚡ Backend running on port 3000");
});
