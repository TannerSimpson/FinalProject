const getReviews = async () => {
    try {
        return (await fetch("/api/reviews")).json();
    } catch (error) {
        console.error(error);
    }
};

const showReviews = async () => {
    const reviews = await getReviews();
    const reviewsContainer = document.getElementById("reviews-container");
    reviewsContainer.innerHTML = "";

    reviews.forEach((review) => {
        const reviewDiv = document.createElement("div");
        reviewDiv.classList.add("review");
        
        const a = document.createElement("a");
        a.href = "#";
        reviewDiv.appendChild(a);

        const reviewImage = document.createElement("img");
        reviewImage.src = "images/" + review.image;
        reviewImage.alt = review.name;
        a.appendChild(reviewImage);

        a.onclick = (e) => {
            e.preventDefault();
            displayReviewDetails(review);
        };

        reviewsContainer.appendChild(reviewDiv);
    });
};

const displayReviewDetails = (review) => {
    openDialog();
    document.getElementById("form-container").classList.add("hidden");
    document.getElementById("review-detail-container").classList.remove("hidden");

    const reviewDetails = document.getElementById("review-detail-container");
    reviewDetails.innerHTML = "";

    const h3 = document.createElement("h3");
    h3.innerHTML = review.name;
    reviewDetails.appendChild(h3);

    const img = document.createElement("img");
    img.src = "images/" + review.image;
    img.alt = review.name;
    reviewDetails.appendChild(img);

    const p = document.createElement("p");
    p.innerHTML = review.description;
    reviewDetails.appendChild(p);

    const ul = document.createElement("ul");
    reviewDetails.appendChild(ul);

    review.comments.forEach((comment) => {
        const li = document.createElement("li");
        li.innerHTML = comment;
        ul.appendChild(li);
    });

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.onclick = (e) => {
        e.preventDefault();
        showEditReviewForm(review);
    };
    reviewDetails.appendChild(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = () => deleteReview(review._id);
    reviewDetails.appendChild(deleteButton);

};

const openDialog = () => {
    document.getElementById("dialog").style.display = "block";
};

const showReviewForm = (e) => {
    e.preventDefault();
    document.getElementById("add-edit-review-form")._id.value = -1;
    resetForm();
    openDialog();
    document.getElementById("form-container").classList.remove("hidden");
    document.getElementById("review-detail-container").classList.add("hidden");
};

const showEditReviewForm = (review) => {
    resetForm();
    const formContainer = document.getElementById("form-container");
    const reviewDetailContainer = document.getElementById("review-detail-container");
    const form = document.getElementById("add-edit-review-form");
    form._id.value = review._id;

    formContainer.classList.remove("hidden");
    reviewDetailContainer.classList.add("hidden");

    document.getElementById("name").value = review.name;
    document.getElementById("description").value = review.description;
    document.getElementById("img-prev").src = "images/" + review.image;

    const commentBoxes = document.getElementById("comment-boxes");
    commentBoxes.innerHTML = ""; 

    review.comments.forEach((comment) => {
        addComment(null, comment);
    });

    openDialog("add-edit-review-form");
};

const resetForm = () => {
    const form = document.getElementById("add-edit-review-form");
    form.reset();
    const commentBoxes = document.getElementById("comment-boxes");
    commentBoxes.innerHTML = "";
    const imgPrev = document.getElementById("img-prev");
    imgPrev.src = "";
};

const addComment = (e, comment = "") => {
    //if (e) e.preventDefault();
    e.preventDefault();
    const section = document.getElementById("comment-boxes");
    const input = document.createElement("input");
    input.type = "text";
    input.value = comment;
    section.appendChild(input);
};

const addReview = async (e) => {
    e.preventDefault();
    const form = document.getElementById("add-edit-review-form");
    const formData = new FormData(form);
    formData.append("comments", getComments());
    let response;
    console.log(...formData);

    if(form._id.value == -1) {
        formData.delete("_id")
        response = await fetch("/api/reviews", {
            method: "POST",
            body: formData,
        });
    } else {
        response = await fetch(`/api/reviews/${form._id.value}`, {
            method: "PUT",
            body: formData,
        });
    };
    showReviews();
    closeDialog();
};

const getComments = () => {
    const inputs = document.querySelectorAll("#comment-boxes input");
    const comments = [];

    inputs.forEach((input) => {
        comments.push(input.value);
    });

    return comments.join(",");
};

const deleteReview = async (reviewId) => {
    if (!confirm("Are you sure you want to delete this review?")) {
        return;
    }

    try {
        const response = await fetch(`/api/reviews/${reviewId}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Error deleting review");
        }

        document.getElementById("dialog").style.display = "none";
        showReviews();
    } catch (error) {
        console.error(error);
    }
};

showReviews();
document.getElementById("add-link").onclick = showReviewForm;
document.getElementById("add-comment").onclick = addComment;

document.getElementById("img").onchange = (e) => {
    const prev = document.getElementById("img-prev");

    if (!e.target.files.length) {
        prev.src = "";
        return;
    }

    prev.src = URL.createObjectURL(e.target.files.item(0));
};

const closeDialog = () => {
    document.getElementById("dialog").style.display="none";
}

document.getElementById("close-button").onclick = closeDialog;
document.getElementById("add-edit-review-form").onsubmit = addReview;






/*class Review {
    constructor(data) {
        this._id = data._id;
        this.img_name = data.img_name;
        this.review = data.review;
        this.rating = data.rating;
        this.name = data.name;
        this.age = data.age;
        this.occupation = data.occupation;
        this.location = data.location;
        this.date = data.date;
        this.comments = data.comments;
    }

    getImage() {
        return `images/${this.img_name}`;
    }

    display() {
        const reviewItem = document.createElement('div');
        reviewItem.classList.add('review-item');

        const img = document.createElement('img');
        img.src = this.getImage();
        img.alt = `Review Image ${this._id}`;

        const pReview = document.createElement('p');
        pReview.textContent = this.review;

        const rating = document.createElement('p');
        rating.textContent = `Rating: ${this.rating}`;

        const details = document.createElement('div');
        details.classList.add('details');
        details.innerHTML = `
            <p><strong>Name:</strong> ${this.name}</p>
            <p><strong>Age:</strong> ${this.age}</p>
            <p><strong>Occupation:</strong> ${this.occupation}</p>
            <p><strong>Location:</strong> ${this.location}</p>
            <p><strong>Date:</strong> ${this.date}</p>
            <p><strong>Comments</strong></p>
            <ul>
                ${this.comments.map(info => `<li>${info}</li>`).join('')}
            </ul>
        `;

        reviewItem.appendChild(img);
        reviewItem.appendChild(pReview);
        reviewItem.appendChild(rating);
        reviewItem.appendChild(details);

        return reviewItem;
    }
}

function showReviews() {
    fetch('reviews.json') 
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch reviews');
            }
            return response.json();
        })
        .then(data => {
            const reviewSection = document.querySelector('.bottom-section');
            if (data && Array.isArray(data)) {
                data.forEach(reviewData => {
                    const review = new Review(reviewData);
                    const reviewItem = review.display();
                    reviewSection.appendChild(reviewItem);
                });
            } else {
                throw new Error('Invalid data format');
            }
        })
        .catch(error => console.error('Error fetching and displaying reviews:', error));
}

window.onload = showReviews;*/