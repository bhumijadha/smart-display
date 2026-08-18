const slides = [
{
image:"images/topper.jpg",
title:"Congratulations to the 6th Semester Toppers",
caption:"Your hard work and dedication inspire the entire EEE Department."
},
{
image:"images/workshop.jpg",
title:"Upcoming Technical Workshop",
caption:"AI Powered Playwright + TypeScript Automation."
},
{
image:"images/participation.jpg",
title:"Student Achievements",
caption:"Congratulations for Active Participation."
},
{
image:"images/placement.jpg",
title:"Campus Placement",
caption:"Congratulations on your placement at Indus Towers."
},
{
image:"images/quote.jpg",
title:"Quote of the Day",
caption:"Your habits shape your future more than your goals."
},
{
image:"images/notice.jpg",
title:"Department Notice",
caption:"Project Review Schedule."
}
];

let current=0;

function nextSlide(){

document.getElementById("slideImage").src=slides[current].image;

document.getElementById("slideTitle").innerHTML=slides[current].title;

document.getElementById("slideCaption").innerHTML=slides[current].caption;

current=(current+1)%slides.length;

}

nextSlide();

setInterval(nextSlide,5000);
