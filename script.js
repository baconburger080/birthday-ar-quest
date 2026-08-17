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


// ==========================================
// ZAPPAR VARIABLES
// ==========================================

let pipeline = null;

let source = null;

let gl = null;


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
            "=============================="
        );

        console.log(
            "START AR BUTTON CLICKED"
        );

        console.log(
            "Zappar version:",
            Zappar
        );

        console.log(
            "=============================="
        );


        // ==========================================
        // SHOW AR SCREEN
        // ==========================================

        level1Screen.classList.add("hidden");

        arScreen.classList.remove("hidden");


        // ==========================================
        // CHECK ZAPPAR
        // ==========================================

        if (
            typeof Zappar ===
            "undefined"
        ) {

            showError(
                "Zappar SDK ไม่ถูกโหลด"
            );

            return;

        }


        // ==========================================
        // CHECK CANVAS
        // ==========================================

        if (!canvas) {

            showError(
                "ไม่พบ AR Canvas"
            );

            return;

        }


        // ==========================================
        // CREATE WEBGL CONTEXT
        // ==========================================

        try {

            gl =
                canvas.getContext(
                    "webgl",
                    {
                        alpha: false,
                        antialias: true
                    }
                );


            if (!gl) {

                showError(
                    "Browser ไม่รองรับ WebGL"
                );

                return;

            }


            console.log(
                "WEBGL CONTEXT CREATED"
            );


        } catch (error) {

            showError(
                "สร้าง WebGL ไม่สำเร็จ\n\n" +
                error.message
            );

            return;

        }


        // ==========================================
        // RESIZE CANVAS
        // ==========================================

        resizeCanvas();


        // ==========================================
        // CREATE PIPELINE
        // ==========================================

        try {

            console.log(
                "CREATING PIPELINE..."
            );


            pipeline =
                new Zappar.Pipeline();


            console.log(
                "PIPELINE CREATED"
            );


            // ==========================================
            // SET WEBGL CONTEXT
            // ==========================================

            pipeline.glContextSet(
                gl
            );


            console.log(
                "WEBGL CONTEXT SET"
            );


        } catch (error) {

            showError(
                "สร้าง Zappar Pipeline ไม่สำเร็จ\n\n" +
                error.message
            );

            return;

        }


        // ==========================================
        // CREATE CAMERA SOURCE
        // ==========================================

        try {

            console.log(
                "CREATING CAMERA SOURCE..."
            );


            const deviceId =
                Zappar.cameraDefaultDeviceID();


            console.log(
                "CAMERA DEVICE:",
                deviceId
            );


            source =
                new Zappar.CameraSource(
                    pipeline,
                    deviceId
                );


            console.log(
                "CAMERA SOURCE CREATED"
            );


        } catch (error) {

            showError(
                "สร้าง Camera Source ไม่สำเร็จ\n\n" +
                error.message
            );

            return;

        }


        // ==========================================
        // REQUEST PERMISSION
        // ==========================================

        try {

            console.log(
                "REQUESTING PERMISSION..."
            );


            const granted =
                await Zappar.permissionRequest();


            console.log(
                "PERMISSION RESULT:",
                granted
            );


            if (!granted) {

                showError(
                    "ไม่ได้รับอนุญาตให้ใช้กล้องหรือ Motion Sensor"
                );

                return;

            }


        } catch (error) {

            showError(
                "ขอ Permission ไม่สำเร็จ\n\n" +
                error.message
            );

            return;

        }


        // ==========================================
        // START CAMERA
        // ==========================================

        try {

            console.log(
                "STARTING CAMERA..."
            );


            source.start();


            console.log(
                "CAMERA STARTED"
            );


        } catch (error) {

            showError(
                "เปิดกล้อง Zappar ไม่สำเร็จ\n\n" +
                error.message
            );

            return;

        }


        // ==========================================
        // UPDATE UI
        // ==========================================

        if (arMessage) {

            arMessage.textContent =
                "SCAN THE GROUND";

        }


        // ==========================================
        // START RENDER LOOP
        // ==========================================

        console.log(
            "STARTING RENDER LOOP..."
        );


        requestAnimationFrame(
            animate
        );

    }
);


// ==========================================
// RENDER LOOP
// ==========================================

function animate() {

    requestAnimationFrame(
        animate
    );


    if (
        !pipeline ||
        !gl
    ) {

        return;

    }


    try {

        // ==========================================
        // PROCESS CAMERA
        // ==========================================

        pipeline.processGL();


        // ==========================================
        // UPDATE FRAME
        // ==========================================

        pipeline.frameUpdate();


        // ==========================================
        // CLEAR SCREEN
        // ==========================================

        gl.bindFramebuffer(
            gl.FRAMEBUFFER,
            null
        );


        gl.viewport(
            0,
            0,
            canvas.width,
            canvas.height
        );


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

        if (
            typeof pipeline.cameraFrameUploadGL ===
            "function"
        ) {

            pipeline.cameraFrameUploadGL();

        }


        if (
            typeof pipeline.cameraFrameDrawGL ===
            "function"
        ) {

            pipeline.cameraFrameDrawGL(
                canvas.width,
                canvas.height
            );

        }


    } catch (error) {

        console.error(
            "AR RENDER ERROR:",
            error
        );


        // หยุดการแสดง error ซ้ำรัวๆ
        if (
            arMessage &&
            arMessage.dataset.errorShown !==
            "true"
        ) {

            arMessage.dataset.errorShown =
                "true";

            arMessage.textContent =
                "AR ERROR: " +
                error.message;

        }

    }

}


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
        Math.min(
            window.devicePixelRatio || 1,
            2
        );


    canvas.width =
        width * pixelRatio;

    canvas.height =
        height * pixelRatio;


    canvas.style.width =
        width + "px";

    canvas.style.height =
        height + "px";


    if (gl) {

        gl.viewport(
            0,
            0,
            canvas.width,
            canvas.height
        );

    }

}


window.addEventListener(
    "resize",
    resizeCanvas
);


// ==========================================
// VISIBILITY CHANGE
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

            console.log(
                "PAGE HIDDEN - PAUSING CAMERA"
            );

            source.pause();


        } else {

            console.log(
                "PAGE VISIBLE - STARTING CAMERA"
            );

            source.start();

        }

    }
);


// ==========================================
// ERROR DISPLAY
// ==========================================

function showError(
    message
) {

    console.error(
        "ZAPPAR ERROR:",
        message
    );


    if (arMessage) {

        arMessage.textContent =
            "AR ERROR";

    }


    alert(
        "ไม่สามารถเริ่ม AR ได้\n\n" +
        message
    );

}