# MediaPipe - Guide d'utilisation

## Qu'est-ce que MediaPipe ?

MediaPipe est une bibliothèque open-source développée par Google qui propose des solutions prêtes à l'emploi pour l'analyse de médias en temps réel. Elle permet de réaliser diverses tâches de vision par ordinateur et d'apprentissage automatique, comme :

- La détection de visages 👤
- La reconnaissance de poses 🏃‍♂️
- Le suivi des mains ✋
- La détection d'objets 📦
- Et bien plus encore !

[MediaPipe Overview](https://developers.google.com/mediapipe/solutions/guide) | [MediaPipe Demo](https://mediapipe-studio.webapps.google.com/home)

## Installation

```bash
npm install @mediapipe/pose @mediapipe/hands @mediapipe/face_detection @mediapipe/camera_utils @mediapipe/drawing_utils
```

## Prérequis

- Node.js et npm
- Un navigateur moderne supportant WebGL
- Une webcam pour les exemples en temps réel

## Fonctionnalités principales

### 1. Détection de poses (Pose Detection)

```javascript
import { Pose } from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";

const pose = new Pose({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
  },
});

pose.onResults((results) => {
  if (results.poseLandmarks) {
    drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS);
    drawLandmarks(canvasCtx, results.poseLandmarks);
  }
});
```

![Pose Detection](https://www.gstatic.com/alkali/ac43bed27c8ef9c4ce0e7a23838fa0b8c60fe2d8.png)

Les points de repère détectés sur le corps :

![Pose Landmarks](https://developers.google.com/static/mediapipe/images/solutions/pose_landmarks_index.png)

### 2. Suivi des mains (Hand Tracking)

```javascript
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";

const hands = new Hands({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
  },
});

hands.onResults((results) => {
  if (results.multiHandLandmarks) {
    for (const landmarks of results.multiHandLandmarks) {
      drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS);
      drawLandmarks(canvasCtx, landmarks);
    }
  }
});
```

![Hand Tracking Demo](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhEIQ89N0jOV70_XzEXzr4gOa4ApMta6JmeIpx3yFfcsNYq_FJL9NzG6g3MDvxblY-uTs6-huVkuhMi0CCgWeCKAYf2Nulvo2j2d4dbAEvwXMFB4al2QeEP_pTjPH5LH1DvAb88vU_2Cjo/s1600/hand_trimmed.gif)

Points de repère de la main :

![Hand Landmarks](https://www.gstatic.com/alkali/09930285836a2b9a743f45da5d8e217fd4ead17e.png)

### 3. Détection faciale (Face Detection)

```javascript
import { FaceDetection } from "@mediapipe/face_detection";
import { Camera } from "@mediapipe/camera_utils";
import { drawRectangle } from "@mediapipe/drawing_utils";

const faceDetection = new FaceDetection({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`;
  },
});

faceDetection.onResults((results) => {
  if (results.detections) {
    for (const detection of results.detections) {
      drawRectangle(canvasCtx, detection.boundingBox);
    }
  }
});
```

![Face Detection](https://mediapipe.dev/images/mobile/face_detection_android_gpu.gif)

Points de repère du visage :

```javascript
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";

const faceMesh = new FaceMesh({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
  },
});

faceMesh.setOptions({
  maxNumFaces: 1,
  refineLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});

faceMesh.onResults((results) => {
  if (results.multiFaceLandmarks) {
    for (const landmarks of results.multiFaceLandmarks) {
      // Draw facial landmarks
      drawConnectors(canvasCtx, landmarks, FACEMESH_TESSELATION);
      drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYE);
      drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYE);
      drawConnectors(canvasCtx, landmarks, FACEMESH_LIPS);

      // Draw landmark points
      drawLandmarks(canvasCtx, landmarks);
    }
  }
});
```

![Face Landmarks](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg8IS3Y67UlqXW6HP5VsLUQu4EltnDnBnhxOYfFyTqOE8Fn9rBxbl85-YFL_t9RncOjJ5gY3fjIYzadaOQqnjhgpIDcOKP3t7-ZDRCpkHgNvxq0-rXSM-NRanuLY2nXm3ZRpk5upOThVdg/s1600/facemesh_final_3.gif)

## Exemple complet d'utilisation

Voici un exemple complet pour la détection de poses en temps réel avec une webcam :

```javascript
import { Pose } from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";

// Configuration du canvas
const videoElement = document.createElement("video");
const canvasElement = document.createElement("canvas");
const canvasCtx = canvasElement.getContext("2d");

document.body.append(canvasElement);

// Configuration de MediaPipe Pose
const pose = new Pose({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
  },
});

pose.setOptions({
  modelComplexity: 1,
  smoothLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});

pose.onResults((results) => {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

  // Dessiner l'image de la caméra
  canvasCtx.drawImage(
    results.image,
    0,
    0,
    canvasElement.width,
    canvasElement.height
  );

  // Dessiner les points de repère
  if (results.poseLandmarks) {
    drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS);
    drawLandmarks(canvasCtx, results.poseLandmarks);
  }

  canvasCtx.restore();
});

// Configuration de la caméra
const camera = new Camera(videoElement, {
  onFrame: async () => {
    await pose.send({ image: videoElement });
  },
  width: 1280,
  height: 720,
});

camera.start();
```

![Pose Detection Demo](https://camo.githubusercontent.com/3dff806ecef4d95401f42523883d1bdc0601df7723a44639ef2af5a7b43c8c42/68747470733a2f2f6d65646961706970652e6465762f696d616765732f6d6f62696c652f706f73655f747261636b696e675f6578616d706c652e676966)

## Ressources utiles

- [Documentation officielle MediaPipe JavaScript](https://developers.google.com/mediapipe/solutions/vision/pose_landmarker/web_js)
- [GitHub MediaPipe](https://github.com/google/mediapipe)
- [Solutions MediaPipe](https://developers.google.com/mediapipe/solutions)
