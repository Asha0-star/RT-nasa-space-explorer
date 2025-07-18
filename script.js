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

  // Show loading message
  gallery.innerHTML = "<p>Loading images...</p>";

  // Build the API URL with the selected date range
  const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}`;

  // Fetch data from NASA APOD API
  fetch(url)
    .then(response => response.json())
    .then(data => {
      // Make sure data is always an array
      const images = Array.isArray(data) ? data : [data];

      // Filter out non-image results (sometimes there are videos)
      const imageItems = images.filter(item => item.media_type === "image");

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

        // Use template literals to build HTML
        div.innerHTML = `
          <img src="${item.url}" alt="${item.title}" />
          <h3>${item.title}</h3>
          <p><strong>Date:</strong> ${item.date}</p>
          
        `;

        // Add to gallery
        gallery.appendChild(div);

                // Add click event to open modal with this item's info
        div.addEventListener('click', () => {
          openModal(item);
        });

        // Add to gallery
        gallery.appendChild(div);
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

