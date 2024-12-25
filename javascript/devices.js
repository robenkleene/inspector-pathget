var trackAPI = null;
var devices = [];
var deviceNames = [];

TRACK_INLET = 0;
INDEX_INLET = 1;

// Inlets & Outlets
inlets = 2;
outlets = 2;

function msg_int(value) {
  if (inlet == TRACK_INLET)
  values[inlet] = value;
  outlet(inlet, "int " + value);
}



function inlet1(trackID) {
    if (trackAPI) {
        trackAPI.property = "";
    }

    trackAPI = new LiveAPI(trackID);

    if (trackAPI.getcount("devices") > 0) {
        updateDevices();
    } else {
        devices = [];
        deviceNames = [];
        outlet(0, "No devices found");
    }
}

function updateDevices() {
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

function inlet2(index) {
    if (index >= 0 && index < devices.length) {
        outlet(1, devices[index]);
    } else {
        outlet(1, "Invalid index");
    }
}
