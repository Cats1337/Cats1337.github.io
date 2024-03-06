document.addEventListener("mousemove", (e) => {
    const eyes = document.querySelectorAll(".eye");

    eyes.forEach((eye) => {
        const boundingBox = eye.getBoundingClientRect();
        const eyeCenterX = boundingBox.left + boundingBox.width / 2;
        const eyeCenterY = boundingBox.top + boundingBox.height / 2;

        // Calculate the position of the left eye's pupil within the bounding box
        const dx = e.clientX - eyeCenterX;
        const dy = e.clientY - eyeCenterY;
        const angle = Math.atan2(dy, dx);
        const eyeRadius = Math.min(boundingBox.width / 2, boundingBox.height / 4);
        const distance = Math.min(Math.sqrt(dx * dx + dy * dy), eyeRadius);

        // Calculate the position of the left eye's pupil within the bounding box
        const pupilX = Math.cos(angle) * distance;
        const pupilY = Math.sin(angle) * distance + boundingBox.height / 4; // Adjust for pupil height

        // Set the position of both pupils within the bounding box
        const pupils = eye.querySelectorAll(".eye-pupil");
        pupils.forEach((pupil) => {
            pupil.style.transform = `translate(-50%, -50%) translate(${pupilX}px, ${pupilY}px)`;
        });

        // Mirror the position for the right eye's pupil
        const rightEye = eye.classList.contains("eye--right");
        if (rightEye) {
            const rightPupil = document.querySelector(".eye--right .eye-pupil");
            const eyeSide = boundingBox.width * -0.20; // Adjust for eye position
            const mirroredPupilX = pupilX - eyeSide;
            rightPupil.style.transform = `translate(-50%, -50%) translate(${mirroredPupilX}px, ${pupilY}px)`;
        }
    });
});
