document.addEventListener("DOMContentLoaded", function() {
    // 1) Your existing code for jobItems
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
});
