const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

async function setupCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    return new Promise((resolve) => {
        video.onloadedmetadata = () => {
            resolve(video);
        };
    });
}

async function loadModel() {
    // Load the COCO-SSD model
    const model = await cocoSsd.load();
    return model;
}

async function detectFrame(model) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const predictions = await model.detect(video);
    drawPredictions(predictions);
    requestAnimationFrame(() => {
        detectFrame(model);
    });
}

function drawPredictions(predictions) {
    predictions.forEach(prediction => {
        ctx.beginPath();
        ctx.rect(prediction.bbox[0], prediction.bbox[1], prediction.bbox[2], prediction.bbox[3]);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'red';
        ctx.fillStyle = 'red';
        ctx.stroke();
        ctx.fillText(`${prediction.class} (${Math.round(prediction.score * 100)}%)`, prediction.bbox[0], prediction.bbox[1] > 10 ? prediction.bbox[1] - 5 : 10);
    });
}

async function main() {
    await setupCamera();
    ctx.canvas.width = video.videoWidth;
    ctx.canvas.height = video.videoHeight;
    const model = await loadModel();
    detectFrame(model);
}

main();
