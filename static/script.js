const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

let userMessage = null; // Variable to store user's message
const API_KEY = "PASTE-YOUR-API-KEY"; // Paste your API key here
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    // Create a chat <li> element with passed message and className
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi; // return chat <li> element
}

const generateResponse = (chatElement) => {
    const messageElement = chatElement.querySelector("p");
    
    const responses = {
        greeting: [
            "Hello! How can I assist you?",
            "Hi there! What can I do for you today?",
            "Hey! How may I help you?",
            "Good day! What brings you here?",
            "Hi! What can I do to make your day better?",
            "Hi! How can I be of service?",
        ],
        hr: [
            "Hello HR! How can I assist you today?",
            "Hey HR! What do you need help with?",
            "Hi HR! How may I assist you?",
            "Good to see you HR! How can I support you?",
            "Hi there HR! How's your day going?",
        ],
        developer: [
            "Hey Developer! What can I do for you?",
            "Hello Developer! How can I help you?",
            "Hi Developer! How may I assist you?",
            "Hey there Developer! Any coding challenges on your mind?",
            "Hi Developer! What tech stack are you working with?",
            "Hello Developer! How's your latest project going?",
        ],
        feedback: [
            "Thanks a lot for your feedback! We appreciate it.",
            "Your feedback is valuable to us. Anything specific you'd like to share?",
            "Noted! If you have more feedback, feel free to share.",
            "Your feedback helps us improve. Anything else on your mind?",
        ],
        help: [
            "Absolutely! I'm here to help. What do you need assistance with?",
            "Need a hand? I'm ready to help. Just let me know.",
            "How can I assist you today? Feel free to ask for help.",
            "If you have any questions, I'm here to provide answers. Ask away!",
        ],
        default: ["I'm just a bot, but I'm doing well! How about you? How can I assist you today?",
        "Not much, just here to help. What's up with you? How can I assist you?",
        "Hmm, I might have misunderstood. Can you please rephrase that?",
        "No worries! Let me know where you're stuck, and I'll do my best to assist you.",
        "No problem! If there's something specific you're unsure about, feel free to ask.",
        "You're in control! Ask me about job roles, resumes, or anything HR-related. How can I assist you?",
        "Absolutely! Specify your criteria or keywords, and I'll find the perfect resumes for you.",
        "Sure thing! What criteria or keywords would you like to use for fetching resumes?",
        "Of course! Let me know the criteria or keywords, and I'll get those resumes for you.",
        "Certainly! Provide the job role or industry you're interested in, and I'll fetch the job description for you."]
    };
    
    

    // Identify the type of user input and select a response
    let responseType = "default";
    if (userMessage.toLowerCase().includes("hr")) {
        responseType = "hr";
    } else if (userMessage.toLowerCase().includes("developer")) {
        responseType = "developer";
    } else if (userMessage.toLowerCase().includes("hello") || userMessage.toLowerCase().includes("hi")) {
        responseType = "greeting";
    }

    // Randomly select a response for the identified type
    const selectedResponse = responses[responseType][Math.floor(Math.random() * responses[responseType].length)];
    messageElement.textContent = selectedResponse;
    
    // Scroll to the bottom of the chatbox
    chatbox.scrollTo(0, chatbox.scrollHeight);
}
const handleChat = () => {
    userMessage = chatInput.value.trim(); // Get user entered message and remove extra whitespace
    if(!userMessage) return;

    // Clear the input textarea and set its height to default
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    // Append the user's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);
    
    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}

chatInput.addEventListener("input", () => {
    // Adjust the height of the input textarea based on its content
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    // If Enter key is pressed without Shift key and the window 
    // width is greater than 800px, handle the chat
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));

// Additional File Upload JavaScript
fileUploadInput.addEventListener('change', (event) => {
  const selectedFile = event.target.files[0];

  if (selectedFile) {
    fileInfoParagraph.textContent = `Selected File: ${selectedFile.name}`;
  } else {
    fileInfoParagraph.textContent = 'No file selected';
  }
});

document.addEventListener('DOMContentLoaded', function () {
    const loadingContainer = document.getElementById('loading-container');
    const processBtn = document.getElementById('process-btn');
    const resumeDashboard = document.querySelector('.resume-dashboard');

    loadingContainer.style.display = 'none'; // Initially hide loading container

    processBtn.addEventListener('click', function () {
        console.log('Process button clicked');
        loadingContainer.style.display = 'block'; // Show loading container
        resumeDashboard.style.display = 'none'; // Hide resume dashboard

        fetch('/process', {
            method: 'POST',
            body: new FormData(document.getElementById('upload-form')), // Assuming your upload form has an id of 'upload-form'
        })
            .then(response => response.json())
            .then(data => {
                console.log('Response received:', data);

                // Check if processing is done and display the dashboard
                if (data.status === 'done') {
                    loadingContainer.style.display = 'none'; // Hide loading container
                    resumeDashboard.style.display = 'block'; // Show resume dashboard

                    // Render the ranking results if available
                    if (data.ranking_result) {
                        const resumeResults = document.getElementById('resume-results');
                        resumeResults.innerHTML = ''; // Clear previous results

                        data.ranking_result.forEach(result => {
                            const resumeEntry = document.createElement('div');
                            resumeEntry.textContent = `${result.Name}: ${result.Similarity}%`;
                            resumeResults.appendChild(resumeEntry);
                        });
                    }
                }
            })
            .catch(error => {
                console.error('Error processing resumes:', error);
                // Handle error
            });
    });
});

