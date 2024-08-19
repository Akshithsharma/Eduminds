// Emotion Detection Script
document.getElementById('start-camera').addEventListener('click', async () => {
    const video = document.getElementById('video');
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
    video.srcObject = stream;

    video.addEventListener('play', () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.width;
        canvas.height = video.height;
        document.body.append(canvas);

        const displaySize = { width: video.width, height: video.height };
        faceapi.matchDimensions(canvas, displaySize);

        setInterval(async () => {
            const detections = await faceapi.detectAllFaces(video).withFaceExpressions();
            const resizedDetections = faceapi.resizeResults(detections, displaySize);

            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
            faceapi.draw.drawDetections(canvas, resizedDetections);
            faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

            if (detections.length > 0) {
                const emotions = detections[0].expressions;
                const primaryEmotion = Object.keys(emotions).reduce((a, b) => emotions[a] > emotions[b] ? a : b);
                document.getElementById('emotion-text').textContent = primaryEmotion;
            }
        }, 100);
    });
});
