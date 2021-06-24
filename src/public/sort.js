const watchesContainer = document.querySelector('.watches-container');


const watches = [];

function updateWatches(res) {
	sortedWatches = res.products;
	let row = watchesContainer.children[2];
	row.innerHTML = '';
	for (let i = 0; i < sortedWatches.length; i++){
		row.innerHTML += 
		`<a class='watch' href="/product/${sortedWatches[i].id}"><img src="/imgs/brands/${sortedWatches[i].id}.jpg"><span>${sortedWatches[i].name}</span></a>`;
	}
}
