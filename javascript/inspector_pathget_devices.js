var devices = [];
var deviceNames = [];

TRACK_INLET = 0;
INDEX_INLET = 1;

inlets = 2;
outlets = 2;

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
  var trackAPI = new LiveAPI("live_set tracks " + id);
  var devices = [];
  var deviceNames = [];
  var deviceIDs = trackAPI.children;

  for (var i = 0; i < deviceIDs.length; i++) {
    var devicePath = trackAPI.path + " " + deviceIDs[i];
    var deviceAPI = new LiveAPI(devicePath);
    devices.push(deviceAPI.id);
    deviceNames.push(deviceAPI.name);
  }

  outlet(0, deviceNames);
}

function processIndex(index) {
  var isValidIndex = (index >= 0 && index < devices.length);
  if (!isValidIndex) {
    return;
  }
  outlet(1, devices[index]);
}
