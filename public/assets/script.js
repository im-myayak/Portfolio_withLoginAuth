const navBarList = document.querySelector(".nav-list");
function removeThat() {
    navBarList.classList.toggle('hidden');

}
console.log(1);
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        // removeThat();
    }
});