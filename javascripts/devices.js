// Global variables
var trackPath = "live_set view selected_track devices";
var deviceObservers = []; // Array to store live.observer objects
var deviceNames = []; // Array to store device names

// Initialize the script
function init() {
    post("Initializing device monitor\n");
    observeDevices();
}

// Observe the devices in the selected track
function observeDevices() {
    clearObservers(); // Clear any existing observers

    // Create a live.path to access the devices of the selected track
    var track = new LiveAPI(trackPath);

    // Get the number of devices
    var deviceCount = track.getcount("devices");

    for (var i = 0; i < deviceCount; i++) {
        var devicePath = trackPath + " " + i; // Path to the ith device
        observeDevice(devicePath, i);
    }
}

// Observe a specific device
function observeDevice(devicePath, index) {
    // Create a live.object for the device
    var device = new LiveAPI(devicePath);

    // Get the current device name
    var name = device.get("name");
    deviceNames[index] = name;

    // Create a live.observer to watch for name changes
    var observer = new LiveAPI(function (args) {
        if (args[0] === "name") {
            deviceNames[index] = args[1];
            updateDeviceList();
        }
    });
    observer.path = devicePath;
    observer.property = "name";

    deviceObservers.push(observer); // Store the observer
}

// Update the device list (e.g., display in the Max UI)
function updateDeviceList() {
    post("Updated device names: " + deviceNames.join(", ") + "\n");
}

// Clear all observers
function clearObservers() {
    for (var i = 0; i < deviceObservers.length; i++) {
        deviceObservers[i].property = ""; // Detach the observer
    }
    deviceObservers = [];
    deviceNames = [];
}

// Handle when the track changes
function trackChanged() {
    post("Track changed, re-observing devices\n");
    observeDevices();
}

// Call `init` when the script is loaded
init();