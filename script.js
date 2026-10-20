// Add project and resume links
document.querySelectorAll(".project-btn").forEach(function(btn) {
    btn.target = "_blank";
});

document.querySelector(".resume-btn").href = "resume.pdf";