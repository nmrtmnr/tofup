import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import * as CANNON from "cannon-es";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

// Scene, Camera, Renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 2, 25);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;
controls.rotateSpeed = 1;

// Cannon.js World
const world = new CANNON.World();
world.gravity.set(0, -12, 0);
world.broadphase = new CANNON.NaiveBroadphase();
world.solver.iterations = 7;

// Floor
const floorGeometry = new THREE.PlaneGeometry(50, 50);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body({ mass: 0 });
floorBody.addShape(floorShape);
floorBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
world.addBody(floorBody);

floorBody.material = new CANNON.Material({ restitution: 1 }); // Example restitution value

// OBJ Loader
const loader = new OBJLoader();
loader.load(
    '/assets/objs/softbody/rock.obj', // **Make sure this path is correct!**
    (object) => {
        // Traverse through all child meshes and set their material
        object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.material = new THREE.MeshStandardMaterial({ color: 0x333333 });
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        // Compute Bounding Box Center
        const bbox = new THREE.Box3().setFromObject(object);
        const center = new THREE.Vector3();
        bbox.getCenter(center);

        // Offset the object so its pivot is at the center of the bounding box
        object.position.sub(center);

        // Create a parent group to rotate around the center
        const objectGroup = new THREE.Group();
        objectGroup.add(object);
        objectGroup.position.copy(center);  // Place the pivot at the center
        scene.add(objectGroup);

       
        // Physics (Convex Hull)
        let geometry = object.children[0].geometry.clone();
        const vertices = geometry.attributes.position.array;
        const indices = geometry.index?.array || undefined;

        const cannonVertices = [];
        for (let i = 0; i < vertices.length; i += 3) {
            cannonVertices.push(new CANNON.Vec3(vertices[i] - center.x, vertices[i + 1] - center.y, vertices[i + 2] - center.z));
        }

        const cannonFaces = [];
        if (indices) {
            for (let i = 0; i < indices.length; i += 3) {
                cannonFaces.push([indices[i], indices[i + 1], indices[i + 2]]);
            }
        } else {
            for (let i = 0; i < cannonVertices.length; i += 3) {
                cannonFaces.push([i, i + 1, i + 2]);
            }
        }

        const shape = new CANNON.ConvexPolyhedron({ vertices: cannonVertices, faces: cannonFaces });
        const body = new CANNON.Body({ mass: 1000, position: new CANNON.Vec3(center.x, center.y +  10, center.z) });
        body.addShape(shape);
        world.addBody(body);

        objectGroup.userData.physicsBody = body;

        // **Add restitution to the object**
        body.material = new CANNON.Material({ restitution: 1 }); // Example restitution value

        // Create contact material to combine restitution
        const groundContactMaterial = new CANNON.ContactMaterial(
            floorBody.material,
            body.material,
            {
                friction: 1.3, // You can also set friction here if needed
                restitution: 0.6 // Adjust overall restitution for the collision
            }
        );


        // Store the center dot for later updates
        objectGroup.userData.centerDot = centerDot;
    },
    (xhr) => console.log((xhr.loaded / xhr.total * 100) + '% loaded'),
    (error) => console.error('An error happened', error)
);

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(3, 5, 2);
light.castShadow = true;
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 10;
light.shadow.bias = -0.002;
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Resize handling
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// Animation loop
let timeStep = 1 / 60;
const rotationSpeed = THREE.MathUtils.degToRad(135); // Convert degrees to radians
let lastRotationTime = 0;
let rotationProgress = 1; // Start at 1 so the first rotation triggers immediately
const rotationDuration = 1; // Time in seconds for easing
let rotationStartQuaternion = new THREE.Quaternion();
let targetQuaternion = new THREE.Quaternion();

function animate() {
    requestAnimationFrame(animate);
    world.step(timeStep);

    const currentTime = performance.now() / 2000;  // Time in seconds

    scene.traverse((object) => {
        if (object.userData.physicsBody) {
            const body = object.userData.physicsBody;

            const bodyQuaternion = new THREE.Quaternion(
                body.quaternion.x,
                body.quaternion.y,
                body.quaternion.z,
                body.quaternion.w
            );

            // Rotate object around its center (always reset this for every frame)
            if (currentTime - lastRotationTime >= 1 && rotationProgress >= 1) {
                lastRotationTime = currentTime;
                rotationProgress = 0;

                rotationStartQuaternion.copy(bodyQuaternion);

                const rotationQuaternion = new THREE.Quaternion();
                rotationQuaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotationSpeed);
                targetQuaternion.copy(rotationStartQuaternion).multiply(rotationQuaternion);
            }

            if (rotationProgress < 1) {
                rotationProgress += timeStep / rotationDuration;
                rotationProgress = Math.min(rotationProgress, 1);
                bodyQuaternion.slerpQuaternions(rotationStartQuaternion, targetQuaternion, rotationProgress);
                body.quaternion.set(bodyQuaternion.x, bodyQuaternion.y, bodyQuaternion.z, bodyQuaternion.w);
            }

            // Update position and rotation of the object based on the physics body
            object.position.copy(body.position);
            object.quaternion.copy(bodyQuaternion); // Set the rotation of the object from the physics body

            // Update the center dot position
            if (object.userData.centerDot) {
                object.userData.centerDot.position.copy(object.position);
            }
        }
    });

    controls.update();
    renderer.render(scene, camera);
}

animate();
