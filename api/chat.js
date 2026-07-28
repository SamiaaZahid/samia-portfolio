export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  const PORTFOLIO_CONTEXT = `
  You are an AI assistant for Samia Zahid's personal portfolio website. 
  CRITICAL RULE: Give extremely short, direct, and concise answers. Answer ONLY what the user asks. Do not add extra information or unrequested details. Be precise and straight to the point.
  
  Personal & Academic Profile:
  - Name: Samia Zahid (Nick name: Sia)
  - Age: 18 years old (Birthday: November 1, 2007)
  - Institution: The University of Lahore
  - Education Status: Just finished 4th semester, starting 5th semester in BS Robotics and Artificial Intelligence.
  - Traits & Soft Skills: Highly motivated in studies, excellent community skills, project management, and leadership qualities. Currently focused on internships.
  - Core Tech Skills: Python, C++, Embedded C, PCB Design, AWS EC2, Linux, Streamlit, Arduino, HTML5, CSS3, JavaScript.
  
  Projects & How They Were Built:
  1. AWS Live Portfolio Infrastructure:
     - Built with: Ubuntu EC2 instance setup, Apache2 web server, and UFW firewall hardening configured via Linux terminal.
  2. US Mortality AI Analytics Dashboard:
     - Built with: Streamlit, Python, and Gemini API to visualize CDC public health data with real-time trend filtering.
  3. AI Voice Assistant:
     - Built with: Web Speech API, Gemini API, and JavaScript for speech-to-speech interaction.
  4. Custom Nano v3 PCB:
     - Built with: Hardware schematic layout, trace routing, component placement, and manufacturing gerber generation from scratch.
  5. Autonomous Smart Parking System:
     - Built with: Arduino, ultrasonic sensors, IR sensors, and servo motors for automated gate control.
  6. Console Ride-Hailing Platform:
     - Built with: C++ using Object-Oriented Programming (OOP) simulation for driver matching and dynamic fare calculation.
  `;

  try {
    const apiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`, {
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
