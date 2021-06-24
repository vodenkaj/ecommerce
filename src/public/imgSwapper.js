const bigImgRoot = document.getElementById('big-img-holder');
const imgsRootDiv = document.querySelector('.watch-product-page');
const imgsArr = imgsRootDiv.querySelectorAll('.watch');

let lastTarget = imgsArr[0];
imgsRootDiv.onmouseup = e => {
	const target = e.target;
	imgsArr.forEach(img => {
		if (img == target) {
			lastTarget.classList.remove('selected');
			lastTarget = e.target;
			lastTarget.classList.add('selected');
			bigImgRoot.childNodes[1].src = target.childNodes[1].src;
		}
	});
}
