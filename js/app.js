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

function getStream() {
  if (!navigator.getUserMedia && !navigator.webkitGetUserMedia &&
    !navigator.mozGetUserMedia && !navigator.msGetUserMedia) {
    alert('User Media API not supported.');
    return;
  }
  
  var constraints = {video: true, audio: true};
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
      recorder = new MediaRecorder(stream, {mimeType : "video/webm"});
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

function recorderOnDataAvailable(event) {
  if (event.data.size == 0) return;
  recordedChunks.push(event.data);
}

function download() {
  console.log('Saving data');
  theRecorder.stop();
  theStream.getTracks()[0].stop();

  var blob = new Blob(recordedChunks, {type: "video/webm"});
  var url = (window.URL || window.webkitURL).createObjectURL(blob);
  var a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  a.href = url;
  a.download = 'test.webm';
  a.click();
  
  // setTimeout() here is needed for Firefox.
  setTimeout(function () {
      (window.URL || window.webkitURL).revokeObjectURL(url);
  }, 100); }
  function stopStream() {
    if (theStream) {
      var tracks = theStream.getTracks();
      tracks.forEach(function (track) {
        track.stop();
      });
    }
  }
  

  function saveVideoToCache() {
    console.log('Save to Cache button clicked.'); 
    if (recordedChunks.length > 0) {
      var fullVideoBlob = new Blob(recordedChunks, { type: 'video/webm' });
  
      var reader = new FileReader();
      reader.onload = function() {
        localStorage.setItem('savedVideo', reader.result);
        alert('Video wurde im Cache gespeichert.');
      };
      
      reader.readAsDataURL(fullVideoBlob);
    } else {
      alert('Es gibt keine aufgezeichneten Daten zum Speichern.');
    }
  }
  
  
  
  function playVideoFromCache() {
    var savedVideoData = localStorage.getItem('savedVideo');
    if (savedVideoData) {
      var savedBlob = new Blob([savedVideoData], { type: 'video/webm' });
      var savedVideoURL = URL.createObjectURL(savedBlob);
  
      // Open a new video window, but also add a video element to display it
      var videoWindow = window.open(savedVideoURL, 'Video Player');
      
      // Create a new video element to display the cached video
      var cachedVideoElement = document.createElement('video');
      cachedVideoElement.src = savedVideoURL;
      cachedVideoElement.controls = true;
      cachedVideoElement.style.width = '240px';
      cachedVideoElement.style.height = '180px';
      
      // Append the video element to the current document's body
      document.body.appendChild(cachedVideoElement);
    } else {
      alert('Kein Video im Cache gefunden.');
    }
  }
  
  
  
  
// Get references to the buttons by their IDs
var startRecordingButton = document.getElementById('startRecordingButton');
var stopButton = document.getElementById('stopButton');
var playFromCacheButton = document.getElementById('playFromCacheButton');
var saveToCacheButton = document.getElementById('saveToCacheButton');
var downloadButton = document.getElementById('downloadButton');

// Add event listeners to the buttons
startRecordingButton.addEventListener('click', getStream);
stopButton.addEventListener('click', stopStream);
playFromCacheButton.addEventListener('click', playVideoFromCache);
saveToCacheButton.addEventListener('click', saveVideoToCache);
downloadButton.addEventListener('click', download);
