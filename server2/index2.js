const OpenAI = require("openAI");
require("dotenv").config();
const express = require("express");
const app = express();
const { GoogleGenAI } = require("@google/genai");
const port = process.env.PORT || 5000;
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});
console.log(process.env.OPENROUTER_API_KEY);

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
  const { prompt: codeSnippet } = req.body;
  const prompt = `Analyze the following code and
    1. Identify bugs or issues,
    2. Suggest fixes
    3. Improve performance if possible
    4. keep explanation simple  

    code: ${codeSnippet}

    return as JSON: {
        "issues": [...],
        "fixes": [..],
        "improvement": [...]
    }
    `;

  const completion = await openai.chat.completions.create({
    model: "nvidia/nemotron-3-super-120b-a12b:free",
    messages: [
      {
        role: "system",
        content: `You are a senior software engineer & a debugging expert`,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });
  res.send(completion.choices[0]?.message);
});

// app.post('/prompt', async(req, res) => {
//   const { prompt } = req.body;
//   if(!prompt) return res.status(400).send({message: "Please provide some text"})
//   const completion = await openai.chat.completions.create({
//     model: "nvidia/nemotron-3-super-120b-a12b:free",
//     messages: [
//       { role: "user", content: `${prompt} Make it actual JSON Format` },
//     ],
//   });
//   res.send({ data: (completion.choices[0].message) });
// })

// app.post("/prompt", async (req, res) => {
//   let { prompt } = req?.body;
//   if(!prompt) return res.status(400).send({message: "Please provide some text"})
//   const result = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: prompt,
//     config: {
//       responseMimeType: 'application/json'
//     }
//   });
//   const responseText = result.text;
//   console.log(responseText);
//   res.send({data: JSON.parse(responseText)});
// });

// Define a route for the home page
app.get("/", (req, res) => {
  res.send({ message: "Power of AI" });
});

// Start the server and listen for requests
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
