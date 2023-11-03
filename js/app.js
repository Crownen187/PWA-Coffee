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
function cacheSave(blob){
  console.log('Saving data');
  theRecorder.stop();
  theStream.getTracks()[0].stop();
  therecorder.onstop= function(){
    var blob=new Blob(recordedChunks,{type:"video/webm"});
    saveToCache(blob);
  }
}function saveToCache(blob) {
  if ('caches' in window) {
    const videoKey = 'my_recorded_video.webm';
    const request = new Request(videoKey, { mode: 'no-cors' });
    const response = new Response(blob);

    caches.open('video-cache').then(cache => {
      cache.put(request, response).then(() => {
        console.log('Saved video to cache.');
      }).catch(error => {
        console.error('Failed to save video to cache:', error);
      });
    });
  } else {
    console.error('Cache API not supported');
  }
}

// Funktion zum Laden der aufgezeichneten Daten aus dem lokalen Speicher
function cacheLoad(){
  console.log('Loading data');
  var loadedblob=loadFromCache(blob);
  var url=(window.URL || window.webkitURL).createObjectURL(loadedblob);
loadedblob.play();

}
