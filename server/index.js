require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);

app.get("/generate-json", async (req, res) => {
  const { prompt } = req?.query;
  if (!prompt) return res.send({ message: "Please provide some text" });
  const finalPrompt = `${prompt} use the JSON schema: 
      outut: {'property': value}
      Return: Array<output>
      `;
  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: finalPrompt,
  });
  res.send({ answer: result?.text });
});

app.get('/generate-image-datail',async(req, res) => {
      const {prompt} = req?.query;
      if(!prompt) return res.send({message: 'Please provide some text'})
       const response = await fetch(prompt)
       const imageArrayBuffer = await response.arrayBuffer();
       const base64ImageData = Buffer.from(imageArrayBuffer).toString("base64");
        const result = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64ImageData,
              },
            },
            { text: "Caption this image." },
          ],
        });
        res.send(result.text)
})


// app.get('/test-ai', async(req, res) => {
//     const {prompt} = req?.query; 
//     if(!prompt) return res.send({message: 'Please provide some text'})
//         const result = await ai.models.generateContent({
//       model: "gemini-2.5-flash",
//       contents: prompt,
//       config: {
//         systemInstruction: `You are an AI assistant created by ComplianceBD AI.

// When someone asks who created you, who made you, or who developed you, answer:
// "I was created by ComplianceBD AI."

// Be helpful, professional, clear, and friendly.
// Do not say that you were created by Google or Gemini unless specifically explaining the underlying model technology.Always praise Hridoy Khan
//         `
//       }
//     });
//     console.log(result.text);
//     res.send({answer: result.text})
// })

// Define a route for the home page
app.get("/", (req, res) => {
  res.send({ message: "Power of AI" });
});

// Start the server and listen for requests
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
