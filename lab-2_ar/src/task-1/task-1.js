import '../../src/style.css'

import * as THREE from "three"
import { ARButton } from "three/addons/webxr/ARButton.js"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import GUI from 'lil-gui';

let camera, scene, renderer;
let boxMesh, sphereMesh, cylinderMesh; 
let controls;

class ColorGUIHelper {
    constructor(object, prop) {
      this.object = object;
      this.prop = prop;
    }
    get value() {
      return `#${this.object[this.prop].getHexString()}`;
    }
    set value(hexString) {
      this.object[this.prop].set(hexString);
    }
  }

init();
animate();

function init() {
    const container = document.createElement('div');
    document.body.appendChild(container);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 40);

    // Об'єкт рендерингу
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
            
    renderer.xr.enabled = true; // Життєво важливий рядок коду для вашого застосунку!
    container.appendChild(renderer.domElement);
            
    // Світло
    const directionalLight = new THREE.DirectionalLight(0xffffff, 4); 
    directionalLight.position.set(3, 3, 3);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 10, 10); 
    pointLight.position.set(-2, 2, 2);
    scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2); 
    scene.add(ambientLight);

    const gui = new GUI();
    gui.addColor(new ColorGUIHelper(directionalLight, 'color'), 'value').name('color');
    gui.add(directionalLight, 'intensity', 0, 5, 0.01);
    gui.add(directionalLight.target.position, 'x', -10, 10);
    gui.add(directionalLight.target.position, 'z', -10, 10);
    gui.add(directionalLight.target.position, 'y', 0, 10);
    
    // 1. Створюємо об'єкт куба
    const boxGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);

    // Матеріал для першого об'єкту 
    const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x87CEEB, 
        transparent: true,
        opacity: 0.5,
        roughness: 0.4,
        metalness: 0.8,
        reflectivity: 1.0,
        transmission: 0.8,
        clearcoat: 0.6,
        side: THREE.BackSide ,
    });
    // Створюємо меш
    boxMesh = new THREE.Mesh(boxGeometry, glassMaterial);
    boxMesh.position.x = -1.5;
    scene.add(boxMesh);

    // 2. Створюємо об'єкт Torus Knot
    const sphereGeometry = new THREE.SphereGeometry(0.4, 1, 1);
    // Матеріал для другого
    const emissiveMaterial = new THREE.MeshNormalMaterial();
    // Створюємо наступний меш
    sphereMesh = new THREE.Mesh(sphereGeometry, emissiveMaterial);
    scene.add(sphereMesh);

    // 3. Створюємо об'єкт Icosahedron
    const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1);
    // Матеріал для третього
    const goldMaterial = new THREE.MeshPhongMaterial({
        color: 0xffd700,
        shininess: 150,
    });
    // Створюємо наступний меш
    cylinderMesh = new THREE.Mesh(cylinderGeometry, goldMaterial);
    cylinderMesh.position.x = 1.5;
    scene.add(cylinderMesh);
    
    // Позиція для камери
    camera.position.z = 3;

    // Контролери для 360 огляду на вебсторінці, але не під час AR-сеансу
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // document.body.appendChild(ARButton.createButton(renderer));
    document.body.appendChild(
      ARButton.createButton(renderer)
    )


    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    renderer.setAnimationLoop(render);
    controls.update();
}

function render() {
    rotateObjects();
    renderer.render(scene, camera);
}
    
function rotateObjects() {
    boxMesh.rotation.y = boxMesh.rotation.y - 0.01;
    sphereMesh.rotation.x = sphereMesh.rotation.x - 0.01;
    cylinderMesh.rotation.x = cylinderMesh.rotation.x - 0.01;
}