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

function updateDevices(containerPath) {
  var api = new LiveAPI(containerPath);
  var deviceCount = api.getcount("devices");
  for (var i = 0; i < deviceCount; i++) {
    var devicePath = containerPath + " devices " + i;
    var deviceAPI = new LiveAPI(devicePath);
    deviceIDs.push(deviceAPI.id);
    deviceNames.push(String(deviceAPI.get("name")));
    devicePaths.push(devicePath);

    if (deviceAPI.get("can_have_chains") > 0) {
      var chainCount = deviceAPI.getcount("chains");
      for (var j = 0; j < chainCount; j++) {
        var chainsPath = devicePath + " chains " + j;
        updateDevices(chainsPath);
      }
      var returnChainCount = deviceAPI.getcount("return_chains");
      for (var k = 0; k < returnChainCount; k++) {
        var returnChainsPath = devicePath + " return_chains " + k;
        updateDevices(returnChainsPath);
      }
    }
  }
}

function processTrack(id) {
  deviceIDs = [];
  deviceNames = [];
  devicePaths = [];
  var trackPath = "live_set tracks " + id;
  updateDevices(trackPath);
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