const startButton =
    document.getElementById("startButton");

const startARButton =
    document.getElementById("startARButton");

const introScreen =
    document.getElementById("intro-screen");

const level1Screen =
    document.getElementById("level1-screen");


/* START GAME */

startButton.addEventListener("click", () => {

    introScreen.classList.add("hidden");

    level1Screen.classList.remove("hidden");

});


/* START AR */

startARButton.addEventListener("click", () => {

    alert("AR MODE WILL START HERE");

});