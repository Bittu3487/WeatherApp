import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import env from "dotenv";

const app = express();
const port = 3000;
env.config();


// Set EJS as templating engine
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  const today = new Date();

  // Format the date as "Saturday, 10 August"
  const options = { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  };
  const formattedDate = today.toLocaleDateString('en-US', options);
  res.render("index", { content: "API Response." , formattedDate });
});

app.post("/submit", async (req, res) => {
  const cityName = req.body.fName;
  // const apiKey = process.env.API_KEY;
  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${process.env.API_KEY}`);
    const result = response.data;
    const temperatureInCelsius = result.main.temp - 273.15;
    result.main.temp_celsius = temperatureInCelsius.toFixed(2);
    const today = new Date();

  
    const options = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    };
    const formattedDate = today.toLocaleDateString('en-US', options);
    res.render("index", { data: result , formattedDate });
  } catch (error) {
    res.render("index" , { data:null, error:"No city found. Please try again."});
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
