let scene, camera, renderer, cube, textGroup;

function init() {
  // Create a scene
  scene = new THREE.Scene();

  // Create a camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  // Create a renderer and add it to the DOM
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Add a simple cube
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const materials = [
    new THREE.MeshBasicMaterial({ color: 0xff0000 }), // Red - Right side
    new THREE.MeshBasicMaterial({ color: 0x00ff00 }), // Green - Left side
    new THREE.MeshBasicMaterial({ color: 0x0000ff }), // Blue - Top side
    new THREE.MeshBasicMaterial({ color: 0xffff00 }), // Yellow - Bottom side
    new THREE.MeshBasicMaterial({ color: 0xff00ff }), // Magenta - Front side
    new THREE.MeshBasicMaterial({ color: 0x00ffff }), // Cyan - Back side
  ];
  cube = new THREE.Mesh(geometry, materials);
  scene.add(cube);


  // Handle window resize
  window.addEventListener("resize", onWindowResize, false);

  animate();
}

function animate() {
  requestAnimationFrame(animate);
  // Rotate the cube
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

init();
