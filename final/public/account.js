const form = document.getElementById("accountForm");
const successMessage = document.getElementById("successMessage");
const submittedInfoContainer = document.getElementById("submittedInfoContainer");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (!validateForm()) {
        return;
    }

    const formData = new FormData(form);

    try {
        const response = await fetch('/submit', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Submission failed');
        }

        successMessage.style.display = "block";
        setTimeout(function () {
            successMessage.style.display = "none";
        }, 2000);

        form.reset();
        displaySubmittedInfo();
    } catch (error) {
        console.error('Error:', error);
    }
});

function validateForm() {
    return form.checkValidity();
}

async function displaySubmittedInfo() {
    try {
        const response = await fetch('/accounts');
        if (!response.ok) {
            throw new Error('Error fetching accounts');
        }
        const accounts = await response.json();
        renderAccounts(accounts);
    } catch (error) {
        console.error('Error:', error);
    }
}

function renderAccounts(accounts) {
    submittedInfoContainer.innerHTML = ''; 
    accounts.forEach(account => {
        const submittedInfoItem = document.createElement("div");
        submittedInfoItem.classList.add("submitted-info-item");
        submittedInfoItem.innerHTML = `
            <p><strong>First Name:</strong> ${account.firstName}</p>
            <p><strong>Last Name:</strong> ${account.lastName}</p>
            <p><strong>Username:</strong> ${account.username}</p>
            <p><strong>School/University:</strong> ${account.school}</p>
            <p><strong>Grade Level:</strong> ${account.gradeLevel}</p>
        `;
        submittedInfoContainer.appendChild(submittedInfoItem);
    });
}

displaySubmittedInfo();
