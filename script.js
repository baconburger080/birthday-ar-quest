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

const canvas =
    document.getElementById("ar-canvas");


// ==========================================
// WEBGL
// ==========================================

const gl =
    canvas.getContext("webgl", {
        alpha: false,
        antialias: false
    });


// ==========================================
// ZAPPAR VARIABLES
// ==========================================

let pipeline = null;

let source = null;


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

    console.log("START AR");

    // เปลี่ยนจากหน้า Level 1 ไปหน้า AR
    level1Screen.classList.add("hidden");

    arScreen.classList.remove("hidden");


    // ปรับขนาด Canvas
    resizeCanvas();


    try {

        // ==========================================
        // CREATE ZAPPAR PIPELINE
        // ==========================================

        pipeline =
            new Zappar.Pipeline();


        // บอก Zappar ให้ใช้ WebGL context ของเรา
        pipeline.glContextSet(gl);


        // ==========================================
        // CREATE CAMERA SOURCE
        // ==========================================

        const deviceId =
            Zappar.cameraDefaultDeviceID();


        source =
            new Zappar.CameraSource(
                pipeline,
                deviceId
            );


        // ==========================================
        // REQUEST PERMISSION
        // ==========================================

        const granted =
            await Zappar.permissionRequest();


        if (!granted) {

            console.log("PERMISSION DENIED");

            Zappar.permissionDeniedUI();

            return;

        }


        console.log("PERMISSION GRANTED");


        // ==========================================
        // START CAMERA
        // ==========================================

        source.start();


        console.log("ZAPPAR CAMERA STARTED");


        // ==========================================
        // START RENDER LOOP
        // ==========================================

        animate();


    } catch (error) {

        console.error(
            "ZAPPAR ERROR:",
            error
        );

        alert(
            "ไม่สามารถเริ่ม AR ได้\n\n" +
            error.message
        );

    }

});


// ==========================================
// RESIZE CANVAS
// ==========================================

function resizeCanvas() {

    const width =
        window.innerWidth;

    const height =
        window.innerHeight;


    canvas.width =
        width;

    canvas.height =
        height;


    canvas.style.width =
        width + "px";

    canvas.style.height =
        height + "px";

}


window.addEventListener(
    "resize",
    resizeCanvas
);


// ==========================================
// AR RENDER LOOP
// ==========================================

function animate() {

    requestAnimationFrame(
        animate
    );


    if (!pipeline) {
        return;
    }


    // ==========================================
    // PROCESS CAMERA FRAME
    // ==========================================

    pipeline.processGL();


    // ==========================================
    // GET TRACKING RESULTS
    // ==========================================

    pipeline.frameUpdate();


    // ==========================================
    // UPLOAD CAMERA FRAME
    // ==========================================

    pipeline.cameraFrameUploadGL();


    // ==========================================
    // CLEAR SCREEN
    // ==========================================

    gl.clearColor(
        0,
        0,
        0,
        1
    );

    gl.clear(
        gl.COLOR_BUFFER_BIT
    );


    // ==========================================
    // DRAW CAMERA
    // ==========================================

    pipeline.cameraFrameDrawGL(
        canvas.width,
        canvas.height
    );

}


// ==========================================
// PAUSE CAMERA WHEN LEAVING PAGE
// ==========================================

document.addEventListener(
    "visibilitychange",
    function () {

        if (!source) {
            return;
        }


        if (
            document.visibilityState ===
            "hidden"
        ) {

            source.pause();

        } else {

            source.start();

        }

    }
);