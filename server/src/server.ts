// In your server.ts
// Add this after your other middleware

// Try multiple possible locations for client files
const possibleClientPaths = [
  path.join(__dirname, 'client'),
  path.join(__dirname, '../client/build'),
  path.join(process.cwd(), 'client/build')
];

// Try each path until we find one that exists
let clientPath = null;
for (const testPath of possibleClientPaths) {
  try {
    const exists = fs.existsSync(testPath);
    if (exists) {
      clientPath = testPath;
      console.log('Found client files at:', clientPath);
      break;
    }
  } catch (err) {
    // Continue to next path
  }
}

// If we found a valid client path, serve those files
if (clientPath) {
  app.use(express.static(clientPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
  });
} else {
  console.log('No client build found, serving API only');
  // Serve a basic HTML page that links to the GraphQL playground
  app.get('/', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Book Search API</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            h1 { color: #333; }
            .link { color: #0066cc; }
          </style>
        </head>
        <body>
          <h1>Book Search API</h1>
          <p>The GraphQL API is running at <a class="link" href="/graphql">/graphql</a></p>
          <p>Client build not found. Please check your deployment configuration.</p>
        </body>
      </html>
    `);
  });
}