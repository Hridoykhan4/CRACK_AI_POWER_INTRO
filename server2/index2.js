require("dotenv").config();
const express = require("express");
const app = express();
const { GoogleGenAI } = require("@google/genai");
const port = process.env.PORT || 5000;
const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} at ${new Date().toLocaleTimeString()}`);
  next();
});
const form = `
    <form method="POST" action="/prompt">
    <textarea name="prompt" id="prompt"></textarea>
    <button type="submit">Generate</button>
    </form>
`;

// Generate Reply (1)
app.get("/test-ai", async (req, res) => {
  res.send(form);
});

app.post("/prompt", async (req, res) => {
  let { prompt } = req?.body;
  if(!prompt) return res.status(400).send({message: "Please provide some text"})
  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt , 
    config: {
      responseMimeType: 'application/json'
    }
  });
  const responseText = result.text
  res.send({data: JSON.parse(responseText)});
});

// Define a route for the home page
app.get("/", (req, res) => {
  res.send({ message: "Power of AI" });
});

// Start the server and listen for requests
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
