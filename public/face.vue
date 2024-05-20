<svg viewBox="-100 -100 200 200" xmlns="http://www.w3.org/2000/svg" width="200" height="200" id="face-svg">
  <defs>
    <clipPath id="leftEyeClipPath">
      <polyline :points="eyeLeftCountour.toString()" />
    </clipPath>
    <clipPath id="rightEyeClipPath">
      <polyline :points="eyeRightCountour.toString()" />
    </clipPath>

    <filter id="fuzzy">
      <feTurbulence id="turbulence" baseFrequency="0.05" numOctaves="3" type="noise" result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
    </filter>
    <linearGradient id="rainbowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" :style="'stop-color: ' +
        hairColors[Math.floor(Math.random() * 10)] +
        ';  stop-opacity: 1'
        " />
      <stop :offset="dyeColorOffset" :style="'stop-color: ' +
        hairColors[Math.floor(Math.random() * hairColors.length)] +
        ';  stop-opacity: 1'
        " />
      <stop offset="100%" :style="'stop-color: ' +
        hairColors[Math.floor(Math.random() * hairColors.length)] +
        ';  stop-opacity: 1'
        " />
    </linearGradient>
  </defs>
  <title>That's an ugly face</title>
  <desc>CREATED BY XUAN TANG, MORE INFO AT TXSTC55.GITHUB.IO</desc>
  <rect x="-100" y="-100" width="100%" height="100%" :fill="backgroundColors[Math.floor(Math.random() * backgroundColors.length)]
    " />
  <polyline id="faceContour" :points="computedFacePoints.toString()" fill="#ffc9a9" stroke="black"
    :stroke-width="3.0 / faceScale" stroke-linejoin="round" filter="url(#fuzzy)" />

  <g :transform="'translate(' +
    (center[0] + distanceBetweenEyes + rightEyeOffsetX) +
    ' ' +
    -(-center[1] + eyeHeightOffset + rightEyeOffsetY) +
    ')'
    ">
    <polyline id="rightCountour" :points="eyeRightCountour.toString()" fill="white" stroke="white"
      :stroke-width="0.0 / faceScale" stroke-linejoin="round" filter="url(#fuzzy)" />
  </g>
  <g :transform="'translate(' +
    -(center[0] + distanceBetweenEyes + leftEyeOffsetX) +
    ' ' +
    -(-center[1] + eyeHeightOffset + leftEyeOffsetY) +
    ')'
    ">
    <polyline id="leftCountour" :points="eyeLeftCountour.toString()" fill="white" stroke="white" :stroke-width="0.0 / faceScale"
      stroke-linejoin="round" filter="url(#fuzzy)" />
  </g>
  <g :transform="'translate(' +
    (center[0] + distanceBetweenEyes + rightEyeOffsetX) +
    ' ' +
    -(-center[1] + eyeHeightOffset + rightEyeOffsetY) +
    ')'
    ">
    <polyline id="rightUpper" :points="eyeRightUpper.toString()" fill="none" stroke="black" :stroke-width="3.0 / faceScale"
      stroke-linejoin="round" filter="url(#fuzzy)" />
    <polyline id="rightLower" :points="eyeRightLower.toString()" fill="none" stroke="black" :stroke-width="4.0 / faceScale"
      stroke-linejoin="round" filter="url(#fuzzy)" />
    <circle v-for="i in 10" :key="i" :r="Math.random() * 2 + 3.0" :cx="rightPupilShiftX + Math.random() * 5 - 2.5"
      :cy="rightPupilShiftY + Math.random() * 5 - 2.5" stroke="black" fill="none" :stroke-width="1.0"
      filter="url(#fuzzy)" clip-path="url(#rightEyeClipPath)" />
  </g>
  <g :transform="'translate(' +
    -(center[0] + distanceBetweenEyes + leftEyeOffsetX) +
    ' ' +
    -(-center[1] + eyeHeightOffset + leftEyeOffsetY) +
    ')'
    ">
    <polyline id="leftUpper" :points="eyeLeftUpper.toString()" fill="none" stroke="black" :stroke-width="4.0 / faceScale"
      stroke-linejoin="round" filter="url(#fuzzy)" />
    <polyline id="leftLower" :points="eyeLeftLower.toString()" fill="none" stroke="black" :stroke-width="4.0 / faceScale"
      stroke-linejoin="round" filter="url(#fuzzy)" />
    <circle v-for="i in 10" :key="i" :r="Math.random() * 2 + 3.0" :cx="leftPupilShiftX + Math.random() * 5 - 2.5"
      :cy="leftPupilShiftY + Math.random() * 5 - 2.5" stroke="black" fill="none" :stroke-width="1.0"
      filter="url(#fuzzy)" clip-path="url(#leftEyeClipPath)" />
  </g>
  <g id="hairs">
    <polyline v-for="(hair, index) in hairs" :key="index" :points="hair.toString()" fill="none" :stroke="hairColor"
      :stroke-width="2" stroke-linejoin="round" filter="url(#fuzzy)" />
  </g>
  <g id="pointNose" v-if="Math.random() > 0.5">
    <g id="rightNose">
      <circle v-for="i in 10" :key="i" :r="Math.random() * 2 + 1.0" :cx="rightNoseCenterX + Math.random() * 4 - 2"
        :cy="rightNoseCenterY + Math.random() * 4 - 2" stroke="black" fill="none" :stroke-width="1.0"
        filter="url(#fuzzy)" />
    </g>
    <g id="leftNose">
      <circle v-for="i in 10" :key="i" :r="Math.random() * 2 + 1.0" :cx="leftNoseCenterX + Math.random() * 4 - 2"
        :cy="leftNoseCenterY + Math.random() * 4 - 2" stroke="black" fill="none" :stroke-width="1.0"
        filter="url(#fuzzy)" />
    </g>
  </g>
  <g id="lineNose" v-else>
    <path :d="'M ' +
      leftNoseCenterX +
      ' ' +
      leftNoseCenterY +
      ', Q' +
      rightNoseCenterX +
      ' ' +
      rightNoseCenterY * 1.5 +
      ',' +
      (leftNoseCenterX + rightNoseCenterX) / 2 +
      ' ' +
      -eyeHeightOffset * 0.2
      " fill="none" stroke="black" :stroke-width="3" stroke-linejoin="round" filter="url(#fuzzy)"></path>
  </g>
  <g id="mouth">
    <polyline :points="mouthPoints.toString()" fill="rgb(215,127,140)" stroke="black" :stroke-width="3" stroke-linejoin="round"
      filter="url(#fuzzy)" />
  </g>
</svg>