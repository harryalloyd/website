// Get references to the theme toggle icons
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
