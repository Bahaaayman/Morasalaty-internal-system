document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tab-btn');
    const sections = document.querySelectorAll('.video-section');

    // Function to switch tabs
    function switchTab(tabId) {
        // Remove active class from all tabs and sections
        tabs.forEach(tab => tab.classList.remove('active'));
        sections.forEach(section => section.classList.remove('active'));

        // Add active class to selected tab and section
        const selectedTab = document.querySelector(`[data-tab="${tabId}"]`);
        const selectedSection = document.getElementById(tabId);
        
        if (selectedTab && selectedSection) {
            selectedTab.classList.add('active');
            selectedSection.classList.add('active');
        }
    }

    // Add click event listeners to tabs
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // Initialize with the first tab active
    const firstTabId = tabs[0]?.getAttribute('data-tab');
    if (firstTabId) {
        switchTab(firstTabId);
    }

    // Function to format duration
    function formatDuration(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    // Function to handle video errors
    function handleVideoError(event) {
        const video = event.target;
        console.error('Video error:', video.error);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'video-error';
        errorDiv.textContent = 'عذراً، حدث خطأ في تحميل الفيديو. الرجاء المحاولة مرة أخرى.';
        video.parentElement.appendChild(errorDiv);
    }

    // Function to create video cards
    function createVideoCard(video) {
        return `
            <div class="video-card">
                <div class="video-thumbnail">
                    <video 
                        width="100%" 
                        height="100%" 
                        controls 
                        preload="metadata"
                        onerror="this.onerror=null; handleVideoError(event);"
                    >
                        <source src="../videos/Morasalaty NEW CRM KPIs.mp4" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                </div>
                <div class="video-info">
                    <h3>${video.title}</h3>
                    <p>${video.description}</p>
                    <span class="video-duration">${formatDuration(video.duration)}</span>
                </div>
            </div>
        `;
    }

    // Video data
    const videos = {
        'customer-training': [
            {
                title: "Morasalaty NEW CRM KPIs",
                description: "شرح مؤشرات الأداء الرئيسية وكيفية تحليلها في نظام CRM الجديد",
                duration: 600
            }
        ],
        'team-videos': [],
        'sub-videos': []
    };

    // Populate video sections
    Object.keys(videos).forEach(category => {
        const section = document.getElementById(category);
        if (section) {
            const videoGrid = section.querySelector('.video-grid');
            if (videoGrid && videos[category].length > 0) {
                videoGrid.innerHTML = videos[category]
                    .map(video => createVideoCard(video))
                    .join('');

                // Add event listeners to all videos
                const videoElements = videoGrid.querySelectorAll('video');
                videoElements.forEach(video => {
                    video.addEventListener('error', handleVideoError);
                    
                    // Log when video starts loading
                    video.addEventListener('loadstart', () => {
                        console.log('Video loading started');
                    });
                    
                    // Log when metadata is loaded
                    video.addEventListener('loadedmetadata', () => {
                        console.log('Video metadata loaded');
                    });
                    
                    // Log when video can play
                    video.addEventListener('canplay', () => {
                        console.log('Video can play');
                    });
                });
            }
        }
    });
}); 