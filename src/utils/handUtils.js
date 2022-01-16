import * as THREE from 'three'

let hands;
const videoElement = document.getElementById('video');

export function setUpHandTracking(myHands) {
    hands = myHands;
    const handModel = new Hands({locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4/${file}`;
    }});
    handModel.setOptions({
        modelComplexity: 1
    })
    handModel.onResults(updateHands);

    const trackCamera = new Camera(videoElement, {
        onFrame: async () => {
          await handModel.send({image: videoElement});
        },
        width: 1280,
        height: 720
    });
    trackCamera.start();
}

function getLandmarkProperty(i){
    var palms = [0,1,2,5,9,13,17] //landmark indices that represent the palm

    var idx = palms.indexOf(i);
    var isPalm = idx != -1;
    var next; // who to connect with?
    if (!isPalm){ // connect with previous finger landmark if it's a finger landmark
        next = i-1;
    }else{ // connect with next palm landmark if it's a palm landmark
        next = palms[(idx+1)%palms.length];
    }
    return {isPalm,next};
}

function updateHands(handData) {
    if (handData.multiHandLandmarks[0]) {
        if (handData.multiHandLandmarks.length <= hands.children.length) {
            for (var j = 0; j < handData.multiHandLandmarks.length; j++) {
                console.log(handData.multiHandLandmarks)
                console.log(hands)
                for (var i = 0; i < handData.multiHandLandmarks[j].length; i++){
                    var {isPalm,next} = getLandmarkProperty(i);
                
                    var p0 = webcam2space(handData.multiHandLandmarks[j][i]);  // one end of the bone
                    var p1 = webcam2space(handData.multiHandLandmarks[j][next]);  // the other end of the bone
                
                    // compute the center of the bone (midpoint)
                    var mid = p0.clone().lerp(p1,0.5);
                    hands.children[j].children[i].position.set(mid.x,mid.y,mid.z);
                
                    // compute the length of the bone
                    //hand.children[i].scale.y = p0.distanceTo(p1);
                    //hand.children[i].rotation.x += Math.PI;
                
                    // compute orientation of the bone
                    hands.children[j].children[i].lookAt(p1);
                }
            }
        }
    }
}

function webcam2space(point) {
    return new THREE.Vector3(
    -(point.x*30)+15,
     -(point.y*15)+5, // in threejs, +y is up
     - point.z*2 - 30
   )
}