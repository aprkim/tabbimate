// State management
const state = {
    selectedLanguage: null,
    currentView: 'language-selection'
};

// User database - structured format for easy expansion
const users = [
    {
        name: "April",
        location: { top: "32%", left: "18%" }, // Berkeley
        languages: {
            english: "Professional",
            spanish: "Beginner",
            korean: "Native"
        },
        practiceLevel: "Professional",
        interests: ["Parenting", "AI", "Cooking"]
    },
    {
        name: "Marty",
        location: { top: "40%", left: "22%" }, // US Midwest
        languages: {
            english: "Native",
            spanish: "Intermediate",
            korean: "Beginner"
        },
        practiceLevel: "Native",
        interests: ["Music", "Running", "Tech"]
    },
    {
        name: "Sofia",
        location: { top: "65%", left: "30%" }, // Colombia
        languages: {
            english: "Intermediate",
            spanish: "Native"
        },
        practiceLevel: "Intermediate",
        interests: ["Travel", "Photography"]
    },
    {
        name: "Kenji",
        location: { top: "38%", left: "82%" }, // Japan
        languages: {
            english: "Basic",
            japanese: "Native"
        },
        practiceLevel: "Basic",
        interests: ["Gaming", "Anime"]
    },
    {
        name: "Hyejin",
        location: { top: "42%", left: "76%" }, // Korea
        languages: {
            english: "Professional",
            korean: "Native"
        },
        practiceLevel: "Professional",
        interests: ["Baking", "Pilates"]
    },
    {
        name: "Carlos",
        location: { top: "50%", left: "26%" }, // Mexico
        languages: {
            english: "Basic",
            spanish: "Native"
        },
        practiceLevel: "Basic",
        interests: ["Soccer", "Cooking"]
    },
    {
        name: "Ravi",
        location: { top: "47%", left: "70%" }, // India
        languages: {
            english: "Professional",
            hindi: "Native"
        },
        practiceLevel: "Professional",
        interests: ["Cricket", "Startups"]
    },
    {
        name: "Maria",
        location: { top: "60%", left: "85%" }, // Philippines
        languages: {
            english: "Intermediate",
            filipino: "Native"
        },
        practiceLevel: "Intermediate",
        interests: ["Singing", "Volunteering"]
    },
    {
        name: "Liam",
        location: { top: "80%", left: "90%" }, // Australia
        languages: {
            english: "Native"
        },
        practiceLevel: "Native",
        interests: ["Surfing", "Beach", "Travel"]
    },
    {
        name: "Emma",
        location: { top: "52%", left: "48%" }, // Europe
        languages: {
            english: "Native",
            french: "Professional"
        },
        practiceLevel: "Professional",
        interests: ["Art", "Wine", "History"]
    }
];

// Helper function to format languages for display
function formatLanguages(languagesObj) {
    return Object.entries(languagesObj)
        .map(([lang, level]) => `${lang.charAt(0).toUpperCase() + lang.slice(1)} (${level})`)
        .join(', ');
}

// Initialize the page
function init() {
    renderDots();
    setupLanguageButtons();
    setupLevelButtons();
    setupBackButton();
    setupCardDrag();
    setupLanguageRequest();
}

// Store dot and tooltip references for filtering
const userDots = [];

// Render user dots on the map
function renderDots() {
    const container = document.getElementById('dots-container');
    console.log('Rendering dots. Container:', container);
    console.log('Number of users:', users.length);
    
    users.forEach((user, index) => {
        console.log(`Creating dot ${index + 1} for ${user.name} at`, user.location);
        
        // Create dot
        const dot = document.createElement('div');
        dot.className = 'user-dot';
        dot.style.top = user.location.top;
        dot.style.left = user.location.left;
        
        // Create tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.innerHTML = `
            <div class="tooltip-name">${user.name}</div>
            <div class="tooltip-languages">${formatLanguages(user.languages)}</div>
            <div class="tooltip-interests">Interests: ${user.interests.join(', ')}</div>
        `;
        
        // Add hover events
        dot.addEventListener('mouseenter', (e) => {
            console.log('Mouse entered dot for:', user.name);
            showTooltip(tooltip, dot);
        });
        
        dot.addEventListener('mouseleave', () => {
            console.log('Mouse left dot for:', user.name);
            tooltip.classList.remove('visible');
        });
        
        container.appendChild(dot);
        document.body.appendChild(tooltip); // Append to body instead of container
        
        // Store reference for filtering
        userDots.push({ user, dot, tooltip });
        
        console.log(`Dot ${index + 1} appended to container`);
    });
    
    console.log('All dots rendered. Total children in container:', container.children.length);
}

// Filter dots by selected language
function filterDotsByLanguage(selectedLanguage) {
    const langKey = selectedLanguage.toLowerCase();
    
    console.log(`Filtering dots for language: ${selectedLanguage}`);
    
    userDots.forEach(({ user, dot, tooltip }) => {
        // Check if user speaks the selected language
        const speaksLanguage = user.languages.hasOwnProperty(langKey);
        
        if (speaksLanguage) {
            dot.style.display = 'block';
            console.log(`${user.name} speaks ${selectedLanguage} - showing dot`);
        } else {
            dot.style.display = 'none';
            tooltip.classList.remove('visible'); // Hide tooltip if dot is hidden
            console.log(`${user.name} does NOT speak ${selectedLanguage} - hiding dot`);
        }
    });
}

// Show tooltip near dot
function showTooltip(tooltip, dot) {
    const dotRect = dot.getBoundingClientRect();
    const tooltipWidth = 250; // approximate
    const tooltipHeight = 100; // approximate
    
    console.log('showTooltip called. Dot position:', dotRect);
    
    // Default position: to the right and slightly above
    let top = dotRect.top - tooltipHeight / 2;
    let left = dotRect.right + 12;
    
    // Adjust if too close to right edge
    if (left + tooltipWidth > window.innerWidth) {
        left = dotRect.left - tooltipWidth - 12;
    }
    
    // Adjust if too close to top
    if (top < 10) {
        top = 10;
    }
    
    // Adjust if too close to bottom
    if (top + tooltipHeight > window.innerHeight) {
        top = window.innerHeight - tooltipHeight - 10;
    }
    
    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
    tooltip.style.position = 'fixed';
    tooltip.style.zIndex = '10001';
    tooltip.style.display = 'block';
    tooltip.classList.add('visible');
    
    console.log('Tooltip positioned at:', { top, left });
    console.log('Tooltip classes:', tooltip.className);
    console.log('Tooltip visible?', window.getComputedStyle(tooltip).opacity);
}

// Setup language button handlers
function setupLanguageButtons() {
    const languageButtons = document.querySelectorAll('.language-btn');
    
    languageButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const language = btn.getAttribute('data-language');
            selectLanguage(language);
        });
    });
}

// Handle language selection
function selectLanguage(language) {
    state.selectedLanguage = language;
    state.currentView = 'session-levels';
    
    // Update the selected language text
    document.getElementById('selected-language').textContent = language;
    
    // Filter dots based on selected language
    filterDotsByLanguage(language);
    
    // Transition between views
    const languageView = document.getElementById('language-selection');
    const levelsView = document.getElementById('session-levels');
    
    // Fade out language selection
    languageView.classList.add('fade-out');
    
    setTimeout(() => {
        languageView.classList.add('hidden');
        languageView.classList.remove('fade-out');
        
        // Fade in session levels
        levelsView.classList.remove('hidden');
        setTimeout(() => {
            levelsView.classList.add('fade-in');
        }, 10);
    }, 300);
}

// Setup level button handlers
function setupLevelButtons() {
    const levelButtons = document.querySelectorAll('.level-btn');
    
    levelButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const level = btn.getAttribute('data-level');
            const duration = parseInt(btn.getAttribute('data-duration'));
            selectLevel(level, duration);
        });
    });
}

// Handle level selection
function selectLevel(level, durationMinutes) {
    const selection = {
        language: state.selectedLanguage,
        level: level,
        durationMinutes: durationMinutes
    };
    
    console.log('Session selection:', selection);
    
    // Find a match based on selected language and level
    const matchedUser = findMatch(state.selectedLanguage, level);
    
    if (matchedUser) {
        console.log('Matched with:', matchedUser.name);
        startVideoChat(matchedUser);
    } else {
        console.log('No match found');
        alert('No available users for this level. Please try another!');
    }
}

// Find a matching user
function findMatch(selectedLanguage, level) {
    const langKey = selectedLanguage.toLowerCase();
    
    // Filter users who speak the selected language
    const availableUsers = users.filter(user => {
        // Skip April (the current user)
        if (user.name === 'April') return false;
        
        // Check if they speak the language
        return user.languages.hasOwnProperty(langKey);
    });
    
    console.log('Available users for matching:', availableUsers.map(u => u.name));
    
    if (availableUsers.length === 0) return null;
    
    // For "Talk with Native" level, prioritize native speakers
    if (level === 'Native') {
        const nativeUsers = availableUsers.filter(user => 
            user.languages[langKey] === 'Native'
        );
        if (nativeUsers.length > 0) {
            return nativeUsers[Math.floor(Math.random() * nativeUsers.length)];
        }
    }
    
    // Otherwise return a random match
    return availableUsers[Math.floor(Math.random() * availableUsers.length)];
}

// Store current matched user
let currentMatchedUser = null;

// Favorites system - stores user favorites in localStorage
const FavoritesManager = {
    getFavorites() {
        const favorites = localStorage.getItem('tabbimate_favorites');
        return favorites ? JSON.parse(favorites) : {};
    },
    
    isFavorited(username) {
        const favorites = this.getFavorites();
        return !!favorites[username];
    },
    
    addFavorite(username) {
        const favorites = this.getFavorites();
        favorites[username] = {
            addedDate: new Date().toISOString(),
            sessionCount: favorites[username] ? favorites[username].sessionCount + 1 : 1
        };
        localStorage.setItem('tabbimate_favorites', JSON.stringify(favorites));
        return favorites[username];
    },
    
    removeFavorite(username) {
        const favorites = this.getFavorites();
        delete favorites[username];
        localStorage.setItem('tabbimate_favorites', JSON.stringify(favorites));
    },
    
    getFavoriteData(username) {
        const favorites = this.getFavorites();
        return favorites[username] || null;
    },
    
    toggleFavorite(username) {
        if (this.isFavorited(username)) {
            this.removeFavorite(username);
            return false;
        } else {
            this.addFavorite(username);
            return true;
        }
    }
};

// Custom Modal Functions
function showModal(title, message, buttons = []) {
    return new Promise((resolve) => {
        const overlay = document.getElementById('modal-overlay');
        const titleEl = document.getElementById('modal-title');
        const bodyEl = document.getElementById('modal-body');
        const footerEl = document.getElementById('modal-footer');
        
        titleEl.textContent = title;
        bodyEl.innerHTML = typeof message === 'string' ? `<p>${message}</p>` : '';
        if (typeof message === 'object' && message.html) {
            bodyEl.innerHTML = message.html;
        }
        
        // Clear and setup buttons
        footerEl.innerHTML = '';
        buttons.forEach(btn => {
            const button = document.createElement('button');
            button.className = `modal-btn ${btn.className || 'modal-btn-secondary'}`;
            button.textContent = btn.text;
            button.onclick = () => {
                overlay.classList.add('hidden');
                resolve(btn.value);
            };
            footerEl.appendChild(button);
        });
        
        overlay.classList.remove('hidden');
    });
}

function customAlert(message, title = 'TabbiMate') {
    return showModal(title, message, [
        { text: 'OK', value: true, className: 'modal-btn-primary' }
    ]);
}

function customConfirm(message, title = 'Confirm') {
    return showModal(title, message, [
        { text: 'Cancel', value: false, className: 'modal-btn-secondary' },
        { text: 'OK', value: true, className: 'modal-btn-primary' }
    ]);
}

function customPrompt(message, title = 'Input', defaultValue = '') {
    return new Promise((resolve) => {
        const overlay = document.getElementById('modal-overlay');
        const titleEl = document.getElementById('modal-title');
        const bodyEl = document.getElementById('modal-body');
        const footerEl = document.getElementById('modal-footer');
        
        titleEl.textContent = title;
        bodyEl.innerHTML = `
            <p>${message}</p>
            <textarea class="modal-input modal-textarea" id="modal-prompt-input" placeholder="Enter your response...">${defaultValue}</textarea>
        `;
        
        footerEl.innerHTML = '';
        
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'modal-btn modal-btn-secondary';
        cancelBtn.textContent = 'Cancel';
        cancelBtn.onclick = () => {
            overlay.classList.add('hidden');
            resolve(null);
        };
        
        const okBtn = document.createElement('button');
        okBtn.className = 'modal-btn modal-btn-primary';
        okBtn.textContent = 'Submit';
        okBtn.onclick = () => {
            const input = document.getElementById('modal-prompt-input');
            overlay.classList.add('hidden');
            resolve(input.value);
        };
        
        footerEl.appendChild(cancelBtn);
        footerEl.appendChild(okBtn);
        
        overlay.classList.remove('hidden');
        
        // Focus input after a brief delay
        setTimeout(() => {
            const input = document.getElementById('modal-prompt-input');
            if (input) input.focus();
        }, 100);
    });
}

// Start video chat with matched user
function startVideoChat(matchedUser) {
    console.log('Starting video chat with:', matchedUser.name);
    
    // Store matched user
    currentMatchedUser = matchedUser;
    
    // Update UI with matched user info
    document.getElementById('matched-user-name').textContent = matchedUser.name;
    document.getElementById('remote-name').textContent = matchedUser.name.toLowerCase();
    
    // Update Help menu with user's name
    document.getElementById('block-username').textContent = matchedUser.name;
    document.getElementById('report-username').textContent = matchedUser.name;
    
    // Update session count and favorite status
    updateSessionInfo(matchedUser.name);
    
    // Hide map and card, show video chat
    document.querySelector('.map-container').style.display = 'none';
    document.querySelector('.center-container').style.display = 'none';
    document.getElementById('video-chat').classList.remove('hidden');
    
    // Setup end call button and timer
    setupVideoCallControls();
    startCallTimer();
}

// Update session count and favorite button
function updateSessionInfo(username) {
    const favoriteData = FavoritesManager.getFavoriteData(username);
    const sessionCountEl = document.getElementById('session-count');
    const favoriteBtn = document.getElementById('favorite-btn');
    const tooltip = favoriteBtn.querySelector('.favorite-tooltip');
    
    if (favoriteData) {
        sessionCountEl.textContent = `${favoriteData.sessionCount} sessions`;
        favoriteBtn.classList.add('favorited');
        tooltip.textContent = 'Remove from Favorites';
    } else {
        sessionCountEl.textContent = '1 session';
        favoriteBtn.classList.remove('favorited');
        tooltip.textContent = 'Add to Favorites';
    }
}

// Setup favorite button
function setupFavoriteButton() {
    const favoriteBtn = document.getElementById('favorite-btn');
    const tooltip = favoriteBtn.querySelector('.favorite-tooltip');
    
    favoriteBtn.addEventListener('click', async () => {
        if (!currentMatchedUser) return;
        
        const username = currentMatchedUser.name;
        const isFavorited = FavoritesManager.toggleFavorite(username);
        
        if (isFavorited) {
            favoriteBtn.classList.add('favorited');
            tooltip.textContent = 'Remove from Favorites';
            await customAlert(`${username} has been added to your favorites! You'll be more likely to match with them in the future.`, 'Added to Favorites');
        } else {
            favoriteBtn.classList.remove('favorited');
            tooltip.textContent = 'Add to Favorites';
            await customAlert(`${username} has been removed from your favorites.`, 'Removed from Favorites');
        }
        
        // Update session count
        updateSessionInfo(username);
    });
}

// Setup username click to show profile
function setupUsernameClick() {
    const partnerNameEl = document.getElementById('matched-user-name');
    
    partnerNameEl.addEventListener('click', () => {
        if (!currentMatchedUser) return;
        showUserProfile(currentMatchedUser);
    });
}

// Show user profile in a modal-like tooltip
function showUserProfile(user) {
    const languages = formatLanguages(user.languages);
    const interests = user.interests.join(', ');
    
    const profileHTML = `
        <div style="text-align: left;">
            <div style="margin-bottom: 16px;">
                <h3 style="margin: 0 0 8px 0; color: #333; font-size: 20px;">${user.name}</h3>
                <p style="margin: 0; color: #666; font-size: 14px;">📍 ${getLocationName(user)}</p>
            </div>
            
            <div style="margin-bottom: 16px;">
                <p style="margin: 0 0 8px 0; color: #333; font-weight: 600; font-size: 14px;">Languages:</p>
                <p style="margin: 0; color: #666; font-size: 14px;">${languages}</p>
            </div>
            
            <div style="margin-bottom: 16px;">
                <p style="margin: 0 0 8px 0; color: #333; font-weight: 600; font-size: 14px;">Interests:</p>
                <p style="margin: 0; color: #666; font-size: 14px;">${interests}</p>
            </div>
            
            <div style="margin-bottom: 0;">
                <p style="margin: 0 0 8px 0; color: #333; font-weight: 600; font-size: 14px;">Practice Level:</p>
                <p style="margin: 0; color: #666; font-size: 14px;">${user.practiceLevel}</p>
            </div>
        </div>
    `;
    
    customAlert({ html: profileHTML }, `${user.name}'s Profile`);
}

// Helper function to get readable location name
function getLocationName(user) {
    // Map coordinates to city names (simplified for demo)
    const locationMap = {
        'April': 'Berkeley, CA',
        'Marty': 'Chicago, IL',
        'Sofia': 'Bogotá, Colombia',
        'Kenji': 'Tokyo, Japan',
        'Hyejin': 'Seoul, Korea',
        'Carlos': 'Mexico City, Mexico',
        'Ravi': 'Mumbai, India',
        'Maria': 'Manila, Philippines',
        'Liam': 'Sydney, Australia',
        'Emma': 'London, UK'
    };
    
    return locationMap[user.name] || 'Unknown';
}

// Setup back button
function setupBackButton() {
    const backBtn = document.getElementById('back-to-languages');
    
    backBtn.addEventListener('click', (e) => {
        e.preventDefault();
        goBackToLanguages();
    });
}

// Go back to language selection
function goBackToLanguages() {
    state.currentView = 'language-selection';
    state.selectedLanguage = null;
    
    // Show all dots again
    showAllDots();
    
    const languageView = document.getElementById('language-selection');
    const levelsView = document.getElementById('session-levels');
    
    // Fade out levels view
    levelsView.classList.remove('fade-in');
    levelsView.classList.add('fade-out');
    
    setTimeout(() => {
        levelsView.classList.add('hidden');
        levelsView.classList.remove('fade-out');
        
        // Fade in language selection
        languageView.classList.remove('hidden');
        setTimeout(() => {
            languageView.classList.add('fade-in');
        }, 10);
    }, 300);
}

// Show all dots (when no language is selected)
function showAllDots() {
    console.log('Showing all dots');
    userDots.forEach(({ dot }) => {
        dot.style.display = 'block';
    });
}

// Setup video call controls
function setupVideoCallControls() {
    const leaveBtn = document.getElementById('leave-call');
    
    // Remove old listener if exists
    const newLeaveBtn = leaveBtn.cloneNode(true);
    leaveBtn.parentNode.replaceChild(newLeaveBtn, leaveBtn);
    
    newLeaveBtn.addEventListener('click', () => {
        endVideoChat();
    });
    
    // Setup control buttons
    setupToggleButtons();
    setupAIChatBox();
    setupMessageChannel();
    setupHelpMenu();
    setupFavoriteButton();
    setupUsernameClick();
}

// Setup toggle buttons (video, audio, AI, chat, share)
function setupToggleButtons() {
    // Video toggle
    document.getElementById('toggle-camera').addEventListener('click', function() {
        const isActive = this.dataset.active === 'true';
        this.dataset.active = !isActive;
        console.log('Video:', !isActive ? 'ON' : 'OFF');
    });
    
    // Audio toggle
    document.getElementById('toggle-mic').addEventListener('click', function() {
        const isActive = this.dataset.active === 'true';
        this.dataset.active = !isActive;
        console.log('Audio:', !isActive ? 'ON' : 'OFF');
    });
    
    // AI chat toggle
    document.getElementById('toggle-ai').addEventListener('click', function() {
        const isActive = this.dataset.active === 'true';
        this.dataset.active = !isActive;
        
        const aiChatBox = document.getElementById('ai-chat-box');
        const messageChannel = document.getElementById('message-channel');
        
        if (!isActive) {
            aiChatBox.classList.remove('hidden');
            messageChannel.classList.add('hidden');
            document.getElementById('toggle-chat').dataset.active = 'false';
        } else {
            aiChatBox.classList.add('hidden');
        }
        
        console.log('AI Chat:', !isActive ? 'ON' : 'OFF');
    });
    
    // Message channel toggle
    document.getElementById('toggle-chat').addEventListener('click', function() {
        const isActive = this.dataset.active === 'true';
        this.dataset.active = !isActive;
        
        const messageChannel = document.getElementById('message-channel');
        const aiChatBox = document.getElementById('ai-chat-box');
        
        if (!isActive) {
            messageChannel.classList.remove('hidden');
            aiChatBox.classList.add('hidden');
            document.getElementById('toggle-ai').dataset.active = 'false';
        } else {
            messageChannel.classList.add('hidden');
        }
        
        console.log('Message Channel:', !isActive ? 'ON' : 'OFF');
    });
    
    // Share screen
    document.getElementById('toggle-share').addEventListener('click', function() {
        console.log('Share screen clicked');
        alert('Screen sharing functionality will be added here!');
    });
}

// Setup AI Chat Box with drag functionality
function setupAIChatBox() {
    const chatBox = document.getElementById('ai-chat-box');
    const chatHeader = document.getElementById('ai-chat-header');
    const closeBtn = document.getElementById('close-ai-chat');
    const popoutBtn = document.getElementById('popout-ai-chat');
    const sendBtn = document.getElementById('send-ai-message');
    const input = document.getElementById('ai-input');
    
    // Make draggable
    makeDraggable(chatBox, chatHeader);
    
    // Pop-out button
    popoutBtn.addEventListener('click', () => {
        openAIPopout();
    });
    
    // Close button
    closeBtn.addEventListener('click', () => {
        chatBox.classList.add('hidden');
        document.getElementById('toggle-ai').dataset.active = 'false';
    });
    
    // Send message
    const sendAIMessage = () => {
        const message = input.value.trim();
        if (message) {
            addAIMessage(message, 'user');
            input.value = '';
            
            // Simulate AI response
            setTimeout(() => {
                addAIMessage('I understand your question. How can I assist you with your language practice?', 'ai');
            }, 1000);
        }
    };
    
    sendBtn.addEventListener('click', sendAIMessage);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendAIMessage();
    });
}

// Open AI chat in a new pop-out window
let aiPopoutWindow = null;
function openAIPopout() {
    // Close the in-page chat box
    document.getElementById('ai-chat-box').classList.add('hidden');
    document.getElementById('toggle-ai').dataset.active = 'false';
    
    // Check if window is already open
    if (aiPopoutWindow && !aiPopoutWindow.closed) {
        aiPopoutWindow.focus();
        return;
    }
    
    // Open new window
    const width = 400;
    const height = 600;
    const left = window.screenX + window.outerWidth - width - 50;
    const top = window.screenY + 100;
    
    aiPopoutWindow = window.open(
        '',
        'AI Assistant',
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=no`
    );
    
    if (!aiPopoutWindow) {
        alert('Pop-up blocked! Please allow pop-ups for this site to use the AI Assistant in a separate window.');
        return;
    }
    
    // Write the HTML content to the new window
    aiPopoutWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>AI Assistant - TabbiMate</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                    background: white;
                    display: flex;
                    flex-direction: column;
                    height: 100vh;
                    overflow: hidden;
                }
                
                .chat-header {
                    padding: 16px 20px;
                    background: #f5f5f5;
                    border-bottom: 1px solid #e5e5e5;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .chat-title {
                    font-weight: 600;
                    font-size: 16px;
                    color: #333;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .chat-messages {
                    flex: 1;
                    overflow-y: auto;
                    padding: 16px;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                
                .chat-message {
                    padding: 10px 14px;
                    border-radius: 12px;
                    max-width: 85%;
                    font-size: 14px;
                    line-height: 1.4;
                }
                
                .ai-message {
                    background: #f0f0f0;
                    align-self: flex-start;
                }
                
                .user-message {
                    background: #BF3143;
                    color: white;
                    align-self: flex-end;
                }
                
                .chat-input-container {
                    padding: 12px 16px;
                    border-top: 1px solid #e5e5e5;
                    display: flex;
                    gap: 8px;
                }
                
                .chat-input {
                    flex: 1;
                    padding: 10px 14px;
                    border: 1px solid #d1d1d1;
                    border-radius: 8px;
                    font-size: 14px;
                    font-family: inherit;
                    outline: none;
                }
                
                .chat-input:focus {
                    border-color: #BF3143;
                }
                
                .send-btn {
                    background: #BF3143;
                    color: white;
                    border: none;
                    padding: 10px 16px;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: background 0.2s ease;
                    font-size: 16px;
                }
                
                .send-btn:hover {
                    background: #a02838;
                }
            </style>
        </head>
        <body>
            <div class="chat-header">
                <span class="chat-title">
                    <svg style="width: 18px; height: 18px; stroke: currentColor; fill: none; stroke-width: 2;" viewBox="0 0 24 24">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                        <circle cx="9" cy="10" r="1" fill="currentColor"/>
                        <circle cx="15" cy="10" r="1" fill="currentColor"/>
                        <path d="M9 14h6" stroke-linecap="round"/>
                    </svg>
                    AI Assistant
                </span>
            </div>
            <div class="chat-messages" id="messages">
                <div class="chat-message ai-message">
                    <p>Hi! I'm here to help with translations and corrections during your conversation.</p>
                </div>
            </div>
            <div class="chat-input-container">
                <input type="text" class="chat-input" placeholder="Ask AI for help..." id="input">
                <button class="send-btn" id="send">→</button>
            </div>
            
            <script>
                const input = document.getElementById('input');
                const sendBtn = document.getElementById('send');
                const messagesDiv = document.getElementById('messages');
                
                function addMessage(text, type) {
                    const messageEl = document.createElement('div');
                    messageEl.className = 'chat-message ' + type + '-message';
                    messageEl.innerHTML = '<p>' + text + '</p>';
                    messagesDiv.appendChild(messageEl);
                    messagesDiv.scrollTop = messagesDiv.scrollHeight;
                }
                
                function sendMessage() {
                    const message = input.value.trim();
                    if (message) {
                        addMessage(message, 'user');
                        input.value = '';
                        
                        // Simulate AI response
                        setTimeout(() => {
                            addMessage('I understand your question. How can I assist you with your language practice?', 'ai');
                        }, 1000);
                    }
                }
                
                sendBtn.addEventListener('click', sendMessage);
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') sendMessage();
                });
                
                // Focus input on load
                input.focus();
            </script>
        </body>
        </html>
    `);
    
    aiPopoutWindow.document.close();
}

// Open Message Chat in a new pop-out window
let chatPopoutWindow = null;
function openChatPopout() {
    // Close the in-page chat channel
    document.getElementById('message-channel').classList.add('hidden');
    document.getElementById('toggle-chat').dataset.active = 'false';
    
    // Check if window is already open
    if (chatPopoutWindow && !chatPopoutWindow.closed) {
        chatPopoutWindow.focus();
        return;
    }
    
    // Open new window
    const width = 400;
    const height = 600;
    const left = window.screenX + window.outerWidth - width - 50;
    const top = window.screenY + 100;
    
    chatPopoutWindow = window.open(
        '',
        'Messages - TabbiMate',
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=no`
    );
    
    if (!chatPopoutWindow) {
        alert('Pop-up blocked! Please allow pop-ups for this site to use Messages in a separate window.');
        return;
    }
    
    // Write the HTML content to the new window
    chatPopoutWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Messages - TabbiMate</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                    background: white;
                    display: flex;
                    flex-direction: column;
                    height: 100vh;
                    overflow: hidden;
                }
                
                .chat-header {
                    padding: 16px 20px;
                    background: #f5f5f5;
                    border-bottom: 1px solid #e5e5e5;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .chat-title {
                    font-weight: 600;
                    font-size: 16px;
                    color: #333;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .chat-messages {
                    flex: 1;
                    overflow-y: auto;
                    padding: 16px;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                
                .chat-message {
                    padding: 10px 14px;
                    border-radius: 12px;
                    max-width: 85%;
                    font-size: 14px;
                    line-height: 1.4;
                }
                
                .system-message {
                    background: #e8f4f8;
                    color: #666;
                    align-self: center;
                    font-size: 12px;
                    padding: 6px 12px;
                }
                
                .user-message {
                    background: #BF3143;
                    color: white;
                    align-self: flex-end;
                }
                
                .partner-message {
                    background: #f0f0f0;
                    align-self: flex-start;
                }
                
                .chat-input-container {
                    padding: 12px 16px;
                    border-top: 1px solid #e5e5e5;
                    display: flex;
                    gap: 8px;
                }
                
                .chat-input {
                    flex: 1;
                    padding: 10px 14px;
                    border: 1px solid #d1d1d1;
                    border-radius: 8px;
                    font-size: 14px;
                    font-family: inherit;
                    outline: none;
                }
                
                .chat-input:focus {
                    border-color: #BF3143;
                }
                
                .send-btn {
                    background: #BF3143;
                    color: white;
                    border: none;
                    padding: 10px 16px;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: background 0.2s ease;
                    font-size: 16px;
                }
                
                .send-btn:hover {
                    background: #a02838;
                }
            </style>
        </head>
        <body>
            <div class="chat-header">
                <span class="chat-title">
                    <svg style="width: 18px; height: 18px; stroke: currentColor; fill: none; stroke-width: 2;" viewBox="0 0 24 24">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                    </svg>
                    Messages
                </span>
            </div>
            <div class="chat-messages" id="messages">
                <div class="chat-message system-message">
                    <p>Chat started</p>
                </div>
            </div>
            <div class="chat-input-container">
                <input type="text" class="chat-input" placeholder="Type a message..." id="input">
                <button class="send-btn" id="send">→</button>
            </div>
            
            <script>
                const input = document.getElementById('input');
                const sendBtn = document.getElementById('send');
                const messagesDiv = document.getElementById('messages');
                
                function addMessage(text, type) {
                    const messageEl = document.createElement('div');
                    messageEl.className = 'chat-message ' + type + '-message';
                    messageEl.innerHTML = '<p>' + text + '</p>';
                    messagesDiv.appendChild(messageEl);
                    messagesDiv.scrollTop = messagesDiv.scrollHeight;
                }
                
                function sendMessage() {
                    const message = input.value.trim();
                    if (message) {
                        addMessage(message, 'user');
                        input.value = '';
                    }
                }
                
                sendBtn.addEventListener('click', sendMessage);
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') sendMessage();
                });
                
                // Focus input on load
                input.focus();
            </script>
        </body>
        </html>
    `);
    
    chatPopoutWindow.document.close();
}

// Setup Message Channel
function setupMessageChannel() {
    const channel = document.getElementById('message-channel');
    const closeBtn = document.getElementById('close-channel');
    const popoutBtn = document.getElementById('popout-channel');
    const sendBtn = document.getElementById('send-channel-message');
    const input = document.getElementById('channel-input');
    
    // Pop-out button
    popoutBtn.addEventListener('click', () => {
        openChatPopout();
    });
    
    // Close button
    closeBtn.addEventListener('click', () => {
        channel.classList.add('hidden');
        document.getElementById('toggle-chat').dataset.active = 'false';
    });
    
    // Send message
    const sendMessage = () => {
        const message = input.value.trim();
        if (message) {
            addChannelMessage(message, 'user');
            input.value = '';
        }
    };
    
    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
}

// Add message to AI chat
function addAIMessage(text, type) {
    const messagesDiv = document.getElementById('ai-messages');
    const messageEl = document.createElement('div');
    messageEl.className = `chat-message ${type}-message`;
    messageEl.innerHTML = `<p>${text}</p>`;
    messagesDiv.appendChild(messageEl);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Add message to channel
function addChannelMessage(text, type) {
    const messagesDiv = document.getElementById('channel-messages');
    const messageEl = document.createElement('div');
    messageEl.className = `chat-message ${type}-message`;
    messageEl.innerHTML = `<p>${text}</p>`;
    messagesDiv.appendChild(messageEl);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Make element draggable
function makeDraggable(element, handle) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    
    handle.onmousedown = dragMouseDown;
    
    function dragMouseDown(e) {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }
    
    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
        element.style.right = 'auto';
        element.style.bottom = 'auto';
    }
    
    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// Start call timer
let timerInterval;
function startCallTimer() {
    // Clear any existing timer
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    let seconds = 262; // 4:22 in seconds
    
    const updateTimer = () => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        document.getElementById('call-timer').textContent = `Ends in ${minutes}:${secs.toString().padStart(2, '0')}`;
        
        seconds--;
        
        if (seconds < 0) {
            clearInterval(timerInterval);
            endVideoChat();
        }
    };
    
    updateTimer(); // Update immediately
    timerInterval = setInterval(updateTimer, 1000);
}

// End video chat and return to language selection
function endVideoChat() {
    console.log('Ending video chat');
    
    // Clear timer
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    // Hide video chat and chat boxes
    document.getElementById('video-chat').classList.add('hidden');
    document.getElementById('ai-chat-box').classList.add('hidden');
    document.getElementById('message-channel').classList.add('hidden');
    
    // Show map and card again
    document.querySelector('.map-container').style.display = 'block';
    document.querySelector('.center-container').style.display = 'flex';
    
    // Reset to language selection view
    state.currentView = 'language-selection';
    state.selectedLanguage = null;
    
    const languageView = document.getElementById('language-selection');
    const levelsView = document.getElementById('session-levels');
    
    levelsView.classList.add('hidden');
    levelsView.classList.remove('fade-in');
    languageView.classList.remove('hidden');
    languageView.classList.add('fade-in');
    
    // Show all dots again
    showAllDots();
}

// Setup card drag functionality
function setupCardDrag() {
    const card = document.getElementById('main-card');
    const container = document.querySelector('.center-container');
    
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;
    
    card.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);
    
    // Touch events for mobile
    card.addEventListener('touchstart', dragStart);
    document.addEventListener('touchmove', drag);
    document.addEventListener('touchend', dragEnd);
    
    function dragStart(e) {
        // Only drag if clicking on the card itself or drag handle, not on buttons/inputs
        if (e.target.closest('button') || e.target.closest('a') || e.target.closest('input')) {
            return;
        }
        
        if (e.type === 'touchstart') {
            initialX = e.touches[0].clientX - xOffset;
            initialY = e.touches[0].clientY - yOffset;
        } else {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
        }
        
        isDragging = true;
        card.classList.add('dragging');
        
        // Remove centering
        container.style.justifyContent = 'flex-start';
        container.style.alignItems = 'flex-start';
    }
    
    function drag(e) {
        if (!isDragging) return;
        
        e.preventDefault();
        
        if (e.type === 'touchmove') {
            currentX = e.touches[0].clientX - initialX;
            currentY = e.touches[0].clientY - initialY;
        } else {
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
        }
        
        xOffset = currentX;
        yOffset = currentY;
        
        setTranslate(currentX, currentY, card);
    }
    
    function dragEnd(e) {
        if (!isDragging) return;
        
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
        card.classList.remove('dragging');
    }
    
    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate(${xPos}px, ${yPos}px)`;
    }
}

// Setup Help Menu
function setupHelpMenu() {
    const helpBtn = document.getElementById('help-btn');
    const helpMenu = document.getElementById('help-menu');
    const guidelinesBtn = document.getElementById('session-guidelines');
    const blockBtn = document.getElementById('block-user');
    const reportBtn = document.getElementById('report-user');
    
    // Toggle help menu
    helpBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        helpMenu.classList.toggle('hidden');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!helpMenu.contains(e.target) && e.target !== helpBtn) {
            helpMenu.classList.add('hidden');
        }
    });
    
    // Session Guidelines
    guidelinesBtn.addEventListener('click', () => {
        helpMenu.classList.add('hidden');
        showSessionGuidelines();
    });
    
    // Block User
    blockBtn.addEventListener('click', () => {
        helpMenu.classList.add('hidden');
        if (currentMatchedUser) {
            blockUser(currentMatchedUser.name);
        }
    });
    
    // Report User
    reportBtn.addEventListener('click', () => {
        helpMenu.classList.add('hidden');
        if (currentMatchedUser) {
            reportUser(currentMatchedUser.name);
        }
    });
}

// Show Session Guidelines
async function showSessionGuidelines() {
    const message = `Be respectful and kind to your language partner.

Practice the selected language during your session.

Use the AI assistant for real-time help and translations.`;
    
    await customAlert(message, 'Session Guidelines');
}

// Block User
async function blockUser(username) {
    const message = `Are you sure you want to block ${username}?

This will end the session immediately and you won't be matched with this user again.

This action cannot be undone.`;
    
    const confirmed = await showModal(`Block ${username}`, message, [
        { text: 'Cancel', value: false, className: 'modal-btn-secondary' },
        { text: 'Block', value: true, className: 'modal-btn-danger' }
    ]);
    
    if (confirmed) {
        console.log('Blocking user:', username);
        await customAlert(`${username} has been blocked.`, 'User Blocked');
        endVideoChat();
    }
}

// Report User
async function reportUser(username) {
    const reason = await customPrompt(
        `Please describe why you are reporting ${username}.`,
        `Report ${username}`,
        ''
    );
    
    if (reason && reason.trim()) {
        console.log('Reporting user:', username, 'Reason:', reason);
        
        await customAlert(`Thank you for your report. Our team will review it shortly.`, 'Report Submitted');
        
        // Optionally end the call
        const endCall = await customConfirm('Would you like to end this session now?', 'End Session');
        if (endCall) {
            endVideoChat();
        }
    }
}

// Language Request Management
const LanguageRequestManager = {
    saveRequest(language, email, notes) {
        const requests = this.getRequests();
        const newRequest = {
            id: Date.now(),
            language: language,
            email: email,
            notes: notes,
            timestamp: new Date().toISOString(),
            status: 'pending'
        };
        requests.push(newRequest);
        localStorage.setItem('tabbimate_language_requests', JSON.stringify(requests));
        return newRequest;
    },
    
    getRequests() {
        const requests = localStorage.getItem('tabbimate_language_requests');
        return requests ? JSON.parse(requests) : [];
    },
    
    getAllRequests() {
        return this.getRequests();
    }
};

// Setup Language Request Form
function setupLanguageRequest() {
    const requestLink = document.querySelector('.request-link');
    const modal = document.getElementById('language-request-modal');
    const cancelBtn = document.getElementById('cancel-request');
    const submitBtn = document.getElementById('submit-request');
    const form = document.getElementById('language-request-form');
    
    // Open modal
    requestLink.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.remove('hidden');
    });
    
    // Close modal
    cancelBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        form.reset();
    });
    
    // Submit request
    submitBtn.addEventListener('click', async () => {
        const language = document.getElementById('requested-language').value.trim();
        const email = document.getElementById('requester-email').value.trim();
        const notes = document.getElementById('additional-notes').value.trim();
        
        if (!language) {
            alert('Please enter a language name.');
            return;
        }
        
        // Save the request
        const request = LanguageRequestManager.saveRequest(language, email, notes);
        console.log('Language request saved:', request);
        
        // Close modal and reset form
        modal.classList.add('hidden');
        form.reset();
        
        // Show confirmation
        await customAlert(
            `Thank you for your request!\n\nWe've received your request for ${language}. We'll notify you when it becomes available.`,
            'Request Submitted'
        );
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
            form.reset();
        }
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

