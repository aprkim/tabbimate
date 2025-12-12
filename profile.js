// Profile data
let profileData = {
    userId: null,
    language: null,
    level: null,
    interests: []
};

// Initialize profile page
function init() {
    // Get user ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const urlUserId = urlParams.get('id');
    
    if (urlUserId) {
        profileData.userId = urlUserId;
        localStorage.setItem('tabbimate_user_id', urlUserId);
        
        // Update URL to clean format
        const basePath = window.location.pathname.includes('tabbimate') 
            ? '/tabbimate/profile' 
            : '/profile';
        const cleanUrl = `${basePath}/${urlUserId}`;
        window.history.replaceState({}, '', cleanUrl);
    } else {
        // Check if URL has ID in path format
        const pathParts = window.location.pathname.split('/');
        const lastPart = pathParts[pathParts.length - 1];
        
        if (lastPart && /^\d{8}$/.test(lastPart)) {
            profileData.userId = lastPart;
            localStorage.setItem('tabbimate_user_id', lastPart);
        } else {
            // No valid ID, redirect to home
            window.location.href = window.location.pathname.includes('tabbimate') 
                ? '/tabbimate/' 
                : '/';
            return;
        }
    }
    
    // Load profile data
    loadProfileData();
    
    // Setup event listeners
    setupEventListeners();
    
    // Setup map dots
    setupMapDots();
}

// Load profile data from localStorage
function loadProfileData() {
    // Check for new user onboarding data
    const newUserData = localStorage.getItem('tabbimate_new_user_data');
    if (newUserData) {
        try {
            const data = JSON.parse(newUserData);
            profileData = { ...profileData, ...data };
            localStorage.removeItem('tabbimate_new_user_data');
        } catch (error) {
            console.error('Error loading new user data:', error);
        }
    } else {
        // Load existing profile
        const storageKey = `tabbimate_profile_${profileData.userId}`;
        const stored = localStorage.getItem(storageKey);
        if (stored) {
            try {
                const data = JSON.parse(stored);
                profileData = { ...profileData, ...data };
            } catch (error) {
                console.error('Error loading profile:', error);
            }
        }
    }
    
    // Update UI with profile data
    updateProfileDisplay();
}

// Update profile display
function updateProfileDisplay() {
    console.log('Updating profile display with:', profileData);
    
    // Update language display
    const languageDisplay = document.getElementById('language-display');
    if (profileData.language && profileData.level) {
        // Get the second span (not the icon span)
        const textSpan = languageDisplay.querySelectorAll('span')[1];
        if (textSpan) {
            textSpan.textContent = `${profileData.language} • ${profileData.level}`;
        }
    }
    
    // Update interests display
    const interestsDisplay = document.getElementById('interests-display');
    if (profileData.interests && profileData.interests.length > 0) {
        // Get the second span (not the icon span)
        const textSpan = interestsDisplay.querySelectorAll('span')[1];
        if (textSpan) {
            textSpan.textContent = profileData.interests.join(', ');
        }
    }
}

// Setup event listeners
function setupEventListeners() {
    const startVideoBtn = document.getElementById('start-video-btn');
    
    if (startVideoBtn) {
        startVideoBtn.addEventListener('click', handleStartVideo);
    }
}

// Handle start video button - go to session page
function handleStartVideo() {
    // Save profile data
    const storageKey = `tabbimate_profile_${profileData.userId}`;
    localStorage.setItem(storageKey, JSON.stringify(profileData));
    
    // Store user data for the session
    localStorage.setItem('tabbimate_current_user', JSON.stringify({
        userId: profileData.userId,
        language: profileData.language,
        level: profileData.level,
        interests: profileData.interests
    }));
    
    // For now, create a mock matched user (in production, this would come from matching algorithm)
    // Pick a random user from a small set
    const mockUsers = [
        { name: "Marty", languages: { english: "Native", spanish: "Intermediate" }, interests: ["Music", "Running", "Tech"] },
        { name: "Sofia", languages: { english: "Intermediate", spanish: "Native" }, interests: ["Travel", "Art", "Cooking"] },
        { name: "Kenji", languages: { english: "Advanced", japanese: "Native" }, interests: ["Gaming", "Anime", "Tech"] }
    ];
    const randomMatchedUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
    localStorage.setItem('tabbimate_matched_user', JSON.stringify(randomMatchedUser));
    
    // Generate a session ID
    const sessionId = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    
    // Redirect to session page with session ID
    const basePath = window.location.pathname.includes('tabbimate') 
        ? '/tabbimate/session' 
        : '/session';
    window.location.href = `${basePath}/${sessionId}`;
}

// User database - same as app.html
const users = [
    {
        name: "April",
        location: { top: "32%", left: "18%" },
        languages: { english: "Professional", spanish: "Basic", korean: "Native" },
        practiceLevel: "Professional",
        interests: ["Parenting", "AI", "Cooking"]
    },
    {
        name: "Marty",
        location: { top: "40%", left: "22%" },
        languages: { english: "Native", spanish: "Intermediate", korean: "Basic" },
        practiceLevel: "Native",
        interests: ["Music", "Running", "Tech"]
    },
    {
        name: "Sofia",
        location: { top: "65%", left: "30%" },
        languages: { english: "Intermediate", spanish: "Native" },
        practiceLevel: "Intermediate",
        interests: ["Travel", "Photography"]
    },
    {
        name: "Kenji",
        location: { top: "38%", left: "82%" },
        languages: { english: "Basic", japanese: "Native" },
        practiceLevel: "Basic",
        interests: ["Gaming", "Anime"]
    },
    {
        name: "Hyejin",
        location: { top: "42%", left: "76%" },
        languages: { english: "Professional", korean: "Native" },
        practiceLevel: "Professional",
        interests: ["Baking", "Pilates"]
    },
    {
        name: "Carlos",
        location: { top: "50%", left: "26%" },
        languages: { english: "Basic", spanish: "Native" },
        practiceLevel: "Basic",
        interests: ["Soccer", "Cooking"]
    },
    {
        name: "Ravi",
        location: { top: "47%", left: "70%" },
        languages: { english: "Professional", hindi: "Native" },
        practiceLevel: "Professional",
        interests: ["Cricket", "Startups"]
    },
    {
        name: "Maria",
        location: { top: "60%", left: "85%" },
        languages: { english: "Intermediate", tagalog: "Native" },
        practiceLevel: "Intermediate",
        interests: ["K-pop", "Cooking"]
    }
];

// Setup map dots with hover tooltips
function setupMapDots() {
    const dotsContainer = document.getElementById('dots-container');
    if (!dotsContainer) return;

    users.forEach(user => {
        // Create dot
        const dot = document.createElement('div');
        dot.className = 'user-dot';
        dot.style.top = user.location.top;
        dot.style.left = user.location.left;
        
        // Create tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'user-tooltip';
        
        // Format languages
        const languages = Object.entries(user.languages)
            .map(([lang, level]) => `${lang.charAt(0).toUpperCase() + lang.slice(1)}: ${level}`)
            .join('<br>');
        
        tooltip.innerHTML = `
            <strong>${user.name}</strong><br>
            ${languages}<br>
            <span style="color: #A1A1A6;">${user.interests.join(', ')}</span>
        `;
        
        // Add hover events
        dot.addEventListener('mouseenter', () => {
            tooltip.style.display = 'block';
            dot.appendChild(tooltip);
        });
        
        dot.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
        });
        
        dotsContainer.appendChild(dot);
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
