const searchValue = document.getElementById('search-value');
const keywordsDiv = document.querySelector('.suggestions');

const sidePanel = document.querySelector('.side-panel');
const orderBy = document.getElementById('sort-watches');
let sortedWatches = {};
const sortingBy = {};

$(searchValue).on('input',() => {
	if (searchValue.value.length > 0)
		$.ajax({
			method: 'POST',
			url: '/api/keywords',
			contentType: 'application/json',
			data: JSON.stringify({word: searchValue.value}),
			success: res => {
				showKeyword(res);
			}
		})
	else{
		keywordsDiv.innerHTML = '';
		keywordsDiv.style.visibility = 'hidden';
	}
});

$(sidePanel).on('mouseup', (el) => {
	el = el.target;
	if (el.nodeName == 'INPUT'){
		if (sortingBy[el.name] && sortingBy[el.name].includes(el.value) && sortingBy[el.name].length == 1) delete sortingBy[el.name];
		else if (sortingBy[el.name] && sortingBy[el.name].includes(el.value)) sortingBy[el.name] = sortingBy[el.name].filter(v => v != el.value);
		else if (!sortingBy[el.name]) sortingBy[el.name] = [el.value];
		else sortingBy[el.name].push(el.value);
		$.ajax({
			method: 'GET',
			url: '/api/sort-products',
			data: {value:sortingBy, brand:1, mode:orderBy.value},
			success: res => {
				updateWatches(res);
			}
		})
	}
})

$(orderBy).on('change', () => {
	$.ajax({
		method: 'GET',
		url: '/api/sort-products',
		data: {value:sortingBy, brand:1, mode:orderBy.value},
		success: res => {
			updateWatches(res);
		}
	})
})

function showKeyword(res){
	let innerHtml = '';
	res.forEach(keyword => {
		innerHtml += `<span>${keyword.name}</span>`;
	})
	if (innerHtml == '') keywordsDiv.style.visibility = 'hidden';
	else keywordsDiv.style.visibility = 'visible';
	keywordsDiv.innerHTML = innerHtml;
	lastElementIdx = 0;
}