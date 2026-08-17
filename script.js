// ==========================================
// GET ELEMENTS
// ==========================================

const startButton =
    document.getElementById("startButton");

const startARButton =
    document.getElementById("startARButton");

const introScreen =
    document.getElementById("intro-screen");

const level1Screen =
    document.getElementById("level1-screen");

const arScreen =
    document.getElementById("ar-screen");

const cameraVideo =
    document.getElementById("camera-video");

const arMessage =
    document.getElementById("ar-message");

const placementDot =
    document.getElementById("placement-dot");

const placeButton =
    document.getElementById("place-button");


// ==========================================
// CAMERA STREAM
// ==========================================

let cameraStream = null;


// ==========================================
// START GAME
// ==========================================

startButton.addEventListener(
    "click",
    function () {

        introScreen.classList.add("hidden");

        level1Screen.classList.remove("hidden");

    }
);


// ==========================================
// START AR
// ==========================================

startARButton.addEventListener(
    "click",
    async function () {

        console.log(
            "START AR CLICKED"
        );


        // ------------------------------------------
        // SHOW AR SCREEN
        // ------------------------------------------

        level1Screen.classList.add("hidden");

        arScreen.classList.remove("hidden");


        // ------------------------------------------
        // HIDE PLACE BUTTON
        // ------------------------------------------

        placeButton.style.display =
            "none";


        // ------------------------------------------
        // SHOW SCAN MESSAGE
        // ------------------------------------------

        arMessage.textContent =
            "SCAN THE GROUND";


        // ------------------------------------------
        // CHECK CAMERA SUPPORT
        // ------------------------------------------

        if (
            !navigator.mediaDevices ||
            !navigator.mediaDevices.getUserMedia
        ) {

            showError(
                "อุปกรณ์หรือ Browser นี้ไม่รองรับการเปิดกล้อง"
            );

            return;

        }


        try {

            console.log(
                "REQUESTING CAMERA..."
            );


            // ------------------------------------------
            // REQUEST REAR CAMERA
            // ------------------------------------------

            cameraStream =
                await navigator.mediaDevices.getUserMedia({

                    video: {

                        facingMode: {
                            ideal: "environment"
                        }

                    },

                    audio: false

                });


            console.log(
                "CAMERA ACCESS GRANTED"
            );


            // ------------------------------------------
            // CONNECT CAMERA TO VIDEO
            // ------------------------------------------

            cameraVideo.srcObject =
                cameraStream;


            cameraVideo.muted =
                true;

            cameraVideo.playsInline =
                true;

            cameraVideo.autoplay =
                true;


            // ------------------------------------------
            // PLAY CAMERA
            // ------------------------------------------

            await cameraVideo.play();


            console.log(
                "CAMERA PLAYING"
            );


            // ------------------------------------------
            // SHOW CENTER MARKER
            // ------------------------------------------

            placementDot.style.display =
                "block";


            console.log(
                "AR CAMERA READY"
            );


        } catch (error) {

            console.error(
                "CAMERA ERROR:",
                error
            );


            showError(
                error.message ||
                "ไม่สามารถเปิดกล้องได้"
            );

        }

    }
);


// ==========================================
// PLACE BUTTON
// ==========================================

placeButton.addEventListener(
    "click",
    function () {

        console.log(
            "PLACE BUTTON CLICKED"
        );


        arMessage.textContent =
            "FOUND!";


        placeButton.style.display =
            "none";

    }
);


// ==========================================
// ERROR
// ==========================================

function showError(message) {

    console.error(
        "AR ERROR:",
        message
    );


    arMessage.textContent =
        "CAMERA ERROR";


    alert(
        "ไม่สามารถเริ่ม AR ได้\n\n" +
        message
    );

}


// ==========================================
// STOP CAMERA
// ==========================================

function stopCamera() {

    if (!cameraStream) {

        return;

    }


    cameraStream
        .getTracks()
        .forEach(
            function (track) {

                track.stop();

            }
        );


    cameraStream = null;

}


// ==========================================
// PAGE VISIBILITY
// ==========================================

document.addEventListener(
    "visibilitychange",
    function () {

        if (!cameraStream) {

            return;

        }


        if (
            document.visibilityState ===
            "hidden"
        ) {

            cameraStream
                .getTracks()
                .forEach(
                    function (track) {

                        track.enabled =
                            false;

                    }
                );


        } else {

            cameraStream
                .getTracks()
                .forEach(
                    function (track) {

                        track.enabled =
                            true;

                    }
                );

        }

    }
);