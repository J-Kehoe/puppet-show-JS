import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import stage from '../src/models/stage.js'
import hand from '../src/models/hand.js'
import { setUpHandTracking } from './utils/handUtils';

/** 
 * Debug
 */
const gui = new dat.GUI()

/**
 * Constants
 */

const videoElement = document.getElementById('video');
//const NumberOfHands = 2;
const params = {
    NumberOfHands: 2
}

gui.add(params,'NumberOfHands', 1, 2, 1).name('number of hands').onChange(function(value) {
    hands.clear()
    for (let i = 0; i < params.NumberOfHands; i++) {
        hands.add(hand.clone())
    }
})

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/** 
 * Objects 
 * */

scene.add(stage)
stage.position.set(0, -15, -30)

var hands = new THREE.Object3D()
for (let i = 0; i < params.NumberOfHands; i++) {
    hands.add(hand.clone())
}

scene.add(hands)
setUpHandTracking(hands, videoElement)

//#region Lights

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.set(0, 20, 5)
scene.add(pointLight)

//#endregion Lights

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor("#4a4e69")

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.y = -4
camera.position.z = -11
camera.rotation.x += -Math.PI*0.01

scene.add(camera)

// Debug Camera
const debugCamera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000)
debugCamera.position.y = 0.5
debugCamera.position.z = 5

const debugControls = new OrbitControls( debugCamera, renderer.domElement );
scene.add(debugCamera)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    debugControls.update()
    const elapsedTime = clock.getElapsedTime()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()