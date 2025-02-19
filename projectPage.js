document.addEventListener("DOMContentLoaded", function() {
  // Select theme toggle icons
  const nightIcon = document.getElementById("night-icon");
  const dayIcon = document.getElementById("day-icon");

  // Check for a saved theme in localStorage
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
    nightIcon.style.display = "none";
    dayIcon.style.display = "inline";
  } else {
    document.body.classList.remove("light-mode");
    dayIcon.style.display = "none";
    nightIcon.style.display = "inline";
  }

  // When the moon is clicked, switch to light mode
  nightIcon.addEventListener("click", function() {
    document.body.classList.add("light-mode");
    localStorage.setItem("theme", "light");
    nightIcon.style.display = "none";
    dayIcon.style.display = "inline";
  });

  // When the sun is clicked, switch back to dark mode
  dayIcon.addEventListener("click", function() {
    document.body.classList.remove("light-mode");
    localStorage.setItem("theme", "dark");
    dayIcon.style.display = "none";
    nightIcon.style.display = "inline";
  });

  // Hide the nav when scrolling down, show when scrolling up
  let lastScrollY = window.scrollY;
  const navContainer = document.querySelector(".nav-container");

  window.addEventListener("scroll", function() {
    if (window.scrollY > lastScrollY) {
      navContainer.style.top = "-100px";
    } else {
      navContainer.style.top = "0";
    }
    lastScrollY = window.scrollY;
  });
});
