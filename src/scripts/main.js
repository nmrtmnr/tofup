import * as THREE from "three";

function init() {
  let rot = 0;
  let mouseX = 0;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  camera.position.set(0, 0, 1000);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const geometry = new THREE.SphereGeometry(300, 30, 30);
  const loader = new THREE.TextureLoader();
  const material = new THREE.MeshStandardMaterial({
    // color: 0xFF0000,
    map: texture,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  createStarField();

  function createStarField() {
    const vertices = [];

    for (let i = 0; i < 1000; i++) {
      const x = 3000 * (Math.random() - 0.5);
      const y = 3000 * (Math.random() - 0.5);
      const z = 3000 * (Math.random() - 0.5);

      vertices.push(x, y, z);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );

    const material = new THREE.PointsMaterial({
      size: 10,
      color: 0xffffff,
    });

    const mesh = new THREE.Points(geometry, material);
    scene.add(mesh);
  }

  const directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  document.addEventListener(
    "mousemove",
    (e) => {
      mouseX = e.pageX;
    },
    false
  );

  animate();

  function animate() {
    const targetRot = (mouseX / window.innerWidth) * 360;
    rot += (targetRot - rot) * 0.02;

    const radian = (rot * Math.PI) / 180;
    // const radian = rot * (Math.PI / 180)
    camera.position.x = 1000 * Math.sin(radian);
    camera.position.z = 1000 * Math.cos(radian);

    camera.lookAt(new THREE.Vector3(0, 0, 0));
    mesh.rotation.y += 0.01;

    renderer.render(scene, camera);

    requestAnimationFrame(animate);
  }
}

init();
