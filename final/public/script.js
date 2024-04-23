class Review {
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

window.onload = showReviews;