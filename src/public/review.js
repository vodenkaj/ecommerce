const reviewRoot = document.querySelector('.review-scroller');
const filterReviewDiv = document.querySelector('.filter-review');
const filterSpans = filterReviewDiv.querySelectorAll('span');
const filerPercentage = filterReviewDiv.querySelectorAll('b');
const filterButtons = filterReviewDiv.querySelectorAll('button');

const reviewsHtml = new Array(5).fill("");

const filterReviewBtn = document.getElementById('filter-review');

$(document).ready(() => {
    getReviews();
});

let isFilterOpen = false;
filterReviewBtn.onmouseup = () => {
	if (isFilterOpen)
		filterReviewDiv.style.display = 'none';
	else
		filterReviewDiv.style.display = 'flex'
	isFilterOpen = !isFilterOpen;
}

filterReviewDiv.onmouseup = e => {
	const target = e.target;
	if (target.tagName != 'BUTTON') return;
	filter(target.id.slice(-1));
}

function getStars(rating) {
    let html = "";
    for (let i = 0; i < 5; i++) {
        if (rating != 0) {
            rating--;
            html += '<i class="fas fa-star"></i>';
        }
        else html += '<i class="far fa-star"></i>';
    }
    return html;
}

function setupFilter(ratingArr) {
	for (let i = 0; i < 5; i++) {
		const percentage = (ratingArr[i] != 0 ? ((ratingArr[i] / reviews.length) * 100).toFixed(2) : "0.00") + "%";
		document.getElementById("percentage-line-"+i).childNodes[1].style.width = percentage;
		filerPercentage[4-i].textContent = percentage;
		filterSpans[4-i].textContent = `${ratingArr[i]} Reviews`; 
	}
}

const filteredBtns = [];
let activeBtn;
function filter(rating) {
	reviewRoot.innerHTML = reviewsHtml[rating];
	
	while(filteredBtns.length > 0) {
		filteredBtns.pop().classList.remove('filtered');
	}

	for (let i = 0; i < 5; i++) {
		if (filterButtons[i].id.slice(-1) == rating) {
			if (activeBtn) activeBtn.classList.remove('not-filtered');
			activeBtn = filterButtons[i];
			activeBtn.classList.add('not-filtered');
			continue;
		}
		filterButtons[i].classList.add('filtered');
		filteredBtns.push(filterButtons[i]);
	};
}

function renderReviews() {
    const ratingArr = new Array(5).fill(0);
    for (let i = 0; i < reviews.length; i++) {
        ratingArr[reviews[i].rating-1]++;
        reviewsHtml[reviews[i].rating-1] += 
        '<div class="column review-content">' +
			'<div class="row space">' +
                '<div class="row">' +
                    '<div class="column">' +
						'<div class="row review">' +
							'<img src="https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png"/>' +
							'<span>' +
                                '<strong>' + reviews[i].first_name + ' ' + reviews[i].last_name + '</strong>' +
                            '</span>' +
							'<div>' + getStars(reviews[i].rating) +'</div>' +
						'</div>' +
						'<span>' + reviews[i].comment + '</span>' +
					'</div>' +
				'</div>' +
			'</div>' +
			'<span class="review-comment-date">' +
            Object.values(reviews[i].created_at)[0] + " " + Object.keys(reviews[i].created_at)[0] + 
            ' ago</span>' +
		'</div>' +
	'</div>'
    }
	reviewRoot.innerHTML = reviewsHtml.join(' ');
	setupFilter(ratingArr);
}

function getReviews(params) {
    $.ajax({
        method: 'GET',
        url: `/api/product/${productId}/reviews`,
        data: {sort:params},
        success: res => {
            reviews = res.data;
            renderReviews();
        },
        error: err => console.log(err)
    })
}
