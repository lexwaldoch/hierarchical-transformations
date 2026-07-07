/**
 * Hierarchical 2D Transformations
 *
 * Interactive demonstration of hierarchical modeling using the HTML5 Canvas
 * API and glMatrix. Each segment inherits transformations from its parent,
 * illustrating local and world coordinate systems.
 */

function initialize() {
    const canvas = document.getElementById("myCanvas");
    const context = canvas.getContext("2d");

    const shoulderSlider = document.getElementById("slider1");
    const elbowSlider = document.getElementById("slider2");
    const wristSlider = document.getElementById("slider3");
    const branchSlider = document.getElementById("slider4");

    // Default slider positions
    shoulderSlider.value = -25;
    elbowSlider.value = 50;
    wristSlider.value = -50;
    branchSlider.value = 25;

    /**
     * Applies a transformation matrix to the canvas context.
     *
     * @param {mat3} transform
     */
    function applyTransform(transform) {
        context.setTransform(
            transform[0],
            transform[1],
            transform[3],
            transform[4],
            transform[6],
            transform[7]
        );
    }

    /**
     * Draws a single arm segment in local coordinates.
     */
    function drawSegment() {
        context.beginPath();
        context.fillStyle = "#A0E8AF";

        context.moveTo(10, -10);
        context.lineTo(90, -10);
        context.lineTo(90, 10);
        context.lineTo(10, 10);

        context.closePath();
        context.fill();
    }

    /**
     * Creates a transformation matrix relative to a parent transform.
     *
     * @param {glMatrix.mat3} parentTransform
     * @param {number[]} translation
     * @param {number} rotation
     * @param {number[]} scale
     * @returns {glMatrix.mat3}
     */
    function createTransform(
        parentTransform,
        translation,
        rotation,
        scale = [1, 1]
    ) {
        const local = glMatrix.mat3.create();

        glMatrix.mat3.fromTranslation(local, translation);
        glMatrix.mat3.rotate(local, local, rotation);
        glMatrix.mat3.scale(local, local, scale);

        const world = glMatrix.mat3.create();
       glMatrix.mat3.multiply(world, parentTransform, local);

        return world;
    }

    /**
     * Draws one transformed segment.
     *
     * @param {glMatrix.mat3} transform
     */
    function drawBranch(transform) {
        applyTransform(transform);
        drawSegment();
    }

    /**
     * Renders the complete articulated hierarchy.
     */
    function drawScene() {
        canvas.width = canvas.width;

        const shoulderAngle = shoulderSlider.value * 0.005 * Math.PI;
        const elbowAngle = elbowSlider.value * 0.005 * Math.PI;
        const wristAngle = wristSlider.value * 0.005 * Math.PI;
        const branchAngle = branchSlider.value * 0.005 * Math.PI;

        /*
         * Base segment
         */
        const baseToCanvas = glMatrix.mat3.create();
        glMatrix.mat3.fromTranslation(baseToCanvas, [50, 150]);

        drawBranch(baseToCanvas);

        /*
         * Upper arm
         */
        const upperArm = createTransform(
            baseToCanvas,
            [100, 0],
            shoulderAngle
        );

        drawBranch(upperArm);

        /*
         * Left forearm
         */
        const leftForearm = createTransform(
            upperArm,
            [100, 0],
            elbowAngle,
            [0.5, 1]
        );

        drawBranch(leftForearm);

        /*
         * Right forearm
         */
        const rightForearm = createTransform(
            upperArm,
            [100, 0],
            wristAngle,
            [0.5, 1]
        );

        drawBranch(rightForearm);

        /*
         * Secondary branch
         */
        const secondaryBranch = createTransform(
            baseToCanvas,
            [100, 0],
            branchAngle
        );

        drawBranch(secondaryBranch);
    }

    const sliders = [
        shoulderSlider,
        elbowSlider,
        wristSlider,
        branchSlider
    ];

    sliders.forEach(slider =>
        slider.addEventListener("input", drawScene)
    );

    drawScene();
}

window.addEventListener("load", initialize);
