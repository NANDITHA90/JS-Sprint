// let video = document.querySelector("video");  // to access the HTML element directly (not by ID)
let video = document.getElementById("video");
let constraints = {

    audio: false,
    video: true,
    
}
let recordBtnCont = document.querySelector(".record-btn-cont");
let recordBtn = document.querySelector(".record-btn");
let recordFlag = false;

let recorder; // stores undefined value
let chunks = []; // media data is stored in chunks

// access to media devices
navigator.mediaDevices.getUserMedia(constraints)

.then((stream) => {      // stream - Camera receiving continuous info.

    // make sure to give camera and microphone permissions as ASK BY DEFAULT / ALLOW
    video.srcObject = stream;  // srcObject is an attribute of Primitive Object (for live streaming) - Complex data / src is non-primitive (already stored file like an mp4...)
    recorder = new MediaRecorder(stream);
    
    recorder.addEventListener("start", (e) => {

        chunks = [];

    })

    recorder.addEventListener("dataavailable", (e) => {

        chunks.push(e.data);       // pushes the data in the empty array

    })

    recorder.addEventListener("stop", (e) => {

        // convert the media chunks data to video
        let blob = new Blob(chunks, {type : "video/mp4 "}); // take chunks as array and convert in the form of type video
        let videoURL = URL.createObjectURL(blob); // entire video is converted to video and they are converted to URL and are being sent to this
        let a = document.createElement("a");
        a.href = videoURL;
        a.download = "stream.mp4";
        a.click();

    })

    recordBtnCont.addEventListener("click", (e) => {
        if(!recorder) return; // whether recorder active or not

        recordFlag = !recordFlag;
        if (recordFlag) {   // start

            recorder.start();          // when clicked, record starts
            recordBtn.classList.add("scale-record");
            startTimer();

        } else {           // stop

            recorder.stop();
            recordBtn.classList.remove("scale-record");
            stopTimer();

        }
    })
});

/* SETTING UP TIMER COUNTS */

let timerId;

let counter = 0; /* Representing total seconds*/

let timer = document.querySelector(".timer");

function startTimer() {

    timer.style.display = "block";
    
    function displayTimer(){
        /*
            Calculating Time :

            1. Declare/Initialize a variable to store Number of Seconds
            2. Whenever displayTimer is called then we need to increment the counter variable, 
               as each call of this function is considered as 1 second in regular time, as we need to get the actual time when this thing needs counted.
            3. Counting Hours, Minutes, Seconds
                a. 1hr = 3600 seconds
                b. let counter = 3725
                c. 3725/3600 --> gives 1 (in JS 1.034722 is coverted to 1 - floor division)
                d. 3725%3600 = 125 --> Remainder value --> Minutes count in Seconds --> convert back to minutes --> 1 minute = 60 seconds

        */

        let totalSeconds = counter;

        let hours = Number.parseInt(totalSeconds / 3600);   /* gives hours */

        totalSeconds = totalSeconds % 3600;

        let minutes = Number.parseInt(totalSeconds / 60);   /* gives minutes */

        totalSeconds = totalSeconds % 60;

        let seconds = totalSeconds;

        hours = (hours < 10) ? `0${hours}`: hours;
        minutes = (minutes < 10) ? `0${minutes}`: minutes;
        seconds = (seconds < 10) ? `0${seconds}`: seconds;

        timer.innerText = `${hours}:${minutes}:${seconds}`;

        counter++;

    }

    timerId = setInterval(displayTimer, 1000); /* calling displayTimer() for every 1 second */
}

function stopTimer() {

    clearInterval(timerId);
    timer.innerText = "00:00:00";
    timer.style.display = "none";

}




/* CAPTURE BUTTON */

let captureBtnCont = document.querySelector(".capture-btn-cont");
let captureBtn = document.querySelector(".capture-btn");

captureBtnCont.addEventListener("click", (e) => {

    captureBtn.classList.add("scale-capture");  // adding animation

    let canvas = document.createElement("canvas");
    let imageURL = canvas.toDataURL("image/jpeg", 1.0);   // image/canvas converted to URl

    canvas.width = video.videoWidth;

    canvas.height = video.videoHeight;

    let tool = canvas.getContext("2d");

    tool.drawImage(video, 0, 0, canvas.width, canvas.height); 
    // filtering color
    tool.fillStyle = transparentColor;
    tool.fillRect(0, 0, canvas.width, canvas.height);


    // Downloading the Image
    let a = document.createElement("a");
    a.href = imageURL;
    a.download = "Image.jpeg";
    a.click();

    setTimeout(() => {

        captureBtn.classList.remove("scale-capture");  // removing animation

    }, 500);

});


// FILTERING LOGIC

let transparentColor = "transparent";
let filter = document.querySelector(".filter-layer");  // for entire canvas
let allFilters = document.querySelectorAll(".filter");

allFilters.forEach((filterElem) => {  // used to apply styling

    filterElem.addEventListener("click", (e) => {

        //get style
        transparentColor = getComputedStyle(filterElem).getPropertyValue("background-color");
        filter.style.backgroundColor = transparentColor;

    });

}); 



















































