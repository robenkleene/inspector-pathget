var trackAPI = null; // LiveAPI object for the track
var devices = []; // Array to store device IDs
var deviceNames = []; // Array to store device names

// Function to handle input in the left inlet (track ID)
function inlet1(trackID) {
    if (trackAPI) {
        trackAPI.property = ""; // Detach observer from the old track
    }

    // Set up a new LiveAPI object for the given track ID
    trackAPI = new LiveAPI(trackID);

    // Check if the track has devices
    if (trackAPI.getcount("devices") > 0) {
        updateDevices();
    } else {
        devices = [];
        deviceNames = [];
        outlet(0, "No devices found");
    }
}

// Function to update the list of devices
function updateDevices() {
    // Clear the current lists
    devices = [];
    deviceNames = [];

    // Get the number of devices in the track
    var deviceCount = trackAPI.getcount("devices");

    // Iterate through devices
    for (var i = 0; i < deviceCount; i++) {
        var devicePath = trackAPI.path + " devices " + i;
        var deviceAPI = new LiveAPI(devicePath);

        // Store the device ID and name
        devices.push(deviceAPI.id);
        deviceNames.push(deviceAPI.get("name"));
    }

    // Output the device names to the left outlet
    outlet(0, deviceNames);
}

// Function to handle input in the right inlet (index value)
function inlet2(index) {
    if (index >= 0 && index < devices.length) {
        // Output the device ID to the right outlet
        outlet(1, devices[index]);
    } else {
        outlet(1, "Invalid index");
    }
}

// Initialization
function bang() {
    post("track_devices.js loaded\n");
}