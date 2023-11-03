document.addEventListener("DOMContentLoaded", showCoffees);

if (navigator.serviceWorker) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then(regEvent => console.log("Service worker registered!"))
      .catch(err => console.log("Service worker not registered"));
  });
}

// Funktion, um Benutzermedien zu erhalten
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

// Funktion, um die Video-Stream-Aufnahme zu starten
function getStream() {
  if (!navigator.getUserMedia && !navigator.webkitGetUserMedia &&
    !navigator.mozGetUserMedia && !navigator.msGetUserMedia) {
    alert('User Media API not supported.');
    return;
  }
  
  var constraints = { video: true, audio: true };
  getUserMedia(constraints, function (stream) {
    var mediaControl = document.querySelector('video');
    
    if ('srcObject' in mediaControl) {
      mediaControl.srcObject = stream;
    } else if (navigator.mozGetUserMedia) {
      mediaControl.mozSrcObject = stream;
    } else {
      mediaControl.src = (window.URL || window.webkitURL).createObjectURL(stream);
    }
    
    theStream = stream;
    try {
      var recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    } catch (e) {
      console.error('Exception while creating MediaRecorder: ' + e);
      return;
    }
    theRecorder = recorder;
    console.log('MediaRecorder created');
    recorder.ondataavailable = recorderOnDataAvailable;
    recorder.start(100);
  }, function (err) {
    alert('Error: ' + err);
  });
}

// Funktion, um aufgezeichnete Daten zu verarbeiten
function recorderOnDataAvailable(event) {
  if (event.data.size == 0) return;
  recordedChunks.push(event.data);
}

// Funktion zum Herunterladen der aufgezeichneten Daten
function download() {
  console.log('Saving data');
  theRecorder.stop();
  theStream.getTracks()[0].stop();

  var blob = new Blob(recordedChunks, { type: "video/webm" });
  var url = (window.URL || window.webkitURL).createObjectURL(blob);
  var a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  a.href = url;
  a.download = 'test.webm';
  a.click();
  
  // setTimeout() hier ist notwendig für Firefox.
  setTimeout(function () {
      (window.URL || window.webkitURL).revokeObjectURL(url);
  }, 100); 
}

// Funktion zum Speichern der aufgezeichneten Daten im lokalen Speicher
function cacheSave(){
  var blob = new Blob(recordedChunks, {type: "video/webm"});
  var url = (window.URL || window.webkitURL).createObjectURL(blob);
  window.localStorage.setItem('video', url);
}

// Funktion zum Laden der aufgezeichneten Daten aus dem lokalen Speicher
function cacheLoad(){
  var url = window.localStorage.getItem('video');
  // Video abspielen
  var mediaControl = document.querySelector('video');
  mediaControl.src = url;
  mediaControl.play();
}
