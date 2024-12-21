document.addEventListener("DOMContentLoaded", function() {
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
});


