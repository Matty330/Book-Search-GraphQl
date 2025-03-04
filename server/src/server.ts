// server/src/server.ts
// Update the static file serving code

// First, add a debug statement to check paths
console.log('Current directory:', process.cwd());
console.log('__dirname:', __dirname);

// Then fix the static file and catch-all route paths
if (process.env.NODE_ENV === 'production') {
  // Try different paths that might work in the Render environment
  const clientPath = path.join(process.cwd(), 'client/build');
  const altClientPath = path.join(process.cwd(), '../client/build');
  
  console.log('Checking client path:', clientPath);
  console.log('Checking alt client path:', altClientPath);
  
  // Check if these paths exist
  console.log('Client path exists:', require('fs').existsSync(clientPath));
  console.log('Alt client path exists:', require('fs').existsSync(altClientPath));
  
  // Use the path that exists
  const buildPath = require('fs').existsSync(clientPath) ? clientPath : altClientPath;
  
  app.use(express.static(buildPath));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}