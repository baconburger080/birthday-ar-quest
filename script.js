// ==========================================
// GET ELEMENTS
// ==========================================

const startButton = document.getElementById("startButton");
const startARButton = document.getElementById("startARButton");

const introScreen = document.getElementById("intro-screen");
const level1Screen = document.getElementById("level1-screen");


// ==========================================
// START GAME
// ==========================================

startButton.addEventListener("click", function () {

    introScreen.classList.add("hidden");

    level1Screen.classList.remove("hidden");

});


// ==========================================
// START AR
// ==========================================

startARButton.addEventListener("click", async function () {

    console.log("START AR BUTTON CLICKED");

    try {

        // ขอสิทธิ์ใช้กล้องหลัง
        const stream = await navigator.mediaDevices.getUserMedia({

            video: {
                facingMode: {
                    ideal: "environment"
                }
            },

            audio: false

        });


        console.log("CAMERA ACCESS GRANTED");


        // ==========================================
        // CREATE CAMERA SCREEN
        // ==========================================

        const cameraScreen = document.createElement("div");

        cameraScreen.id = "camera-screen";


        // ==========================================
        // CREATE VIDEO
        // ==========================================

        const video = document.createElement("video");

        video.setAttribute("autoplay", "");
        video.setAttribute("playsinline", "");
        video.setAttribute("muted", "");

        video.autoplay = true;
        video.playsInline = true;
        video.muted = true;

        video.srcObject = stream;


        // ==========================================
        // ADD VIDEO TO CAMERA SCREEN
        // ==========================================

        cameraScreen.appendChild(video);

        document.body.appendChild(cameraScreen);


        // ==========================================
        // HIDE LEVEL 1
        // ==========================================

        level1Screen.classList.add("hidden");


    } catch (error) {

        console.error("CAMERA ERROR:", error);

        alert(
            "ไม่สามารถเปิดกล้องได้\n\n" +
            "กรุณาอนุญาตให้เว็บไซต์ใช้กล้อง"
        );

    }

});