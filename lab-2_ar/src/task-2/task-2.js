import '../style.css'

import * as THREE from "three"
import { ARButton } from "three/addons/webxr/ARButton.js"
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let camera, scene, renderer;
let loader;
let model;

init();
animate();

async function init() {
    const container = document.createElement('div');
    document.body.appendChild(container);

    // Сцена
    scene = new THREE.Scene();

    // Камера
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
    
    // Додаємо GLTF модель на сцену
    // const modelUrl = 'https://www.dropbox.com/scl/fi/o3iuwu009aiea1mdjgx58/stylized_anime_vinyl_figure_suguru_geto.glb?rlkey=rdww2pmvvf6p3qikpojvnezop&st=dtyyop8j&dl=0';
    const suguruModelUrls = {
        local: 'stylized_anime_vinyl_figure_suguru_geto.glb',
        googleDrive: 'https://cors-anywhere.herokuapp.com/https://drive.google.com/uc?id=18Mk36K0IHuzBnaQ78qxNivAgMvd3A44w&export=download',
        gitHubPages: 'https://github.com/vwicky/vwicky.github.io/blob/main/stylized_anime_vinyl_figure_suguru_geto.glb',
    }
    const shrineModelUrls = {
        local: 'malevolent_shrine_jjk_cc.glb',
    }
    const satoruModelUrls = {
        local: 'satoru_gojo.glb',
    }

    // Створюємо завантажувач
    loader = new GLTFLoader();
    loader.load(
        suguruModelUrls.local,
        function (gltf) {
            model = gltf.scene;
            model.position.z = -5;
            scene.add(model);
            // Створюємо матеріал для моделі (якщо потрібно)
            const goldMaterial = new THREE.MeshStandardMaterial({
                color: 0xffd700, // Золотий колір
                metalness: 1,
                roughness: 0.05,
            });
            // Змінюємо модель (якщо потрібно)
            model.traverse((child) => {
                if (child.isMesh) {
                    child.material = goldMaterial;
                    child.material.needsUpdate = true;
                }
            });
            console.log("Model added to scene");
        },
        function (xhr) {},
        function (error) { console.error(error); }
    );
    loader.load(
        shrineModelUrls.local,
        function (gltf) {
            model = gltf.scene;
            model.position.z = -5;
            model.position.x = -3
            model.position.y = -1
            model.scale.set(0.4, 0.4, 0.4)
            scene.add(model);

            console.log("> shrine added to scene");
        },
        function (xhr) {},
        function (error) { console.error(error); }
    )
    loader.load(
        satoruModelUrls.local,
        function (gltf) {
            model = gltf.scene;
            model.position.z = -2;
            model.position.x = 1
            model.position.y = -1
           
            scene.add(model);

            console.log("> shrine added to scene");
        },
        function (xhr) {},
        function (error) { console.error(error); }
    )

    document.body.appendChild(ARButton.createButton(renderer));

    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    renderer.setAnimationLoop(render);
}

function render() {
    // rotateModel();
    renderer.render(scene, camera);
}
    
let degrees = 0; // кут для оберту нашої моделі
    
function rotateModel() {
    if (model !== undefined) {
        // допустима межа градусів - від 0 до 360
        // Після 360 three.js сприйматиме 360 як 0, 361 як 1, 362 як 2 і так далі
        degrees = degrees + 0.5; 
        model.rotation.x = THREE.MathUtils.degToRad(degrees); // тут перетворюємо градуси у радіани
    } 
}