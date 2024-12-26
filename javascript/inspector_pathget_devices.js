var deviceIDs = [];
var deviceNames = [];
var devicePaths = [];

TRACK_INLET = 0;
INDEX_INLET = 1;

inlets = 2;
outlets = 3;

function msg_int(value) {
  switch (inlet) {
  case TRACK_INLET:
    processTrack(value);
    break;
  case INDEX_INLET:
    processIndex(value);
    break;
  default:
    break;
  }
}

function processTrack(id) {
  deviceIDs = [];
  deviceNames = [];
  var trackPath = "live_set tracks " + id;
  var trackAPI = new LiveAPI(trackPath);
  var deviceCount = trackAPI.getcount("devices");
  for (var i = 0; i < deviceCount; i++) {
    var devicePath = trackPath + " devices " + i;
    var deviceAPI = new LiveAPI(devicePath);
    deviceIDs.push(deviceAPI.id);
    deviceNames.push(String(deviceAPI.get("name")));
    // Strip quotes
    var path = String(deviceAPI.path).split('"')[1];
    devicePaths.push(path);
  }
  outlet(0, deviceNames);
}

function processIndex(index) {
  var isValidIndex = (index >= 0 && index < deviceIDs.length);
  if (!isValidIndex) {
    return;
  }
  outlet(1, deviceIDs[index]);
  outlet(2, devicePaths[index]);
}