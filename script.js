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

    // 2) New code for your day/night toggle
    const nightIcon = document.getElementById('night-icon');
    const dayIcon = document.getElementById('day-icon');

    // If you want to start in dark mode with the moon visible, sun hidden
    // make sure "fa-moon" is shown & "fa-sun" is hidden in your HTML.

    nightIcon.addEventListener('click', () => {
        // Switch to light mode
        document.body.classList.add('light-mode');
        // Hide moon, show sun
        nightIcon.style.display = 'none';
        dayIcon.style.display = 'inline';
    });

    dayIcon.addEventListener('click', () => {
        // Switch to dark mode
        document.body.classList.remove('light-mode');
        // Hide sun, show moon
        dayIcon.style.display = 'none';
        nightIcon.style.display = 'inline';
    });
});



