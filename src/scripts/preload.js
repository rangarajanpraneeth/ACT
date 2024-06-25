const fs = require('fs');
const path = require('path');
const dgram = require('dgram');
const server = dgram.createSocket('udp4');
// server information
const HOST = '127.0.0.1';
const PORT = 9996;

// operation ids
const HANDSHAKE = 0;
const SUBSCRIBE_UPDATE = 1;
const SUBSCRIBE_SPOT = 2;
const DISMISS = 3;

// set local time and date
const prefs = { hour: '2-digit', minute: '2-digit' }
let dateContainer = document.querySelector('.local__date');
let timeContainer = document.querySelector('.local__time');

const raw = new Date();
let date = `${raw.getMonth() + 1}/${raw.getDate()}/${raw.getFullYear()}`;
let time = new Date().toLocaleTimeString('en-US', prefs);
dateContainer.innerHTML = date;
timeContainer.innerHTML = time.replace(/^0+/, '');

setInterval(function () {
   const raw = new Date();
   let date = `${raw.getMonth() + 1}/${raw.getDate()}/${raw.getFullYear()}`;
   let time = new Date().toLocaleTimeString('en-US', prefs);
   dateContainer.innerHTML = date;
   timeContainer.innerHTML = time.replace(/^0+/, '');
}, 1000);

const HEADERS_PATH = path.join(__dirname, '../constants', 'headers.txt');
const HEADERS = fs.readFileSync(HEADERS_PATH, 'utf-8');
let RECORDING = false;
let RACE_DATA = '';

// recording functions
const startRecording = () => {
   // return if already recording
   if (RECORDING) return;
   console.log('Started recording');
   RECORDING = true;
}

const pauseRecording = () => {
   // return if not already recording
   if (!RECORDING) return;
   console.log('Paused recording');
   RECORDING = false;
}

const stopRecording = () => {
   // return if not already recording
   if (!RECORDING) return;
   console.log('Stopped recording');
   RECORDING = false;

   const fileName = String(Date.now());
   const filePath = path.join(__dirname, '../data', `${fileName}.csv`);
   fs.writeFileSync(filePath, HEADERS + RACE_DATA, {
      encoding: 'utf-8',
      flag: 'w'
   });

   RACE_DATA = '';
}

// utility functions
// const readString = (buffer, start, length) => {
//    let string = buffer.toString('binary', start, start + length);
//    let tokens = string.split('%');
//    return tokens[0];
// }

const send = operation => {
   let message = new Buffer.alloc(12);
   message.writeInt32LE(1, 0);
   message.writeInt32LE(1, 4);
   message.writeInt32LE(operation, 8);
   server.send(message, 0, message.length, PORT, HOST);
}

const startSession = () => {
   send(HANDSHAKE);
   send(SUBSCRIBE_UPDATE);
}

const stopSession = () => {
   send(DISMISS);
}

const requestSessionInfo = () => {
}

const parsePackets = packets => {
   return {
      speedKPH: packets.readFloatLE(8),
      speedMPH: packets.readFloatLE(12),
      speedMPS: packets.readFloatLE(16),
      absEnabled: packets.readInt8(20),
      absActive: packets.readInt8(21),
      tcEnabled: packets.readInt8(23),
      tcActive: packets.readInt8(22),
      inPit: packets.readInt8(24),
      engineLimitedOn: packets.readInt8(25),
      accelerationGVertical: packets.readFloatLE(28),
      accelerationGHorizontal: packets.readFloatLE(32),
      accelerationGFrontal: packets.readFloatLE(36),
      currentLap: packets.readInt32LE(40),
      lastLap: packets.readInt32LE(44),
      bestLap: packets.readInt32LE(48),
      laps: packets.readInt32LE(52),
      gas: packets.readFloatLE(56),
      brake: packets.readFloatLE(60),
      clutch: packets.readFloatLE(64),
      engineRPM: packets.readFloatLE(68),
      steering: packets.readFloatLE(72),
      gear: packets.readInt32LE(76),
      cgHeight: packets.readFloatLE(80),
      wheelAngularSpdFL: packets.readFloatLE(84),
      wheelAngularSpdFR: packets.readFloatLE(88),
      wheelAngularSpdRL: packets.readFloatLE(92),
      wheelAngularSpdRR: packets.readFloatLE(96),
      slipAngleFL: packets.readFloatLE(100),
      slipAngleFR: packets.readFloatLE(104),
      slipAngleRL: packets.readFloatLE(108),
      slipAngleRR: packets.readFloatLE(112),
      slipAngleConatctPatchFL: packets.readFloatLE(116),
      slipAngleConatctPatchFR: packets.readFloatLE(120),
      slipAngleConatctPatchRL: packets.readFloatLE(124),
      slipAngleConatctPatchRR: packets.readFloatLE(128),
      slipRatioFL: packets.readFloatLE(132),
      slipRatioFR: packets.readFloatLE(136),
      slipRatioRL: packets.readFloatLE(140),
      slipRatioRR: packets.readFloatLE(144),
      tireSlipFL: packets.readFloatLE(148),
      tireSlipFR: packets.readFloatLE(152),
      tireSlipRL: packets.readFloatLE(156),
      tireSlipRR: packets.readFloatLE(160),
      ndSlipFL: packets.readFloatLE(164),
      ndSlipFR: packets.readFloatLE(168),
      ndSlipRL: packets.readFloatLE(172),
      ndSlipRR: packets.readFloatLE(176),
      loadFL: packets.readFloatLE(180),
      loadFR: packets.readFloatLE(184),
      loadRL: packets.readFloatLE(188),
      loadRR: packets.readFloatLE(192),
      DyFL: packets.readFloatLE(196),
      DyFR: packets.readFloatLE(200),
      DyRL: packets.readFloatLE(204),
      DyRR: packets.readFloatLE(208),
      MxFL: packets.readFloatLE(212),
      MxFR: packets.readFloatLE(216),
      MxRL: packets.readFloatLE(220),
      MxRR: packets.readFloatLE(224),
      tireDirtyLevelFL: packets.readFloatLE(228),
      tireDirtyLevelFR: packets.readFloatLE(232),
      tireDirtyLevelRL: packets.readFloatLE(236),
      tireDirtyLevelRR: packets.readFloatLE(240),
      camberRADFL: packets.readFloatLE(244),
      camberRADFR: packets.readFloatLE(248),
      camberRADRL: packets.readFloatLE(252),
      camberRADRR: packets.readFloatLE(256),
      tireRadiusFL: packets.readFloatLE(260),
      tireRadiusFR: packets.readFloatLE(264),
      tireRadiusRL: packets.readFloatLE(268),
      tireRadiusRR: packets.readFloatLE(272),
      tireLoadedRadiusFL: packets.readFloatLE(276),
      tireLoadedRadiusFR: packets.readFloatLE(280),
      tireLoadedRadiusRL: packets.readFloatLE(284),
      tireLoadedRadiusRR: packets.readFloatLE(288),
      suspensionHeightFL: packets.readFloatLE(292),
      suspensionHeightFR: packets.readFloatLE(296),
      suspensionHeightRL: packets.readFloatLE(300),
      suspensionHeightRR: packets.readFloatLE(304),
      carPosNormalized: packets.readFloatLE(308),
      carSlope: packets.readFloatLE(312),
      carCoordinatesX: packets.readFloatLE(316),
      carCoordinatesY: packets.readFloatLE(320),
      carCoordinatesZ: packets.readFloatLE(324),
   }
}

const populateRenderer = data => {
}

startSession();

server.on('listening', () => {
   console.log(`Listening: ${HOST}:${PORT}`);
});

// main update loop
server.on('message', packets => {
   // let carName = readString(packets, 0, 100);
   // let driverName = readString(packets, 100, 100);

   // if (state = 1) {
   data = parsePackets(packets);
   if (RECORDING) RACE_DATA += `\n${Object.values(data).join(',')}`;
   console.log(data.speedKPH);
   // }
});

process.on('SIGINT', () => {
   stopSession();
   console.log(`Terminating Session...`);
   process.exit();
});