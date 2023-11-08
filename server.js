const fs = require('fs');
const WebSocket = require('ws');

const keywords = {
    'sea': ['https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg', 
    'https://images.pexels.com/photos/1295036/pexels-photo-1295036.jpeg',
    'https://images.pexels.com/photos/756856/pexels-photo-756856.jpeg'],
    'beach': ['https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg',
    'https://images.pexels.com/photos/1151282/pexels-photo-1151282.jpeg',
    'https://images.pexels.com/photos/1049298/pexels-photo-1049298.jpeg'],
    'mountains': ['https://images.pexels.com/photos/4652275/pexels-photo-4652275.jpeg',
    'https://images.pexels.com/photos/12779583/pexels-photo-12779583.jpeg',
    'https://images.pexels.com/photos/1586298/pexels-photo-1586298.jpeg'],    
};

let MAX_CONCURRENT_THREADS = 1; 
fs.readFile('config.txt', 'utf8', function(err, data) {
  if (!err) {
    MAX_CONCURRENT_THREADS = Number(data);
    console.log('MAX_CONCURRENT_THREADS set to', MAX_CONCURRENT_THREADS);
  } else {
    console.error('Failed to read config.txt:', err);
  }
}); 

const server = new WebSocket.Server({ port: 8080 });

server.on('connection', (socket) => {
  console.log('Client connected');
  let threadCount = 0; 

  socket.on('message', (message) => {
    console.log(`Received message: ${message}`);
    const urls = keywords[message];
    if (threadCount < MAX_CONCURRENT_THREADS) {
      threadCount++;

      if (urls) {
        socket.send(JSON.stringify(urls));
      } else {
        socket.send(JSON.stringify(new String('empty')));
      }

      console.log('Started stream');
    } else {
      console.log('Maximum concurrent streams reached');
    }
  });

  socket.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log("Server started on port 8080");