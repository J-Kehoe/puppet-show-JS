import * as THREE from '../../node_modules/three/src/Three.js';
import { getLandmarkProperty } from '../utils/handUtils.js';


// a parent object to facilitate rotation/scaling
var hand = new THREE.Object3D();
var boneGeometry = new THREE.SphereGeometry( 1, 10, 10)
var boneMaterial = new THREE.MeshNormalMaterial();

for (var i = 0; i < 21; i++){ // 21 keypoints
    //var {isPalm,next} = getLandmarkProperty(i);

    // we make each bone a cylindrical shape, but you can use your own models here too
    //var boneGeometry = new THREE.CylinderGeometry( isPalm?0.5:2.0, 0.5, 0.1);
  
    var boneMesh = new THREE.Mesh( boneGeometry, boneMaterial );
    boneMesh.scale.set(0.2, 0.2, 0.2)

    hand.add( boneMesh );
}

export default hand;