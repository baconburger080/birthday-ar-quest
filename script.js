// ==========================================
// ELEMENTS
// ==========================================

const startButton =
    document.getElementById(
        "startButton"
    );


const startARButton =
    document.getElementById(
        "startARButton"
    );


const introScreen =
    document.getElementById(
        "intro-screen"
    );


const level1Screen =
    document.getElementById(
        "level1-screen"
    );


const arScreen =
    document.getElementById(
        "ar-screen"
    );


const canvas =
    document.getElementById(
        "ar-canvas"
    );


const arMessage =
    document.getElementById(
        "ar-message"
    );


const placementDot =
    document.getElementById(
        "placement-dot"
    );


const placeButton =
    document.getElementById(
        "place-button"
    );


// ==========================================
// ZAPPAR VARIABLES
// ==========================================

let pipeline = null;

let cameraSource = null;

let instantTracker = null;

let gl = null;

let arRunning = false;


// ==========================================
// START GAME
// ==========================================

startButton.addEventListener(
    "click",
    function () {

        console.log(
            "GAME START"
        );


        introScreen.classList.add(
            "hidden"
        );


        level1Screen.classList.remove(
            "hidden"
        );

    }
);


// ==========================================
// START AR BUTTON
// ==========================================

startARButton.addEventListener(
    "click",
    async function () {

        console.log(
            "START AR BUTTON CLICKED"
        );


        level1Screen.classList.add(
            "hidden"
        );


        arScreen.classList.remove(
            "hidden"
        );


        try {

            await initializeAR();

        } catch (error) {

            console.error(
                "AR INITIALIZATION ERROR:",
                error
            );


            showError(
                error.message ||
                "Unknown AR error"
            );

        }

    }
);


// ==========================================
// INITIALIZE AR
// ==========================================

async function initializeAR() {

    console.log(
        "INITIALIZING ZAPPAR..."
    );


    // --------------------------------------
    // CHECK SDK
    // --------------------------------------

    if (
        typeof Zappar ===
        "undefined"
    ) {

        throw new Error(
            "Zappar SDK is not loaded."
        );

    }


    console.log(
        "ZAPPAR SDK OK"
    );


    // --------------------------------------
    // GET WEBGL
    // --------------------------------------

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
            "WebGL is not supported."
        );

    }


    console.log(
        "WEBGL OK"
    );


    // --------------------------------------
    // RESIZE
    // --------------------------------------

    resizeCanvas();


    // --------------------------------------
    // CREATE PIPELINE
    // --------------------------------------

    pipeline =
        new Zappar.Pipeline();


    console.log(
        "PIPELINE CREATED"
    );


    // --------------------------------------
    // CONNECT WEBGL
    // --------------------------------------

    pipeline.glContextSet(
        gl
    );


    console.log(
        "GL CONTEXT SET"
    );


    // --------------------------------------
    // CREATE CAMERA SOURCE
    // --------------------------------------

    const deviceId =
        Zappar.cameraDefaultDeviceID();


    cameraSource =
        new Zappar.CameraSource(
            pipeline,
            deviceId
        );


    console.log(
        "CAMERA SOURCE CREATED"
    );


    // --------------------------------------
    // CREATE WORLD TRACKER
    // --------------------------------------

    instantTracker =
        new Zappar.InstantWorldTracker(
            pipeline
        );


    console.log(
        "WORLD TRACKER CREATED"
    );


    // --------------------------------------
    // REQUEST PERMISSIONS
    // --------------------------------------

    console.log(
        "REQUESTING PERMISSION..."
    );


    const granted =
        await Zappar.permissionRequest();


    if (!granted) {

        throw new Error(
            "Camera permission was denied."
        );

    }


    console.log(
        "PERMISSION GRANTED"
    );


    // --------------------------------------
    // START CAMERA
    // --------------------------------------

    cameraSource.start();


    console.log(
        "CAMERA STARTED"
    );


    // --------------------------------------
    // SHOW UI
    // --------------------------------------

    arMessage.textContent =
        "SCAN THE GROUND";


    placementDot.style.display =
        "block";


    placeButton.style.display =
        "block";


    // --------------------------------------
    // START AR LOOP
    // --------------------------------------

    arRunning = true;


    requestAnimationFrame(
        renderAR
    );


    console.log(
        "AR STARTED SUCCESSFULLY"
    );

}


// ==========================================
// AR RENDER LOOP
// ==========================================

function renderAR() {

    requestAnimationFrame(
        renderAR
    );


    if (
        !arRunning ||
        !pipeline ||
        !gl
    ) {

        return;

    }


    // --------------------------------------
    // PROCESS CAMERA FRAME
    // --------------------------------------

    pipeline.processGL();


    // --------------------------------------
    // UPDATE TRACKING
    // --------------------------------------

    pipeline.frameUpdate();


    // --------------------------------------
    // DRAW CAMERA
    // --------------------------------------

    pipeline.cameraFrameUploadGL();


    pipeline.cameraFrameDrawGL(
        canvas.width,
        canvas.height
    );


    // --------------------------------------
    // RESET WEBGL STATE
    // --------------------------------------

    gl.bindFramebuffer(
        gl.FRAMEBUFFER,
        null
    );


    gl.bindTexture(
        gl.TEXTURE_2D,
        null
    );


    gl.bindBuffer(
        gl.ARRAY_BUFFER,
        null
    );


    gl.bindBuffer(
        gl.ELEMENT_ARRAY_BUFFER,
        null
    );


    gl.useProgram(
        null
    );


    gl.viewport(
        0,
        0,
        canvas.width,
        canvas.height
    );

}


// ==========================================
// PLACE
// ==========================================

placeButton.addEventListener(
    "click",
    function () {

        console.log(
            "PLACE BUTTON CLICKED"
        );


        if (!instantTracker) {

            console.error(
                "Instant tracker is missing."
            );

            return;

        }


        // ----------------------------------
        // CREATE WORLD ANCHOR
        // ----------------------------------

        instantTracker
            .setAnchorPoseFromCameraOffset(
                0,
                0,
                -2
            );


        // ----------------------------------
        // UPDATE UI
        // ----------------------------------

        arMessage.textContent =
            "WISH FOUND!";


        placementDot.style.display =
            "none";


        placeButton.style.display =
            "none";


        console.log(
            "WORLD ANCHOR PLACED"
        );

    }
);


// ==========================================
// RESIZE CANVAS
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

function showError(
    message
) {

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
// PAGE VISIBILITY
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

            if (arRunning) {

                cameraSource.start();

            }

        }

    }
);