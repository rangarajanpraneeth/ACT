const fs = require('fs');
const path = require('path');
const dgram = require('dgram');
let server = dgram.createSocket('udp4');

const PORT = 2693;
const HOST = '127.0.0.1';

// recording related variables
const HEADERS_PATH = path.join(__dirname, '../constants', 'headers.txt');
const HEADERS = fs.readFileSync(HEADERS_PATH, 'utf-8');
let RECORDING = false;
let RACE_DATA = '';

// const {
//    IDs,
//    classes,
//    drivetrains
// } = require('./constants/constants')



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



// global utility functions
const fToC = f => (f - 32) * 5 / 9;



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

const parsePackets = packets => {
   return {
      inRace: packets.readInt32LE(0), // 1 in race 0 not in race
      timestamp: packets.readInt32LE(4), // can overflow to 0 eventually

      engineMaxRPM: packets.readFloatLE(8),
      engineIdleRPM: packets.readFloatLE(12),
      engineRPM: packets.readFloatLE(16),

      carAccelerationX: packets.readFloatLE(20), // X=left/right Y=up Z=forward
      carAccelerationY: packets.readFloatLE(24),
      carAccelerationZ: packets.readFloatLE(28),

      carVelocityX: packets.readFloatLE(32), // X=left/right Y=up Z=forward
      carVelocityY: packets.readFloatLE(36),
      carVelocityZ: packets.readFloatLE(40),

      carAngularVelocityX: packets.readFloatLE(44), // X=left/right Y=up Z=forward
      carAngularVelocityY: packets.readFloatLE(48),
      carAngularVelocityZ: packets.readFloatLE(52),

      carYaw: packets.readFloatLE(54),
      carPitch: packets.readFloatLE(60),
      carRoll: packets.readFloatLE(64),

      suspensionTravelNormalizedFL: packets.readFloatLE(68), // 0.0f=max stretch 1.0=max compression
      suspensionTravelNormalizedFR: packets.readFloatLE(72),
      suspensionTravelNormalizedRL: packets.readFloatLE(76),
      suspensionTravelNormalizedRR: packets.readFloatLE(80),

      tireSlipRatioFL: packets.readFloatLE(84), // 0(100% grip) |ratio| > 1 (loss of grip)
      tireSlipRatioFR: packets.readFloatLE(88),
      tireSlipRatioRL: packets.readFloatLE(92),
      tireSlipRatioRR: packets.readFloatLE(96),

      wheelRotationSpeedFL: packets.readFloatLE(100), // radians per second
      wheelRotationSpeedFR: packets.readFloatLE(104),
      wheelRotationSpeedRL: packets.readFloatLE(108),
      wheelRotationSpeedRR: packets.readFloatLE(112),

      wheelOnRumbleFL: packets.readInt32LE(116), // 1(true) 0(false)
      wheelOnRumbleFR: packets.readInt32LE(120),
      wheelOnRumbleRL: packets.readInt32LE(124),
      wheelOnRumbleRR: packets.readInt32LE(128),

      wheelInPuddleDepthFL: packets.readFloatLE(132), // 0(shallowest) 1(deepest)
      wheelInPuddleDepthFR: packets.readFloatLE(136),
      wheelInPuddleDepthRL: packets.readFloatLE(140),
      wheelInPuddleDepthRR: packets.readFloatLE(144),

      forceFeedbackRumbleFL: packets.readFloatLE(148),
      forceFeedbackRumbleFR: packets.readFloatLE(152),
      forceFeedbackRumbleRL: packets.readFloatLE(156),
      forceFeedbackRumbleRR: packets.readFloatLE(160),

      tireSlipAngleFL: packets.readFloatLE(164), // 0(100% grip) |angle| > 1 (loss of grip)
      tireSlipAngleFR: packets.readFloatLE(168),
      tireSlipAngleRL: packets.readFloatLE(172),
      tireSlipAngleRR: packets.readFloatLE(176),

      tireSlipCombinedFL: packets.readFloatLE(180), // 0(100% grip) |slip| > 1 (loss of grip)
      tireSlipCombinedFR: packets.readFloatLE(184),
      tireSlipCombinedRL: packets.readFloatLE(188),
      tireSlipCombinedRR: packets.readFloatLE(192),

      suspensionTravelFL: packets.readFloatLE(196), // meters
      suspensionTravelFR: packets.readFloatLE(200),
      suspensionTravelRL: packets.readFloatLE(204),
      suspensionTravelRR: packets.readFloatLE(208),

      carID: packets.readInt32LE(212),
      carPerformanceClass: packets.readInt32LE(216), // 0(D)-7(X)
      carPerformanceIndex: packets.readInt32LE(220), // 100-999
      carDrivetrainType: packets.readInt32LE(224), // 0=FWD 1=RWD 2=AWD
      carCylinderCount: packets.readInt32LE(228),

      carPositionX: packets.readFloatLE(244),
      carPositionY: packets.readFloatLE(248),
      carPositionZ: packets.readFloatLE(252),

      carSpeed: Math.round(packets.readFloatLE(256) * 2.237), // meters per second
      enginePower: packets.readFloatLE(260) / 745.7, // watts
      engineTorque: packets.readFloatLE(264) / 1.356, // newton meters

      tireTemperatureFL: fToC(packets.readFloatLE(268)), // farenheit
      tireTemperatureFR: fToC(packets.readFloatLE(272)),
      tireTemperatureRL: fToC(packets.readFloatLE(276)),
      tireTemperatureRR: fToC(packets.readFloatLE(280)),

      engineBoost: packets.readFloatLE(284),
      engineFuel: packets.readFloatLE(288),

      distanceTravelled: packets.readFloatLE(292),

      raceBestLap: packets.readFloatLE(296),
      raceLastLap: packets.readFloatLE(300),
      raceCurrentLap: packets.readFloatLE(304),
      raceTime: packets.readFloatLE(308),
      raceLap: packets.readUint16LE(312),
      racePosition: packets.readUintLE(314, 1),

      inputThrottle: packets.readUintLE(315, 1),
      inputBrake: packets.readUintLE(316, 1),
      inputClutch: packets.readUintLE(317, 1),
      inputHandbrake: packets.readUintLE(318, 1),
      inputGear: packets.readUintLE(319, 1),
      inputSteering: packets.readIntLE(320, 1),

      normalizedDrivingLine: packets.readIntLE(321, 1),
      normalizedAIBrakeDifference: packets.readInt16LE(322)
   }
}

server.on('listening', () => {
   let address = server.address();
   console.log(`Listening on ${address.address}:${address.port}`);
});

function moveNeedle(currentRPM, maxRPM, speed) {
   const degree = currentRPM/maxRPM * 180 - 90;
   const needle = document.getElementById('needle');
   // const degree = values[index % values.length]; // Get degree based on array and loop
   needle.style.transform = `rotate(${degree}deg)`;
   document.getElementById('riskLevel').innerText = speed;
}

// display function
const populateRenderer = (data) => {
   // if (data.inRace === 0) {
   //    document.querySelector('.status').classList.remove('green');
   //    document.querySelector('.status').classList.add('red');
   //    document.querySelector('.status').innerHTML = 'INACTIVE'
   // } else if (data.inRace === 1) {
   //    document.querySelector('.status').classList.remove('red');
   //    document.querySelector('.status').classList.add('green');
   //    document.querySelector('.status').innerHTML = 'ACTIVE'
   // }

   // document.querySelector('.id').innerHTML = IDs[data.carID];

   // document.querySelector('.speed').innerText = Math.round(data.carSpeed);
   // moveNeedle(data.engineIdleRPM, data.engineMaxRPM, data.carSpeed);
   moveNeedle(data.engineRPM, data.engineMaxRPM, data.carSpeed);
   plotVals(data.carAccelerationX, data.carAccelerationY, data.carAccelerationZ);

   document.querySelector('.fl').innerText = Math.round(data.tireTemperatureFL);
   document.querySelector('.fr').innerText = Math.round(data.tireTemperatureFR);
   document.querySelector('.rl').innerText = Math.round(data.tireTemperatureRL);
   document.querySelector('.rr').innerText = Math.round(data.tireTemperatureRR);

   // console.log(data.currentRPM);
   // console.log(data.maxRPM);

}

server.on('message', packets => {
   const data = parsePackets(packets);
   if (RECORDING && data.inRace === 1) RACE_DATA += `\n${Object.values(data).join(',')}`;
   populateRenderer(data);
});

server.bind(PORT, HOST);

process.on('SIGINT', () => {
   console.log(`Exiting...`);
   process.exit();
});


function plotVals(ax, ay, az, multiplier = 1) {
   let gForce = Math.sqrt(ax * ax + ay * ay + az * az) * multiplier;
   document.querySelector('.gForce').innerText = gForce.toFixed(2);

   let svg = document.getElementById('graph');

   // Fade out previous dot
   let previousDot = svg.querySelector('.dot');
   if (previousDot) {
      previousDot.style.opacity = 0;
      setTimeout(() => {
         svg.removeChild(previousDot);
      }, 500); // Wait for fade out transition (0.5s)
   }

   let x = 150 + ax * 100;
   let y = 150 - az * 100;

   let circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
   circle.setAttribute('cx', x);
   circle.setAttribute('cy', y);
   circle.setAttribute('r', 5);
   circle.classList.add('dot');

   gForce / (Math.sqrt(3) * multiplier) * 255

   circle.style.fill = `rgb(${gForce / (Math.sqrt(3) * multiplier) * 255}, ${255 - gForce / (Math.sqrt(3) * multiplier) * 255}, 0)`;

   svg.appendChild(circle);

   // Smooth transition for the line
   let line = document.getElementById('line');
   line.setAttribute('x2', x);
   line.setAttribute('y2', y);
}
