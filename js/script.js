// NASA APOD API key (use DEMO_KEY for testing)
const API_KEY = "DEMO_KEY"; // Replace with your own API key for more requests


// Get references to the date inputs, button, and gallery
const startDateInput = document.getElementById("startDate");
const endDateInput = document.getElementById("endDate");
const getImagesButton = document.getElementById("get-images");
const gallery = document.getElementById("gallery");




// Listen for button click to fetch images
getImagesButton.addEventListener('click', fetchNasaImages);


// Variable to keep track of sort order: "asc" for oldest first, "desc" for newest first
let sortOrder = "asc"; // Default is oldest first

// Get references to the sort buttons
const sortOldestButton = document.getElementById("sort-oldest");
const sortNewestButton = document.getElementById("sort-newest");

// Listen for sort button clicks to change sort order
// Listen for sort button clicks to change sort order and update gallery
sortOldestButton.addEventListener('click', () => {
  sortOrder = "asc";
  // Optionally, visually indicate active button
  sortOldestButton.style.backgroundColor = "#9d9d9dff";
  sortNewestButton.style.backgroundColor = "";
  // Re-fetch and display images with new sort order
  fetchNasaImages();
});
sortNewestButton.addEventListener('click', () => {
  sortOrder = "desc";
  sortNewestButton.style.backgroundColor = "#9d9d9dff";
  sortOldestButton.style.backgroundColor = "";
  // Re-fetch and display images with new sort order
  fetchNasaImages();
});


// Function to fetch and display NASA APOD images for a date range
function fetchNasaImages() {
  // Get the selected start and end dates from the inputs
  const startDate = startDateInput.value;
  const endDate = endDateInput.value;


  // Check if both dates are selected
  if (!startDate || !endDate) {
    alert("Please select both start and end dates.");
    return;
  }


  // Check if start date is before or equal to end date
  if (startDate > endDate) {
    alert("Start date must be before or equal to end date.");
    return;
  }
  if (startDate && endDate === 0) {
    return 
  }

  // Show loading message
  gallery.innerHTML = `<p style="color: rgb(238, 238, 238)">Loading images...</p>`;


  // Build the API URL with the selected date range
  const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}`;


  // Fetch data from NASA APOD API
  fetch(url)
    .then(response => response.json())
    .then(data => {
      // Make sure data is always an array
      const images = Array.isArray(data) ? data : [data];


      // Filter out non-image results (sometimes there are videos)
      let imageItems = images.filter(item => item.media_type === "image");

      // Sort images by date based on sortOrder
      imageItems.sort((a, b) => {
        if (sortOrder === "asc") {
          return a.date.localeCompare(b.date); // Oldest first
        } else {
          return b.date.localeCompare(a.date); // Newest first
        }
      });


      // If no images found, show a message
      if (imageItems.length === 0) {
        gallery.innerHTML = "<p>No images found for this date range.</p>";
        return;
      }


      // Clear the gallery and show each image
      gallery.innerHTML = "";
      imageItems.forEach(item => {
        // Create a div for each gallery item
        const div = document.createElement("div");
        div.className = "gallery-item";


        // If the item is an image
        if (item.media_type === "image") {
          div.innerHTML = `
            <img src="${item.url}" alt="${item.title}" />
            <h3>${item.title}</h3>
            <p><strong>Date:</strong> ${item.date}</p>
          `;
          // Add click event to open modal with this item's info
          div.addEventListener('click', () => {
            openModal(item);
          });
        } else if (item.media_type === "video") {
          // For videos, show the thumbnail if available, otherwise a placeholder image
          // Use item.thumbnail_url if present, else fallback to a generic video icon
          const thumbnail = item.thumbnail_url 
            ? item.thumbnail_url 
            : "https://upload.wikimedia.org/wikipedia/commons/7/75/Video-Icon.png";
          div.innerHTML = `
            <img src="${thumbnail}" alt="Video: ${item.title}" />
            <h3>"Video: ${item.title}"</h3>
            <p><strong>Date:</strong> ${item.date}</p>
            <p>
              <a href="${item.url}" target="_blank" rel="noopener" style="color:#E4002B;">
                Watch Video
              </a>
            </p>
          `;
          // Optionally, clicking the div opens the video in a new tab
          div.addEventListener('click', (e) => {
            // Only open if not clicking the link itself
            if (e.target.tagName !== 'A') {
              window.open(item.url, '_blank');
            }
          });
        }


        // Add to gallery
        gallery.appendChild(div);


        // Add click event to open modal with this item's info
        div.addEventListener('click', () => {
          openModal(item);
        });
      });
    })
    .catch(error => {
      // Show error message
      gallery.innerHTML = "<p>Sorry, there was an error loading images.</p>";
      console.error(error);
    });
}


// Modal logic
// Get modal elements
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const modalTitle = document.getElementById("modal-title");
const modalExplanation = document.getElementById("modal-explanation");
const modalDate = document.getElementById("modal-date");
const modalClose = document.getElementById("modal-close");


// Function to open modal with item info
function openModal(item) {
  modalImg.src = item.url;
  modalImg.alt = item.title;
  modalTitle.textContent = item.title;
  modalExplanation.textContent = item.explanation;
  modalDate.innerHTML = `<strong>Date:</strong> ${item.date}`;
  modal.style.display = "flex";
}


// Close modal when X is clicked
modalClose.addEventListener('click', () => {
  modal.style.display = "none";
});


// Also close modal when clicking outside modal content
modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});






// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)




