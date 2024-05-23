import { generateBothEyes, generateFaceCountourPoints, generateHairLines0, generateHairLines1, generateHairLines2, generateHairLines3, generateMouthShape0, generateMouthShape1, generateMouthShape2, randomFromInterval } from "@/utils";

interface Data {
  faceScale: number;
  computedFacePoints: number[][],

  eyeRightUpper: number[][],
  eyeRightLower: number[][],
  eyeRightCountour: number[][],
  eyeLeftUpper: number[][],
  eyeLeftLower: number[][],
  eyeLeftCountour: number[][],

  faceHeight: number,
  faceWidth: number,
  center: number[],
  distanceBetweenEyes: number,

  leftEyeOffsetX: number,
  leftEyeOffsetY: number,
  rightEyeOffsetX: number,
  rightEyeOffsetY: number,
  eyeHeightOffset: number,
  leftEyeCenter: number[],
  rightEyeCenter: number[],

  rightPupilShiftX: number,
  rightPupilShiftY: number,
  leftPupilShiftX: number,
  leftPupilShiftY: number,

  rightNoseCenterX: number,
  rightNoseCenterY: number,
  leftNoseCenterX: number,
  leftNoseCenterY: number,
  hairs: number[][][],
  hairColors: string[],
  hairColor: string,
  dyeColorOffset: string,

  backgroundColors: string[],
  mouthPoints: number[][],
  rng: () => number
}

export const getImageData = ({ rng, ...rest }: { rng: () => number, [key: string]: any }) => {
  const data: Data = {
    rng,
    ...rest,
    faceScale: 1.8, // face scale
    computedFacePoints: [[]], // the polygon points for face countour

    eyeRightUpper: [], // the points for right eye upper lid
    eyeRightLower: [],
    eyeRightCountour: [], // for the white part of the eye
    eyeLeftUpper: [],
    eyeLeftLower: [],
    eyeLeftCountour: [],

    faceHeight: 0, // the height of the face
    faceWidth: 0, // the width of the face
    center: [0, 0], // the center of the face
    distanceBetweenEyes: 0, // the distance between the eyes

    leftEyeOffsetX: 0, // the offset of the left eye
    leftEyeOffsetY: 0, // the offset of the left eye
    rightEyeOffsetX: 0, // the offset of the right eye
    rightEyeOffsetY: 0, // the offset of the right eye
    eyeHeightOffset: 0, // the offset of the eye height
    leftEyeCenter: [0, 0], // the center of the left eye
    rightEyeCenter: [0, 0], // the center of the right eye

    rightPupilShiftX: 0, // the shift of the right pupil
    rightPupilShiftY: 0, // the shift of the right pupil
    leftPupilShiftX: 0, // the shift of the left pupil
    leftPupilShiftY: 0, // the shift of the left pupil

    rightNoseCenterX: 0, // the center of the right nose
    rightNoseCenterY: 0, // the center of the right nose
    leftNoseCenterX: 0, // the center of the left nose
    leftNoseCenterY: 0, // the center of the left nose
    hairs: [],
    hairColors: [
      "rgb(0, 0, 0)", // Black
      "rgb(44, 34, 43)", // Dark Brown
      "rgb(80, 68, 68)", // Medium Brown
      "rgb(167, 133, 106)", // Light Brown
      "rgb(220, 208, 186)", // Blond
      "rgb(233, 236, 239)", // Platinum Blond
      "rgb(165, 42, 42)", // Red
      "rgb(145, 85, 61)", // Auburn
      "rgb(128, 128, 128)", // Grey
      "rgb(185, 55, 55)", // fire
      "rgb(255, 192, 203)", // Pastel Pink
      "rgb(255, 105, 180)", // Bright Pink
      "rgb(230, 230, 250)", // Lavender
      "rgb(64, 224, 208)", // Turquoise
      "rgb(0, 191, 255)", // Bright Blue
      "rgb(148, 0, 211)", // Deep Purple
      "rgb(50, 205, 50)", // Lime Green
      "rgb(255, 165, 0)", // Vivid Orange
      "rgb(220, 20, 60)", // Crimson Red
      "rgb(192, 192, 192)", // Silver
    ],
    hairColor: "black",
    dyeColorOffset: "50%",
    backgroundColors: [
      "rgb(245, 245, 220)", // Soft Beige
      "rgb(176, 224, 230)", // Pale Blue
      "rgb(211, 211, 211)", // Light Grey
      "rgb(152, 251, 152)", // Pastel Green
      "rgb(255, 253, 208)", // Cream
      "rgb(230, 230, 250)", // Muted Lavender
      "rgb(188, 143, 143)", // Dusty Rose
      "rgb(135, 206, 235)", // Sky Blue
      "rgb(245, 255, 250)", // Mint Cream
      "rgb(245, 222, 179)", // Wheat
      "rgb(47, 79, 79)", // Dark Slate Gray
      "rgb(72, 61, 139)", // Dark Slate Blue
      "rgb(60, 20, 20)", // Dark Brown
      "rgb(25, 25, 112)", // Midnight Blue
      "rgb(139, 0, 0)", // Dark Red
      "rgb(85, 107, 47)", // Olive Drab
      "rgb(128, 0, 128)", // Purple
      "rgb(0, 100, 0)", // Dark Green
      "rgb(0, 0, 139)", // Dark Blue
      "rgb(105, 105, 105)", // Dim Gray
    ],
    mouthPoints: [],
  }

  // faceShape.generateFaceCountourPoints()生成脸部轮廓点
  let faceResults = generateFaceCountourPoints(100, rng);
  data.computedFacePoints = faceResults.face;
  // console.log('faceResults.face', faceResults.face);
  data.faceHeight = faceResults.height;
  data.faceWidth = faceResults.width;
  data.center = faceResults.center;

  let eyes = generateBothEyes(data.faceWidth / 2, rng);
  let left = eyes.left;
  let right = eyes.right;
  data.eyeRightUpper = right.upper;
  data.eyeRightLower = right.lower;
  data.eyeRightCountour = right.upper
    .slice(10, 90)
    .concat(right.lower.slice(10, 90).reverse());
  data.eyeLeftUpper = left.upper;
  data.eyeLeftLower = left.lower;
  data.eyeLeftCountour = left.upper
    .slice(10, 90)
    .concat(left.lower.slice(10, 90).reverse());


  // 随机调整眼睛位置
  // 计算眼睛间距和瞳孔偏移：确定两只眼睛之间的距离，以及左右瞳孔在垂直方向上的偏移。
  data.distanceBetweenEyes = randomFromInterval(
    data.faceWidth / 4.5,
    data.faceWidth / 4,
    rng,
  );
  data.eyeHeightOffset = randomFromInterval(
    data.faceHeight / 8,
    data.faceHeight / 6,
    rng,
  );
  data.leftEyeOffsetX = randomFromInterval(
    -data.faceWidth / 20,
    data.faceWidth / 10,
    rng,
  );
  data.leftEyeOffsetY = randomFromInterval(
    -data.faceHeight / 50,
    data.faceHeight / 50,
    rng,
  );
  data.rightEyeOffsetX = randomFromInterval(
    -data.faceWidth / 20,
    data.faceWidth / 10,
    rng,
  );
  data.rightEyeOffsetY = randomFromInterval(
    -data.faceHeight / 50,
    data.faceHeight / 50,
    rng,
  );
  data.leftEyeCenter = left.center[0];
  data.rightEyeCenter = right.center[0];
  data.leftPupilShiftX = randomFromInterval(
    -data.faceWidth / 20,
    data.faceWidth / 20,
    rng,
  );

  // 头发：生成头发线条。通过随机选择不同的生成方法（generateHairLines0 到 generateHairLines3）
  // ，并根据随机数决定是否应用这些方法，将生成的头发线条添加到 data.hairs 数组。
  // now we generate the pupil shifts
  // we first pick a point from the upper eye lid
  // 
  let leftInd0 = Math.floor(randomFromInterval(10, left.upper.length - 10, rng));
  let rightInd0 = Math.floor(
    randomFromInterval(10, right.upper.length - 10, rng)
  );
  let leftInd1 = Math.floor(randomFromInterval(10, left.upper.length - 10, rng));
  let rightInd1 = Math.floor(
    randomFromInterval(10, right.upper.length - 10, rng)
  );

  let leftLerp = randomFromInterval(0.2, 0.8, rng);
  let rightLerp = randomFromInterval(0.2, 0.8, rng);

  data.leftPupilShiftY =
    left.upper[leftInd0][1] * leftLerp +
    left.lower[leftInd1][1] * (1 - leftLerp);
  data.rightPupilShiftY =
    right.upper[rightInd0][1] * rightLerp +
    right.lower[rightInd1][1] * (1 - rightLerp);
  data.leftPupilShiftX =
    left.upper[leftInd0][0] * leftLerp +
    left.lower[leftInd1][0] * (1 - leftLerp);
  data.rightPupilShiftX =
    right.upper[rightInd0][0] * rightLerp +
    right.lower[rightInd1][0] * (1 - rightLerp);

  var numHairLines = [];
  var numHairMethods = 4;
  for (var i = 0; i < numHairMethods; i++) {
    numHairLines.push(Math.floor(randomFromInterval(0, 50, rng)));
  }
  data.hairs = [];
  if (rng() > 0.3) {
    data.hairs = generateHairLines0(
      data.computedFacePoints,
      numHairLines[0] * 1 + 10, rng

    );
  }
  if (rng() > 0.3) {
    data.hairs = data.hairs.concat(
      generateHairLines1(
        data.computedFacePoints,
        numHairLines[1] / 1.5 + 10, rng
      )
    );
  }
  if (rng() > 0.5) {
    data.hairs = data.hairs.concat(
      generateHairLines2(
        data.computedFacePoints,
        numHairLines[2] * 3 + 10, rng
      )
    );
  }
  // 头发颜色：随机决定头发颜色，可能是自然色或彩虹渐变色，并设置染色的偏移量。
  if (rng() > 0.5) {
    data.hairs = data.hairs.concat(
      generateHairLines3(
        data.computedFacePoints,
        numHairLines[3] * 3 + 10, rng
      )
    );
  }
  // 鼻子：随机生成左右鼻孔的中心点坐标。
  data.rightNoseCenterX = randomFromInterval(
    data.faceWidth / 18,
    data.faceWidth / 12, rng
  );
  data.rightNoseCenterY = randomFromInterval(0, data.faceHeight / 5, rng);
  data.leftNoseCenterX = randomFromInterval(
    -data.faceWidth / 18,
    -data.faceWidth / 12, rng
  );
  data.leftNoseCenterY =
    data.rightNoseCenterY +
    randomFromInterval(-data.faceHeight / 30, data.faceHeight / 20, rng);
  if (rng() > 0.1) {
    // use natural hair color
    data.hairColor = data.hairColors[Math.floor(rng() * 10)];
  } else {
    data.hairColor = "url(#rainbowGradient)";
    data.dyeColorOffset = randomFromInterval(0, 100, rng) + "%";
  }

  // 嘴巴：根据随机选择的嘴形（从三种形状中选择），调用相应的 mouthShape.generateMouthShape 方法生成嘴巴的形状点。
  var choice = Math.floor(rng() * 3);
  if (choice == 0) {
    data.mouthPoints = generateMouthShape0(
      data.computedFacePoints,
      data.faceHeight,
      data.faceWidth,
      rng
    );
  } else if (choice == 1) {
    data.mouthPoints = generateMouthShape1(
      data.computedFacePoints,
      data.faceHeight,
      data.faceWidth,
      rng
    );
  } else {
    data.mouthPoints = generateMouthShape2(
      data.computedFacePoints,
      data.faceHeight,
      data.faceWidth,
      rng,
    );
  }

  // console.log(data)
  return data;
};