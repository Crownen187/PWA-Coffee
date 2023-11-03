document.addEventListener("DOMContentLoaded", showCoffees);

if (navigator.serviceWorker) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then(regEvent => console.log("Service worker registered!"))
      .catch(err => console.log("Service worker not registered"));
  });
}

function getUserMedia(options, successCallback, failureCallback) {
  var api = navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia;
  if (api) {
    return api.bind(navigator)(options, successCallback, failureCallback);
  }
}

var theStream;
var theRecorder;
var recordedChunks = [];
var isRecording = false; // Nur eine Deklaration von isRecording am Anfang

function getStream() {
  if (isRecording) {
    alert('Recording is already in progress.');
    return;
  }
  
  // Rest des Codes bleibt unverändert
}

function stopStream() {
  if (!isRecording) {
    alert('No recording in progress to stop.');
    return;
  }

  theRecorder.stop();
  theStream.getTracks().forEach(track => track.stop());
  isRecording = false;
}

var cachedStream = null;

function cacheStream() {
  if (isRecording) {
    alert('Stop the recording before caching the stream.');
    return;
  }

  if (theStream) {
    cachedStream = theStream.clone();
    alert('Stream has been cached.');
  } else {
    alert('No stream available to cache.');
  }
}

function playCachedStream() {
  if (cachedStream) {
    var cachedVideo = document.getElementById('cachedVideo');
    cachedVideo.srcObject = cachedStream;
    cachedVideo.style.display = 'block';
    cachedVideo.play();
  } else {
    alert('No cached stream available.');
  }
}
