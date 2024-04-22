const form = document.getElementById("accountForm");
const successMessage = document.getElementById("successMessage");
const submittedInfoContainer = document.getElementById("submittedInfoContainer");

form.addEventListener("submit", function (event) {
    event.preventDefault(); 

    
    if (!validateForm()) {
        return;
    }

    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const school = document.getElementById("school").value;
    const gradeLevel = document.getElementById("gradeLevel").value;

    successMessage.style.display = "block";
    setTimeout(function () {
        successMessage.style.display = "none";
    }, 2000);

    const submittedInfoItem = document.createElement("div");
    submittedInfoItem.classList.add("submitted-info-item");
    submittedInfoItem.innerHTML = `
        <p><strong>First Name:</strong> ${firstName}</p>
        <p><strong>Last Name:</strong> ${lastName}</p>
        <p><strong>Username:</strong> ${username}</p>
        <p><strong>School/University:</strong> ${school}</p>
        <p><strong>Grade Level:</strong> ${gradeLevel}</p>
    `;

    submittedInfoContainer.appendChild(submittedInfoItem);

    form.reset();
});

function validateForm() {
    return form.checkValidity();
}