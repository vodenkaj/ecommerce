const navigation = document.querySelector('.navigation');
const fillBtns = navigation.querySelectorAll('.bar');

const slides = document.querySelectorAll('.slide');

let currentBtn = fillBtns[0];
let idx = 0;
let tAnimation = setInterval(fillAnimation, 100);
let lastIdx = 0;

// slides[idx].style.display = 'initial';


function fillAnimation() {
	//if (slides[currentBtn.getAttribute("n")].classList.contains('slide-right')) slides[currentBtn.getAttribute("n")].classList.remove('slide-right');
	let width = currentBtn.childNodes[1].style.width;
	width = width == "" ? 1 : (parseInt(width.slice(0,-1)) + 1);
	if (width == 101) {
		currentBtn.childNodes[1].style.width = 0;
		//slides[idx != 0 ? idx - 1 : 2].classList.remove('.slide-left');
		slides[idx].classList.add('slide-left');
		//setTimeout(pushToRight, 600, slides[idx]);
		lastIdx = idx;
		if (++idx >= 3) {
			idx = 0;
		}
		pushToRight(slides[idx]);
		currentBtn = fillBtns[idx];
		//slides[idx].style.display = '';
		
		slides[idx].classList.remove('slide-right');
		width = 0;
		
	}
	currentBtn.childNodes[1].style.width = width + '%';
};

const currentAnimation = [];

function pushToRight(element) {
	//element.style.transition = 0;
	element.classList.remove('slide-left');
	element.classList.add('slide-right');
	//element.style.transition = 0;
}

function delay(t) {
	return new Promise((resolve) => setTimeout(resolve, t));
}
navigation.onmouseup = e => {
	const target = e.target;
	if (target == currentBtn) return;
	for (let i = 0; i < 3; i++) {
		if (fillBtns[i] == target) {
			currentBtn.childNodes[1].style.width = 0;
			currentBtn = fillBtns[i];
			slides[idx].classList.add('slide-left');
			
			pushToRight(slides[idx]);

			idx = i;
			clearInterval(tAnimation);
			tAnimation = setInterval(fillAnimation,100)
			slides[idx].classList.remove('slide-right');
			slides[idx].classList.remove('slide-left')
			break;
		}
	}
	lastTarget = target;
}