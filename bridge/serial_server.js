const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const WebSocket = require('ws');
const http = require('http');

// Create a basic HTTP server to attach the WebSocket server to
const server = http.createServer((req, res) => {
  if (req.url === '/ports') {
    // API endpoint to get available ports
    SerialPort.list().then(ports => {
      res.writeHead(200, { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' 
      });
      res.end(JSON.stringify(ports));
    }).catch(err => {
      res.writeHead(500);
      res.end(JSON.stringify({ error: err.message }));
    });
  } else {
    res.writeHead(200);
    res.end('ICPS Serial Bridge is running');
  }
});

const wss = new WebSocket.Server({ server });
let currentPort = null;

wss.on('connection', (ws) => {
  console.log('Client connected to WebSocket');
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      if (data.command === 'CONNECT') {
        const portPath = data.port;
        connectToSerial(portPath, ws);
      } else if (data.command === 'DISCONNECT') {
        if (currentPort && currentPort.isOpen) {
          currentPort.close();
          console.log('Serial port closed by client request');
          ws.send(JSON.stringify({ type: 'STATUS', status: 'DISCONNECTED' }));
        }
      }
    } catch (e) {
      console.error('Error parsing message:', e);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

function connectToSerial(portPath, ws) {
  if (currentPort && currentPort.isOpen) {
    currentPort.close();
  }

  console.log(`Attempting to connect to ${portPath} at 115200 baud...`);
  
  try {
    currentPort = new SerialPort({
      path: portPath,
      baudRate: 115200,
    });

    const parser = currentPort.pipe(new ReadlineParser({ delimiter: '\r\n' }));

    currentPort.on('open', () => {
      console.log(`Successfully opened ${portPath}`);
      ws.send(JSON.stringify({ 
        type: 'STATUS', 
        status: 'CONNECTED',
        port: portPath 
      }));
    });

    currentPort.on('error', (err) => {
      console.error('Serial Port Error:', err.message);
      ws.send(JSON.stringify({ 
        type: 'ERROR', 
        message: err.message 
      }));
    });

    parser.on('data', (data) => {
      console.log(`Received: ${data}`);
      
      // Parse the data string: SEQ=0,ADC=82,TEMP=40.04,FAN=ON,RELAY=ON,S1=81,S2=82,S3=83,S4=82
      if (data.startsWith('SEQ=')) {
        const parts = data.split(',');
        const parsedData = { type: 'DATA' };
        
        parts.forEach(part => {
          const [key, value] = part.split('=');
          if (key && value) {
            parsedData[key] = value;
          }
        });
        
        // Send parsed data to web client
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(parsedData));
        }
      } else if (data === 'ICPS_START') {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'STATUS', status: 'SYSTEM_READY' }));
        }
      }
    });
  } catch (err) {
    console.error('Failed to create SerialPort:', err);
    ws.send(JSON.stringify({ 
      type: 'ERROR', 
      message: err.message 
    }));
  }
}

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`ICPS Serial Bridge running on ws://localhost:${PORT}`);
  console.log(`HTTP API available at http://localhost:${PORT}`);
});
