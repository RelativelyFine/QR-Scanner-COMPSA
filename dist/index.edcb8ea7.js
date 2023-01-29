const qrcodeBtn = window.qrcode;
const video = document.createElement("video");
const canvasElement = document.getElementById("qr-canvas");
const canvas = canvasElement.getContext("2d");
const qrResult = document.getElementById("qr-result");
const outputData = document.getElementById("outputData");
const btnScanQR = document.getElementById("btn-scan-qr");
const backButton = document.getElementById("backButton");
const error = document.getElementById("error");
const errorData = document.getElementById("errorData");
let scanning = false;
qrcodeBtn.callback = async (res)=>{
    await closeQR(res);
};
backButton.onclick = async (res)=>{
    await closeQR(res);
};
const closeQR = async (res)=>{
    if (res) {
        scanning = false;
        video.srcObject.getTracks().forEach((track)=>{
            track.stop();
        });
        if (res.type == "click") outputData.innerText = "Scan Cancelled!";
        else {
            outputData.innerText = res;
            await backendInterface(res);
        }
        qrResult.hidden = false;
        backButton.hidden = true;
        canvasElement.hidden = true;
        btnScanQR.hidden = false;
    }
};
btnScanQR.onclick = ()=>{
    navigator.mediaDevices.getUserMedia({
        video: {
            facingMode: "environment"
        }
    }).then(function(stream) {
        backButton.hidden = false;
        scanning = true;
        qrResult.hidden = true;
        btnScanQR.hidden = true;
        canvasElement.hidden = false;
        video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
        video.srcObject = stream;
        video.play();
        tick();
        scan();
    });
};
function tick() {
    canvasElement.height = video.videoHeight;
    canvasElement.width = video.videoWidth;
    canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
    scanning && requestAnimationFrame(tick);
}
function scan() {
    try {
        qrcode.decode();
    } catch (e) {
        setTimeout(scan, 300);
    }
}
async function backendInterface(res) {
    net_id = await JSON.parse(res).net_id;
    award_id = await document.getElementById("award-id").value;
    url = `https://compsa.ca/api/admin/manage?net_id=${net_id}&award_id=${award_id}`;
    await fetch(url).then((res)=>{
        console.log(res);
        error.hidden = true;
        errorData.innerText = "";
    }).catch((err)=>{
        console.log(err);
        error.hidden = false;
        errorData.innerText = err;
    });
}

//# sourceMappingURL=index.edcb8ea7.js.map
