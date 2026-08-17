const startButton =
    document.getElementById("startButton");

const startARButton =
    document.getElementById("startARButton");

const introScreen =
    document.getElementById("intro-screen");

const level1Screen =
    document.getElementById("level1-screen");


/* ========================================= */
/* START GAME */
/* ========================================= */

startButton.addEventListener("click", () => {

    introScreen.classList.add("hidden");

    level1Screen.classList.remove("hidden");

});


/* ========================================= */
/* START AR */
/* ========================================= */

startARButton.addEventListener("click", async () => {

    try {

        console.log("Requesting camera...");

        const stream =
            await navigator.mediaDevices.getUserMedia({

                video: {
                    facingMode: {
                        ideal: "environment"
                    }
                },

                audio: false

            });


        console.log("CAMERA ACCESS GRANTED");


        /*
         * สร้างหน้าจอกล้อง
         */

        const cameraScreen =
            document.createElement("div");

        cameraScreen.id = "camera-screen";


        /*
         * สร้างวิดีโอสำหรับแสดงภาพจากกล้อง
         */

        const video =
            document.createElement("video");


        video.autoplay = true;
        video.playsInline = true;
        video.muted = true;

        video.srcObject = stream;


        cameraScreen.appendChild(video);

        document.body.appendChild(cameraScreen);


        /*
         * ซ่อนหน้า Level 1
         */

        level1Screen.classList.add("hidden");


    } catch (error) {

        console.error("CAMERA ERROR:", error);

        alert(
            "ไม่สามารถเปิดกล้องได้\n\n" +
            error.message
        );

    }

});