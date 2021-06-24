const sideBar = document.querySelector('.side-panel');

sideBar.onmouseup = (e) => {
	if (e.target.id != 'show-panel') return;
	el = e.target.nextElementSibling;
	if (el.style.maxHeight != '300px') el.style.maxHeight = '300px';
	else el.style.maxHeight = '0';
}