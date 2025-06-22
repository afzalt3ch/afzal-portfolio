// ==== Chatbot Toggle and UI Elements ====
const toggleBtn = document.getElementById('chatbot-toggle');
const chatbot = document.getElementById('chatbot');
const closeBtn = document.getElementById('close-chatbot');
const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatMessages = document.getElementById('chatbot-messages');

// ==== Local Intent Dictionaries ====
const greetings = ["hi", "hello", "hey", "good morning", "good afternoon", "good evening"];
const goodbyes = ["bye", "goodbye", "see you", "take care", "see ya"];
const gibberishPatterns = [/^[a-z]{1,3}$/,/^[0-9]{1,9}$/,/^[a-z0-9]{5,}$/i, /^[^a-zA-Z0-9\s]{3,}$/i];  // e.g., 'xk', '!!??!'

// ==== Response Dictionary ====
const responseDictionary = {
  "about_me": "I'm highly passionate about Machine Learning and Data Science, always exploring new ways to extract insights from data and build intelligent systems.",
  "certifications": "I've completed the IBM Data Science Professional Certificate, Google Data Analytics Professional Certificate, IBM Full Stack Development, and more.",
  "contact": "You can contact me using the contact form available on the website. I'll get back to you soon!",
  "education": "I graduated with a BSc in Computer Science from Government Victoria College with a CGPA of 8.525 (85%).",
  "experience": "I’ve interned at Afame Technologies and Code Alpha as a Web Developer, gaining experience in both front-end and back-end technologies.",
  "hobbies": "Outside of coding, I enjoy playing table tennis, staying up to date with tech trends, and working on ML side projects.",
  "projects": "My portfolio includes projects like a Sign Language to Text app using EfficientNet, Emotion Recognition with CNN, and a Website Builder using PyQt and Electron.",
  "resume": "You can download my resume from the portfolio or request it through the contact form.",
  "skills": "I'm skilled in Python, SQL, JavaScript, Flask, Pandas, Scikit-learn, and ML model deployment.",
  "tech_stack": "My tech stack includes Python, HTML/CSS/JS, Flask, PyTorch, TensorFlow, SQLite, Git, and tools like Jupyter and Tableau.",
  "fallback": "Sorry, I didn't quite get that. Could you please rephrase your question?"
};

// ==== Toggle Events ====
toggleBtn.addEventListener('click', () => chatbot.classList.add('show'));
closeBtn.addEventListener('click', () => chatbot.classList.remove('show'));
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });

// ==== Message Handling ====
async function sendMessage() {
  const msg = userInput.value.trim().toLowerCase();
  if (!msg) return;

  appendMessage('user', msg);
  userInput.value = '';

  // Handle greetings locally
  if (greetings.includes(msg)) {
    return simulateBotTyping("Hello! 👋 How can I help you today?");
  }

  // Handle goodbyes locally
  if (goodbyes.includes(msg)) {
    return simulateBotTyping("Goodbye! Have a great day ahead! 😊");
  }

  // Detect gibberish
  for (const pattern of gibberishPatterns) {
    if (pattern.test(msg)) {
      return simulateBotTyping("Hmm... that doesn’t seem like a valid question. 🤔 Try something else?");
    }
  }

    // Handle help message
  if (msg === "help") {
        const helpText = `You can ask me about:\n
    - About Me
    - Education
    - Experience
    - Projects
    - Certifications
    - Skills
    - Tech Stack
    - Resume
    - Contact
    - Hobbies

    Just type any of the above topics! 😊`;
        return simulateBotTyping(helpText);
      }


  // API fallback
  try {
    simulateBotTyping(); // Show typing first
    const res = await fetch("https://afzal12345-my-chatbot-backend.hf.space/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: msg })
    });

    const data = await res.json();
    const intent = data.intent || "fallback";
    const reply = responseDictionary[intent] || responseDictionary["fallback"];

    // Wait briefly to simulate typing
    setTimeout(() => {
      removeTypingIndicator();
      appendMessage("bot", reply);
    }, 1000);

  } catch (err) {
    removeTypingIndicator();
    appendMessage("bot", "Oops! Unable to reach the server right now.");
  }
}


// ==== Append Message to Chat ====
function appendMessage(sender, text) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message', sender);
  msgDiv.innerText = text;
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function simulateBotTyping(text = null) {
  // Show animated typing indicator
  const typingDiv = document.createElement('div');
  typingDiv.classList.add('message', 'bot');
  typingDiv.id = 'typing-indicator';

  const typingText = document.createElement('span');
  typingText.classList.add('typing-dots');
  typingText.innerHTML = `<span>.</span><span>.</span><span>.</span>`;

  typingDiv.appendChild(typingText);
  chatMessages.appendChild(typingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  if (text) {
    setTimeout(() => {
      removeTypingIndicator();
      appendMessage('bot', text);
    }, 1500); // Wait a bit longer for animation feel
  }
}


function removeTypingIndicator() {
  const typing = document.getElementById('typing-indicator');
  if (typing) typing.remove();
}

