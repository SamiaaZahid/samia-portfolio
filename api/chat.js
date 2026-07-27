export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  const PORTFOLIO_CONTEXT = `
  You are an AI assistant for Samia Zahid's personal portfolio website. 
  Answer visitor questions politely, professionally, and accurately using the details below:
  
  - Name: Samia Zahid
  - Field: Robotics and Artificial Intelligence Student
  - Institution: The University of Lahore
  - Core Skills: Python, C++, Embedded C, PCB Design, AWS EC2, Linux, Streamlit, Arduino
  - Projects: AWS Live Portfolio, US Mortality AI Dashboard, Voice Assistant, Custom PCB, Smart Parking System
  `;

  try {
    const apiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              { text: `System Context: ${PORTFOLIO_CONTEXT}` },
              { text: `User Query: ${message}` }
            ]
          }
        ]
      })
    });

    const data = await apiResponse.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process that.";
    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to connect to AI server' });
  }
}
