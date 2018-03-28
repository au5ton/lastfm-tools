// main.js
// browser side

var client = io();

client.on('assign_session', (data) => {
    window.SESSION = data;
});

client.on('alert', (text) => {
    alert(text);
});

const emit = (eventName, eventData) => {
    client.emit(eventName, {
        sess: window.SESSION,
        data: eventData
    });
};