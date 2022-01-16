import * as THREE from '../../node_modules/three/src/Three.js';

const loader = new THREE.TextureLoader()

const cubetexture = loader.load("/textures/wood.jpeg")
cubetexture.wrapS = THREE.RepeatWrapping;
cubetexture.wrapT = THREE.RepeatWrapping;
cubetexture.repeat.set( 15, 5 );

const curtaintexture = loader.load("/textures/curtain.jpg")
curtaintexture.wrapS = THREE.RepeatWrapping;
curtaintexture.wrapT = THREE.RepeatWrapping;
curtaintexture.repeat.set( 1, 5 );

const cubegeometry = new THREE.BoxGeometry(50, 5, 20)
const cubematerial = new THREE.MeshPhongMaterial({ map: cubetexture, wireframe: false})
const cube = new THREE.Mesh(cubegeometry, cubematerial)
cube.receiveShadow = true;
cube.position.set(0, 2.5, -5);
cube.name = "cube";

let video = document.getElementById( 'video' );

const videoTexture = new THREE.VideoTexture( video );
videoTexture.wrapS = THREE.RepeatWrapping;
videoTexture.repeat.x = - 1;
if ( navigator.mediaDevices && navigator.mediaDevices.getUserMedia ) {
    const constraints = { video: { width: 1280, height: 720, facingMode: 'user' } };
    navigator.mediaDevices.getUserMedia( constraints ).then( function ( stream ) {
        // apply the stream to the video element used in the texture
        video.srcObject = stream;
        video.play();
        console.log("video initialized");
    } ).catch( function ( error ) {
        console.error( 'Unable to access the camera/webcam.', error );
    } );
} else {
    console.error( 'MediaDevices interface not available.' );
}

const planegeometry = new THREE.PlaneGeometry( 12.8*2, 7.2*2, 1 );
const planematerial = new THREE.MeshStandardMaterial( {map: videoTexture} );
const plane = new THREE.Mesh( planegeometry, planematerial );
plane.position.set(0, 14, -12)
plane.name = "screen";
plane.receiveShadow = true;

const curtaingeometry = new THREE.PlaneGeometry( 10, 40, 1 );
const curtainmaterial = new THREE.MeshStandardMaterial( {map: curtaintexture} );
const curtain = new THREE.Mesh( curtaingeometry, curtainmaterial );
const curtain2 = new THREE.Mesh( curtaingeometry, curtainmaterial );
curtain.receiveShadow = true;
curtain2.receiveShadow = true;
curtain.position.set(-20, 10, -8)
curtain2.position.set(20, 10, -8)

const backWallGeo = new THREE.PlaneGeometry(40, 20, 1)
const backWallMat = new THREE.MeshBasicMaterial({color: 0x000000})
const backWall = new THREE.Mesh(backWallGeo, backWallMat)
backWall.position.set(0, 15, -15)

const stage = new THREE.Object3D();
stage.add(cube, plane, curtain, curtain2, backWall);

export default stage;