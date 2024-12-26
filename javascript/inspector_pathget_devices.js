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
  updateDevices(trackPath);
  outlet(0, deviceNames);
}

function updateDevices(path) {
  var api = new LiveAPI(path);
  var deviceCount = api.getcount("devices");
  for (var i = 0; i < deviceCount; i++) {
    var devicePath = trackPath + " devices " + i;
    var deviceAPI = new LiveAPI(devicePath);
    deviceIDs.push(deviceAPI.id);
    deviceNames.push(String(deviceAPI.get("name")));
    // Strip quotes
    var path = String(deviceAPI.path).split('"')[1];
    devicePaths.push(path);

    if (deviceAPI.get("can_have_chains") > 0) {
      var chainCount = deviceAPI.getcount("chains");
      for (let j = 0; j < chainCount; j++) {
        updateDevices(path + " chains " + j);
      }
      var returnChainCount = deviceAPI.getcount("return_chains");
      for (let k = 0; k < returnChainCount; k++) {
        updateDevices(path + " return_chains " + k);
      }
    }
  }
}

function processIndex(index) {
  var isValidIndex = (index >= 0 && index < deviceIDs.length);
  if (!isValidIndex) {
    return;
  }
  outlet(1, deviceIDs[index]);
  outlet(2, devicePaths[index]);
}