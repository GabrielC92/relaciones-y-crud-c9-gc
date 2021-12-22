let formSearch = document.getElementById('form-search');
let search = document.getElementById('search');

console.log("search.js success!");
formSearch.addEventListener('submit', e => {
    e.preventDefault();
    search.value !== "" && formSearch.submit();
})