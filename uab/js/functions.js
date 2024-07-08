document.addEventListener("DOMContentLoaded", () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-active");
        } else {
          entry.target.classList.remove("is-active");
        }
      });
    }, {
      rootMargin: "0px",
      threshold: 0.3, // Adjusted threshold for earlier transition
    });
  
    document.querySelectorAll(".step").forEach((step) => {
      observer.observe(step);
    });
  });
  
  // JavaScript for dynamic top bar resizing
  window.addEventListener('scroll', function() {
    const topBar = document.querySelector('.top-bar');
    if (window.scrollY > 50) { // Adjust this value based on when you want the bar to shrink
      topBar.style.padding = '0px 0'; // Decrease padding to reduce height
      topBar.style.fontSize = '0.8em'; // Optional: Adjust font size
    } else {
      topBar.style.padding = '20px 0'; // Original padding
      topBar.style.fontSize = '1em'; // Original font size
    }
  });
  
  // Function to show the overlay with the clicked image
  function showOverlayImage(src) {
    const overlay = document.getElementById('imageOverlay');
    const overlayImg = document.getElementById('overlayImage');
    overlayImg.src = src;
    overlay.style.display = 'flex';
    disableScroll(); // Disable scroll when overlay is shown
  }
  
  // Add click event listeners to all images with class 'dia'
  document.querySelectorAll('.dia').forEach(image => {
    image.addEventListener('click', (e) => {
      showOverlayImage(e.target.src);
    });
  });
  
  // Function to hide the overlay
  function hideOverlay() {
    const overlay = document.getElementById('imageOverlay');
    overlay.style.display = 'none';
    enableScroll(); // Re-enable scroll when overlay is hidden
  }
  
  // Add event listener for the ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
      hideOverlay();
    }
  });
  
  // Add click event to overlay itself to close on click
  document.getElementById('imageOverlay').addEventListener('click', hideOverlay);
  
  
  
  function disableScroll() {
    // For modern browsers
    window.addEventListener('wheel', preventScroll, { passive: false });
    // For touch devices
    window.addEventListener('touchmove', preventScroll, { passive: false });
  }
  
  function enableScroll() {
    window.removeEventListener('wheel', preventScroll, { passive: false });
    window.removeEventListener('touchmove', preventScroll, { passive: false });
  }
  
  function preventScroll(e) {
    e.preventDefault();
  }
  
  document.querySelectorAll(".toggleVisibility").forEach(function(toggle) {
    toggle.addEventListener("click", function() {
      var text = this.nextElementSibling; // Assumes the <p> is the next sibling of the <span>
      if (text.classList.contains("hidden")) {
        text.classList.replace("hidden", "visible");
      } else {
        text.classList.replace("visible", "hidden");
      }
    });
  });
  