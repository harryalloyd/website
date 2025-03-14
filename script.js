document.addEventListener("DOMContentLoaded", function() {
  // 1) Existing code for jobItems
  const jobItems = document.querySelectorAll(".job-item");
  const descriptions = document.querySelectorAll(".description");

  jobItems.forEach((item, index) => {
    item.addEventListener("click", function() {
      // Remove active class from all descriptions
      descriptions.forEach(description => description.classList.remove("active"));
      // Add active class to the selected description
      descriptions[index].classList.add("active");

      // Remove active class from all job items
      jobItems.forEach(job => job.classList.remove("active"));
      // Add active class to the clicked job item
      item.classList.add("active");
    });
  });

  // 2) Updated code for day/night toggle
  const nightIcon = document.getElementById('night-icon');
  const dayIcon = document.getElementById('day-icon');

  // Apply the saved theme on page load
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    nightIcon.style.display = 'none';
    dayIcon.style.display = 'inline';
  } else {
    document.body.classList.remove('light-mode');
    dayIcon.style.display = 'none';
    nightIcon.style.display = 'inline';
  }

  // Add event listener to switch to light mode
  nightIcon.addEventListener('click', () => {
    document.body.classList.add('light-mode');
    localStorage.setItem('theme', 'light');
    nightIcon.style.display = 'none';
    dayIcon.style.display = 'inline';
  });

  // Add event listener to switch back to dark mode
  dayIcon.addEventListener('click', () => {
    document.body.classList.remove('light-mode');
    localStorage.setItem('theme', 'dark');
    dayIcon.style.display = 'none';
    nightIcon.style.display = 'inline';
  });

  // 3) Code to handle the ring animation and swap images
  const container = document.getElementById('hover-profile');
  const profilePic = document.getElementById('profile-pic');
  
  // Paths to your images
  const originalSrc = 'images/harryweb.jpeg';
  const newSrc = 'images/harrywebglasses.jpeg';

  // When the ring's animation ends (fillRing is complete), show the new image
  container.addEventListener('animationend', function(e) {
    // Check if it's specifically the fillRing animation
    if (e.animationName === 'fillRing') {
      profilePic.src = newSrc;
    }
  });

  // When mouse leaves, revert to the original image immediately
  container.addEventListener('mouseleave', function() {
    profilePic.src = originalSrc;
  });

  // 4) Code for showing nav only when scrolling up
  let lastScrollY = window.scrollY;
  const navContainer = document.querySelector('.nav-container');

  window.addEventListener('scroll', () => {
    if (window.scrollY > lastScrollY) {
      // Scrolling down - hide the nav
      navContainer.style.top = '-100px'; // Move nav off-screen
    } else {
      // Scrolling up - show the nav
      navContainer.style.top = '0';
    }
    lastScrollY = window.scrollY; // Update the last scroll position
  });
});

// New fade-in code
window.addEventListener('load', function() {
  // Fade in the header immediately
  const header = document.querySelector('.nav-container');
  header.classList.add('fade-in');

  // Select all major sections (all direct div children of body that are not the header)
  const sections = document.querySelectorAll('body > div:not(.nav-container)');
  
  // Apply a staggered fade-in with increasing delays
  sections.forEach((section, index) => {
    section.style.animationDelay = `${(index + 1) * 0.5}s`;
    section.classList.add('fade-in');
  });
});
