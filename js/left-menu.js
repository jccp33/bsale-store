"use strict";

// get left menu
let leftMenu = document.getElementById("left-menu");

// show/hide left menu 
function showLeftMenu(){
    if(leftMenu.style.display == "none"){
        leftMenu.style.display = "block";
    }else{
        leftMenu.style.display = "none";
    }
}