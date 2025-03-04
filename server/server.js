// server/server.js
try {
    require('./dist/server.js');
    } catch (err) {
    console.error('Error loading server:', err);
    }