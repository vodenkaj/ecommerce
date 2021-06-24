const closeSearch = document.getElementById('close-search');
const searchBar = document.querySelector('.nav-search-bar');
const searchIcon = document.getElementById('search-icon');

let lastElementIdx = 0;
let searchFocused = false;
let lastHovereredElement;

searchIcon.onmouseup = () => {
    searchBar.style.animation = 'slide 0.5s';
    searchBar.style.visibility = 'visible';
}

closeSearch.onclick = (e) => {
    e.preventDefault();
    searchBar.style.animation = '';
    searchBar.style.visibility = 'hidden';
}


searchValue.onfocus = () => {
    if (searchValue.innerHTML != '') {
        keywordsDiv.style.visibility = 'visible';
    }
    searchFocused = true;
}

searchValue.onkeydown = e => {
    if (e.keyCode == '40') moveOnKeywordBar(1);
    else if (e.keyCode == '38') moveOnKeywordBar(-1);
}

keywordsDiv.onmouseover = e => {
    if (e.target.classList.contains('suggestions')) return;
    if (lastHovereredElement) lastHovereredElement.classList.remove('selected');
    e.target.classList.add('selected');
    lastHovereredElement = e.target;
}

function moveOnKeywordBar(way) {
    if (lastElementIdx == keywordsDiv.childElementCount - 1 && way == 1) {
        keywordsDiv.children[lastElementIdx].classList.remove('selected');
        lastElementIdx = 0;
    } else if (lastElementIdx - 1 < 0 && way == -1) {
        keywordsDiv.children[0].classList.remove('selected');
        lastElementIdx = keywordsDiv.childElementCount - 1;

    }
    if (!keywordsDiv.children[lastElementIdx].classList.contains('selected')) {
        keywordsDiv.children[lastElementIdx].classList.add('selected');
    } else {
        keywordsDiv.children[lastElementIdx].classList.remove('selected');
        lastElementIdx += way;
        keywordsDiv.children[lastElementIdx].classList.add('selected');
    }
    searchValue.value = keywordsDiv.children[lastElementIdx].innerText;
    window.setTimeout(() => searchValue.setSelectionRange(searchValue.value.length, searchValue.value.length), 0);
}

keywordsDiv.onmouseup = e => {
    keywordsDiv.children[lastElementIdx].classList.remove('selected');
    searchValue.value = e.target.innerText;
    searchBar.submit();
}

window.onmouseup = e => lostFocus(e);
window.onkeydown = e => {
    if (e.keyCode == '27') lostFocus(e, true);
}

function lostFocus(e, force = false) {
    if (((e.target != searchValue && e.target != keywordsDiv) || force) && searchFocused) {
        keywordsDiv.style.visibility = 'hidden';
        searchFocused = false;
    }
}