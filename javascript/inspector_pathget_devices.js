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
  trackAPI = new LiveAPI(id);
  devices = [];
  deviceNames = [];

  var deviceCount = trackAPI.getcount("devices");
  for (var i = 0; i < deviceCount; i++) {
    var devicePath = trackAPI.path + " devices " + i;
    var deviceAPI = new LiveAPI(devicePath);
    devices.push(deviceAPI.id);
    deviceNames.push(deviceAPI.get("name"));
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