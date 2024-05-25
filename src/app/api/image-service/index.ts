import { getImageData } from "./image";
import { createSSRApp } from 'vue'
import { renderToString } from '@vue/server-renderer'
// import fs from 'fs'
// import path from 'path'

// const appPath = path.resolve(__dirname, '../../', 'face.vue');
// console.log('appPath', appPath);
// const appCode = fs.readFileSync(appPath, 'utf-8')

interface ISvg {
  rng: () => number,
  bgColor: string,
  height: number,
  width: number
  opacity: number
}

export const getSvg = async ({ rng, bgColor, height, width, opacity }: ISvg) => {
  const data = getImageData({ rng, bgColor, height, width, opacity });
  const app = createSSRApp({
    template: `<svg viewBox="-100 -100 200 200" xmlns="http://www.w3.org/2000/svg" :width="width||200" :height="height||200" id="face-svg">
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
        hairColors[Math.floor(rng() * 10)] +
        ';  stop-opacity: 1'
        " />
      <stop :offset="dyeColorOffset" :style="'stop-color: ' +
        hairColors[Math.floor(rng() * hairColors.length)] +
        ';  stop-opacity: 1'
        " />
      <stop offset="100%" :style="'stop-color: ' +
        hairColors[Math.floor(rng() * hairColors.length)] +
        ';  stop-opacity: 1'
        " />
    </linearGradient>
  </defs>
  <title>That's an ugly face</title>
  <desc>CREATED BY XUAN TANG, MORE INFO AT TXSTC55.GITHUB.IO</desc>
  <rect x="-100" y="-100" width="100%" height="100%" :opacity="opacity" :fill="bgColor || backgroundColors[Math.floor(rng() * backgroundColors.length)]
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
    <circle v-for="i in 10" :key="i" :r="rng() * 2 + 3.0" :cx="rightPupilShiftX + rng() * 5 - 2.5"
      :cy="rightPupilShiftY + rng() * 5 - 2.5" stroke="black" fill="none" :stroke-width="1.0"
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
    <circle v-for="i in 10" :key="i" :r="rng() * 2 + 3.0" :cx="leftPupilShiftX + rng() * 5 - 2.5"
      :cy="leftPupilShiftY + rng() * 5 - 2.5" stroke="black" fill="none" :stroke-width="1.0"
      filter="url(#fuzzy)" clip-path="url(#leftEyeClipPath)" />
  </g>
  <g id="hairs">
    <polyline v-for="(hair, index) in hairs" :key="index" :points="hair.toString()" fill="none" :stroke="hairColor"
      :stroke-width="2" stroke-linejoin="round" filter="url(#fuzzy)" />
  </g>
  <g id="pointNose" v-if="rng() > 0.5">
    <g id="rightNose">
      <circle v-for="i in 10" :key="i" :r="rng() * 2 + 1.0" :cx="rightNoseCenterX + rng() * 4 - 2"
        :cy="rightNoseCenterY + rng() * 4 - 2" stroke="black" fill="none" :stroke-width="1.0"
        filter="url(#fuzzy)" />
    </g>
    <g id="leftNose">
      <circle v-for="i in 10" :key="i" :r="rng() * 2 + 1.0" :cx="leftNoseCenterX + rng() * 4 - 2"
        :cy="leftNoseCenterY + rng() * 4 - 2" stroke="black" fill="none" :stroke-width="1.0"
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
</svg>`,
    data: () => data,
  })
  let svgData = await renderToString(app)
  svgData = svgData.replace('viewbox', 'viewBox')
  return svgData;
}