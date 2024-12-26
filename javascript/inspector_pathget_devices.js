var devicesIDs = [];
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
  devicesIDs = [];
  deviceNames = [];
  var devicesPath = "live_set tracks " + id + " devices";
  var trackAPI = new LiveAPI();
  var children = trackAPI.children;

  for (var i = 0; i < children.length; i++) {
    var devicePath = devicesPath + " " + i;
    var deviceAPI = new LiveAPI(devicePath);
    devicesIDs.push(deviceAPI.id);
    deviceNames.push(deviceAPI.get("name"));
  }

  outlet(0, deviceNames.join(" "));
}

function processIndex(index) {
  var isValidIndex = (index >= 0 && index < devices.length);
  if (!isValidIndex) {
    return;
  }
  outlet(1, devices[index]);
}
