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

const arMessage =
    document.getElementById("ar-message");

const placementDot =
    document.getElementById("placement-dot");

const placeButton =
    document.getElementById("place-button");

const heartObject =
    document.getElementById("heart-object");

const heartCount =
    document.getElementById("heartCount");


// ==========================================
// ZAPPAR VARIABLES
// ==========================================

let pipeline = null;

let cameraSource = null;

let instantTracker = null;

let gl = null;

let hasPlaced = false;

let hearts = 0;


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

        console.log("START AR");

        level1Screen.classList.add("hidden");

        arScreen.classList.remove("hidden");


        try {

            await startZapparAR();

        } catch (error) {

            console.error(
                "ZAPPAR ERROR:",
                error
            );

            showError(
                error.message ||
                "ไม่สามารถเริ่ม AR ได้"
            );

        }

    }
);


// ==========================================
// START ZAPPAR AR
// ==========================================

async function startZapparAR() {

    // ------------------------------------------
    // CHECK ZAPPAR
    // ------------------------------------------

    if (
        typeof Zappar ===
        "undefined"
    ) {

        throw new Error(
            "Zappar SDK โหลดไม่สำเร็จ"
        );

    }


    console.log(
        "Zappar SDK loaded"
    );


    // ------------------------------------------
    // GET WEBGL
    // ------------------------------------------

    gl =
        canvas.getContext(
            "webgl",
            {
                alpha: false,
                antialias: true
            }
        );


    if (!gl) {

        throw new Error(
            "อุปกรณ์นี้ไม่รองรับ WebGL"
        );

    }


    // ------------------------------------------
    // RESIZE CANVAS
    // ------------------------------------------

    resizeCanvas();


    // ------------------------------------------
    // CREATE PIPELINE
    // ------------------------------------------

    pipeline =
        new Zappar.Pipeline();


    // ------------------------------------------
    // CONNECT WEBGL
    // ------------------------------------------

    pipeline.glContextSet(gl);


    // ------------------------------------------
    // CREATE CAMERA
    // ------------------------------------------

    const deviceId =
        Zappar.cameraDefaultDeviceID();


    cameraSource =
        new Zappar.CameraSource(
            pipeline,
            deviceId
        );


    // ------------------------------------------
    // CREATE WORLD TRACKER
    // ------------------------------------------

    instantTracker =
        new Zappar.InstantWorldTracker(
            pipeline
        );


    // ------------------------------------------
    // REQUEST PERMISSIONS
    // ------------------------------------------

    const granted =
        await Zappar.permissionRequest();


    if (!granted) {

        Zappar.permissionDeniedUI();

        throw new Error(
            "ไม่ได้รับอนุญาตให้ใช้กล้องหรือ Motion Sensors"
        );

    }


    // ------------------------------------------
    // START CAMERA
    // ------------------------------------------

    cameraSource.start();


    console.log(
        "Zappar camera started"
    );


    // ------------------------------------------
    // INITIAL UI
    // ------------------------------------------

    arMessage.textContent =
        "SCAN THE GROUND";


    placementDot.style.display =
        "block";


    placeButton.style.display =
        "block";


    placeButton.textContent =
        "TAP TO PLACE";


    heartObject.classList.add(
        "hidden"
    );


    // ------------------------------------------
    // START RENDER LOOP
    // ------------------------------------------

    requestAnimationFrame(
        renderAR
    );

}


// ==========================================
// RENDER LOOP
// ==========================================

function renderAR() {

    requestAnimationFrame(
        renderAR
    );


    if (
        !pipeline ||
        !gl
    ) {

        return;

    }


    // ------------------------------------------
    // PROCESS CAMERA FRAME
    // ------------------------------------------

    pipeline.processGL();


    // ------------------------------------------
    // UPDATE TRACKING
    // ------------------------------------------

    pipeline.frameUpdate();


    // ------------------------------------------
    // RESIZE
    // ------------------------------------------

    resizeCanvas();


    gl.viewport(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // ------------------------------------------
    // UPLOAD CAMERA FRAME
    // ------------------------------------------

    pipeline.cameraFrameUploadGL();


    // ------------------------------------------
    // DRAW CAMERA
    // ------------------------------------------

    pipeline.cameraFrameDrawGL(
        canvas.width,
        canvas.height
    );


    // ------------------------------------------
    // WORLD TRACKING
    // ------------------------------------------

    if (!hasPlaced) {

        /*
         * Choose a point approximately
         * 5 units in front of the camera.
         *
         * This is the placement point used
         * by Zappar Instant World Tracking.
         */

        instantTracker
            .setAnchorPoseFromCameraOffset(
                0,
                0,
                -5
            );


    } else {

        /*
         * Once placed, the anchor remains
         * associated with the chosen world point.
         */

    }

}


// ==========================================
// PLACE OBJECT
// ==========================================

placeButton.addEventListener(
    "click",
    function () {

        if (!instantTracker) {

            return;

        }


        console.log(
            "PLACE OBJECT"
        );


        // --------------------------------------
        // LOCK PLACEMENT
        // --------------------------------------

        hasPlaced = true;


        // --------------------------------------
        // CHANGE UI
        // --------------------------------------

        arMessage.textContent =
            "WISH FOUND!";


        placementDot.style.display =
            "none";


        placeButton.style.display =
            "none";


        // --------------------------------------
        // SHOW TEMPORARY HEART
        // --------------------------------------

        heartObject.classList.remove(
            "hidden"
        );


        console.log(
            "HEART PLACED"
        );

    }
);


// ==========================================
// HEART CLICK
// ==========================================

heartObject.addEventListener(
    "click",
    function () {

        collectHeart();

    }
);


// ==========================================
// COLLECT HEART
// ==========================================

function collectHeart() {

    hearts++;

    if (hearts > 3) {

        hearts = 3;

    }


    heartCount.textContent =
        hearts;


    heartObject.classList.add(
        "hidden"
    );


    arMessage.textContent =
        "WISH FOUND ♥";


    console.log(
        "HEARTS:",
        hearts
    );


    if (hearts >= 3) {

        arMessage.textContent =
            "3 WISHES FOUND!";

    }

}


// ==========================================
// RESIZE
// ==========================================

function resizeCanvas() {

    if (!canvas) {

        return;

    }


    const width =
        window.innerWidth;

    const height =
        window.innerHeight;


    const pixelRatio =
        window.devicePixelRatio ||
        1;


    canvas.width =
        Math.floor(
            width *
            pixelRatio
        );


    canvas.height =
        Math.floor(
            height *
            pixelRatio
        );


    canvas.style.width =
        width + "px";


    canvas.style.height =
        height + "px";

}


// ==========================================
// WINDOW RESIZE
// ==========================================

window.addEventListener(
    "resize",
    function () {

        resizeCanvas();

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
        "AR ERROR";


    alert(
        "ไม่สามารถเริ่ม AR ได้\n\n" +
        message
    );

}


// ==========================================
// VISIBILITY
// ==========================================

document.addEventListener(
    "visibilitychange",
    function () {

        if (!cameraSource) {

            return;

        }


        if (
            document.visibilityState ===
            "hidden"
        ) {

            cameraSource.pause();

        } else {

            cameraSource.start();

        }

    }
);