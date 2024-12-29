// Get references to the theme toggle icons
const nightIcon = document.getElementById('night-icon');
const dayIcon = document.getElementById('day-icon');

// Add event listener to switch to light mode
nightIcon.addEventListener('click', () => {
    document.body.classList.add('light-mode');
    nightIcon.style.display = 'none';
    dayIcon.style.display = 'inline';
});

// Add event listener to switch back to dark mode
dayIcon.addEventListener('click', () => {
    document.body.classList.remove('light-mode');
    dayIcon.style.display = 'none';
    nightIcon.style.display = 'inline';
});
