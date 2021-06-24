const closeReview = document.getElementById('cancel-review');
const openReview = document.getElementById('write-review');
const review = document.getElementById('write-review-form');

let reviews = [];

closeReview.onmouseup = () => {
    review.style.display = 'none';
    openReview.style.display = 'initial';
}

openReview.onmouseup = () => {
    review.style.display = 'flex';
    openReview.style.display = 'none';
}

const reviewRating = document.querySelector('.review-rating');

const stars = reviewRating.querySelectorAll('label');
let selectedStars = [];

reviewRating.onmousedown = e => {
    e.stopPropagation();
    const rating = e.target.querySelector("input[name='rating']").value;
    while (selectedStars.length > 0) {
        selectedStars.pop().classList.remove('selected');
    }
    for (let i = 4; i != 4-rating; i--) {
        stars[i].classList.add('selected');
        selectedStars.push(stars[i]);
    }
}
