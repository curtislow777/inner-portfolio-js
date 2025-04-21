import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// Scene setup
const scene = new THREE.Scene();
const canvas = document.getElementById("three-canvas");
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
});
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Camera setup
const camera = new THREE.PerspectiveCamera(
  75,
  canvas.clientWidth / canvas.clientHeight,
  0.1,
  1000
);
camera.position.z = 5;
scene.add(camera);

// Create texture loaders
const textureLoader = new THREE.TextureLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = false;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(2, 2, 2);
scene.add(directionalLight);

// Create a group to hold all our objects
const group = new THREE.Group();
scene.add(group);

// Simple clock manager
const clockManager = {
  hourHand: null,
  minuteHand: null,
  setHourHand(mesh) {
    this.hourHand = mesh;
  },
  setMinuteHand(mesh) {
    this.minuteHand = mesh;
  },
  updateClock() {
    if (this.hourHand && this.minuteHand) {
      const now = new Date();
      const hours = now.getHours() % 12;
      const minutes = now.getMinutes();

      // Update hour hand (30 degrees per hour + slight adjustment for minutes)
      this.hourHand.rotation.z = -((hours + minutes / 60) * (Math.PI / 6));

      // Update minute hand (6 degrees per minute)
      this.minuteHand.rotation.z = -(minutes * (Math.PI / 30));
    }
  },
};

// Helper functions for textures
function getTextureKeyFromName(meshName) {
  if (meshName.includes("-one")) return "one";
  if (meshName.includes("-two")) return "two";
  if (meshName.includes("-three")) return "three";
  if (meshName.includes("-fourA")) return "fourA";
  if (meshName.includes("-fourB")) return "fourB";
  if (meshName.includes("-five")) return "five";
  if (meshName.includes("-sixA")) return "sixA";
  if (meshName.includes("-sixB")) return "sixB";
  if (meshName.includes("-seven")) return "seven";
  if (meshName.includes("-eight")) return "eight";
  if (meshName.includes("-nine")) return "nine";
  if (meshName.includes("-emissive")) return "emissive";

  return null;
}

function loadTexture(path) {
  const tex = textureLoader.load(path);
  tex.flipY = false;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  return tex;
}

function createGlassMaterial() {
  // Simple transparent material for glass
  return new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0.3,
    color: 0xffffff,
  });
}

function processGlassMesh(child) {
  if (child.name.includes("glass")) {
    child.material = createGlassMaterial();
    return true;
  }
  return false;
}

// Load and prepare all textures (only day textures since we don't need night mode)
const textureMap = {
  one: "/textures/day/Day-Texture1.webp",
  two: "/textures/day/Day-Texture2.webp",
  three: "/textures/day/Day-Texture3.webp",
  fourA: "/textures/day/Day-Texture4A.webp",
  fourB: "/textures/day/Day-Texture4B.webp",
  five: "/textures/day/Day-Texture5.webp",
  sixA: "/textures/day/Day-Texture6A.webp",
  sixB: "/textures/day/Day-Texture6B.webp",
  seven: "/textures/day/Day-Texture7.webp",
  eight: "/textures/day/Day-Texture8.webp",
  nine: "/textures/day/Day-Texture9.webp",
  emissive: "/textures/day/Day-Emissive.webp",
};

// Load all textures
const loadedTextures = {};
Object.entries(textureMap).forEach(([key, path]) => {
  loadedTextures[key] = loadTexture(path);
});

// Load model and apply textures
loader.load("/models/room-port-v1.glb", (glb) => {
  glb.scene.scale.set(0.3, 0.3, 0.3);

  glb.scene.traverse((child) => {
    if (child.isMesh) {
      const isGlass = processGlassMesh(child);

      if (!isGlass) {
        const textureKey = getTextureKeyFromName(child.name);

        if (textureKey && loadedTextures[textureKey]) {
          child.material = new THREE.MeshBasicMaterial({
            map: loadedTextures[textureKey],
          });

          if (textureKey === "emissive") {
            child.material.color = new THREE.Color(0xffffff);
          }
        }
      }

      if (child.name.includes("hour-hand")) {
        clockManager.setHourHand(child);
      }
      if (child.name.includes("minute-hand")) {
        clockManager.setMinuteHand(child);
      }
    }
  });

  scene.add(glb.scene);
});

const geometries = [
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.SphereGeometry(0.7, 32, 32),
  new THREE.TorusGeometry(0.7, 0.2, 16, 100),
  new THREE.TetrahedronGeometry(0.7),
  new THREE.ConeGeometry(0.7, 1, 32),
  new THREE.DodecahedronGeometry(0.7),
];

const materials = [
  new THREE.MeshBasicMaterial({ color: 0x61dafb }),
  new THREE.MeshBasicMaterial({ color: 0xf7df1e }),
  new THREE.MeshBasicMaterial({ color: 0x3178c6 }),
  new THREE.MeshBasicMaterial({ color: 0xe34f26 }),
  new THREE.MeshBasicMaterial({ color: 0x1572b6 }),
  new THREE.MeshBasicMaterial({ color: 0x339933 }),
];

for (let i = 0; i < geometries.length; i++) {
  const mesh = new THREE.Mesh(geometries[i], materials[i]);

  const radius = 3;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.random() * Math.PI;

  mesh.position.x = radius * Math.sin(phi) * Math.cos(theta);
  mesh.position.y = radius * Math.sin(phi) * Math.sin(theta);
  mesh.position.z = radius * Math.cos(phi);

  // Add random rotation
  mesh.rotation.x = Math.random() * Math.PI;
  mesh.rotation.y = Math.random() * Math.PI;

  group.add(mesh);
}

const centralGeometry = new THREE.IcosahedronGeometry(1.2, 0);
const centralMaterial = new THREE.MeshBasicMaterial({
  color: 0x64ffda,
  wireframe: true,
});
const centralMesh = new THREE.Mesh(centralGeometry, centralMaterial);
group.add(centralMesh);

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
});

// Animation loop
const animate = () => {
  requestAnimationFrame(animate);

  clockManager.updateClock();

  group.rotation.x += 0.001;
  group.rotation.y += 0.002;

  group.children.forEach((child) => {
    child.rotation.x += 0.005;
    child.rotation.y += 0.007;
  });

  controls.update();

  // Render
  renderer.render(scene, camera);
};

animate();
