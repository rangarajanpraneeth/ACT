const bufferData = [
   97, 210, 34, 144, 72, 1, 0, 0, 207, 108, 252, 54, 130, 217, 156, 54,
   115, 60, 12, 54, 1, 0, 0, 0, 1, 0, 152, 81, 96, 66, 162, 13,
   96, 66, 162, 13, 96, 66, 162, 13, 50, 187, 0, 0, 0, 0, 0, 0,
   0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
   128, 63, 156, 0, 117, 68, 235, 81, 56, 189, 1, 0, 0, 0, 110, 186,
   236, 62, 147, 236, 68, 129, 231, 16, 69, 129, 138, 68, 71, 129, 138, 68,
   71, 129, 199, 227, 217, 57, 164, 181, 215, 57, 205, 99, 62, 58, 100, 139,
   55, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
   0, 0, 229, 193, 207, 49, 18, 192, 123, 48, 56, 245, 235, 51, 31, 66, 220, 179,
   0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
   171, 215, 70, 61, 252, 83, 71, 61, 130, 161, 197, 60, 56, 251, 198, 60,
   188, 145, 68, 69, 67, 172, 68, 69, 127, 105, 62, 69, 37, 132, 62, 69,
   41, 60, 149, 63, 155, 56, 149, 63, 249, 16, 149, 63, 248, 12, 149, 63,
   50, 34, 156, 55, 169, 57, 131, 183, 213, 51, 88, 55, 138, 21, 76, 183,
   0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
   60, 214, 66, 189, 117, 229, 66, 189, 187, 232, 193, 188, 56, 201, 193, 188,
   223, 224, 155, 62, 223, 224, 155, 62, 223, 224, 155, 62, 223, 224, 155, 62,
   113, 85, 149, 62, 143, 84, 149, 62, 242, 137, 149, 62, 15, 137, 149, 62,
   0, 233, 17, 61, 192, 245, 17, 61, 18, 85, 4, 61, 162, 99, 4, 61,
   0, 0, 0, 0, 0, 0, 0, 0, 109, 146, 17, 193, 28, 79, 166, 190,
   42, 3, 166, 192
];

// const dat

// Create a Buffer from the array
const buffer = Buffer.from(bufferData);

// Function to interpret buffer data
function parseBuffer(buffer) {
   let view = new DataView(buffer.buffer);
   let result = {};

   // Example of parsing data, assuming mixed data types
   result.int32 = view.getInt32(0, true); // Interpret first 4 bytes as an Int32
   result.float64 = view.getFloat64(4, true); // Interpret next 8 bytes as a Float64
   result.string = String.fromCharCode.apply(null, buffer.slice(12, 16)); // Interpret bytes 12-16 as a string
   
   // Interpret the remaining data if needed
   // Add more parsing rules based on the data format

   return view.getFloat32(8);
}

// console.log(parseBuffer(buffer));

console.log(bufferData.readFloatLE(8))