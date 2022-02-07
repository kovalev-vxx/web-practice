let offset = 0;
const slides = document.querySelector(".slides");
const max_offset = 400 * (slides.getElementsByClassName("photo").length - 1)

document.querySelector(".next").addEventListener('click', function (){
    if (offset !== max_offset){
        offset+=400;
        slides.style.left = -offset + 'px';
        slides.style.transition = 'left 1s'
    } else{
        offset = 0
        slides.style.left = 0;
        slides.style.transition = 'left 0.5s'
    }

});

document.querySelector(".prev").addEventListener('click', function (){
    if (offset !== 0){
        console.log("click")
        offset-=400;
        slides.style.left = -offset + 'px';
        slides.style.transition = 'left 1s'
    } else {
        offset = max_offset
        slides.style.left = -max_offset + 'px';
        slides.style.transition = 'left 0.5s'
    }
});