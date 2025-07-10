// To get your NASA API key:
// 1. Go to https://api.nasa.gov
// 2. Fill out the form to sign up for an API key
// 3. Copy your key and paste it below instead of 'DEMO_KEY'
// Note: DEMO_KEY has a low rate limit, so get your own key for better access
const API_KEY = 'DEMO_KEY';

// The NASA APOD API endpoint
// 1. Find the correct endpoint URL at: https://api.nasa.gov
// 2. Look for "Astronomy Picture of the Day (APOD)" in the API catalog
// 3. Copy only the endpoint URL and paste it below
const API_URL = ''; 

// Select button and gallery elements
const prevWeekBtn = document.getElementById('prevWeek');
const nextWeekBtn = document.getElementById('nextWeek');
const gallery = document.getElementById('gallery');

// Track current date
let currentDate = new Date();

// Store today's date once
const TODAY = new Date();

// Format date as YYYY-MM-DD
function formatDate(date) {
    return date.toISOString().split('T')[0];
}

// Fetch images for a date range
async function fetchImages(startDate, endDate) {
    gallery.innerHTML = `<div class="placeholder"><p>🔄 Loading space photos…</p></div>`;

    try {
        const response = await fetch(
            `${API_URL}?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}`
        );
        if (!response.ok) throw new Error();
        const data = await response.json();
        displayImages(data);
    } catch (error) {
        gallery.innerHTML = `<div class="placeholder"><p>Failed to load images. Please try again.</p></div>`;
    }
}

// Navigate to previous/next week
function navigateWeek(direction) {
    // Get new date
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction * 7));
    
    // Don't navigate past today
    if (newDate > TODAY) {
        return;
    }
    
    // Update current date and fetch
    currentDate = newDate;
    const endDate = new Date(currentDate);
    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() - 6);
    
    // Disable next button if we're in current week
    nextWeekBtn.disabled = endDate >= TODAY;
    fetchImages(formatDate(startDate), formatDate(endDate));
}

// Event listeners
prevWeekBtn.addEventListener('click', () => navigateWeek(-1));
nextWeekBtn.addEventListener('click', () => navigateWeek(1));

// Initial load - show current week
currentDate = new Date();
navigateWeek(0);

// Display images in the gallery
function displayImages(images) {
    gallery.innerHTML = '';
    if (images.length === 0) {
        gallery.innerHTML = `<div class="placeholder"><p>No images found for the selected date range.</p></div>`;
        return;
    }

    images.forEach(image => {
        if (image.media_type !== 'image') return; // Skip non-image media

        const formattedDate = new Date(image.date + 'T00:00:00').toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const item = `
            <div class="gallery-item" title="${image.explanation}">
                <div class="gallery-item-img-container">
                    <img src="${image.url}" alt="${image.title}">
                </div>
                <p class="gallery-item-title">${image.title}</p>
                <p class="gallery-item-date">${formattedDate}</p>
            </div>
        `;
        
        gallery.insertAdjacentHTML('beforeend', item);
    });
}