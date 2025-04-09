import * as THREE from "three";
// import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const Test = (element) => {
  // window.addEventListener("load", init, false);

  function init() {
    createWorld();
    createPrimitive();
    //---
    animation();
  }

  let theme = { _darkred: 0x000000 };

  //--------------------------------------------------------------------

  let scene, camera, renderer, container;
  let start = Date.now();
  let _width, _height;

  function createWorld() {
    _width = window.innerWidth;
    _height = window.innerHeight;
    //---
    scene = new THREE.Scene();
    //scene.fog = new THREE.Fog(Theme._darkred, 8, 20);
    scene.background = new THREE.Color(0x000000);
    //---
    camera = new THREE.PerspectiveCamera(55, _width / _height, 1, 1000);
    camera.position.z = 12;
    //---
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(_width, _height);
    //---
    container = element;
    container.appendChild(renderer.domElement);
    //---

    window.addEventListener("resize", onWindowResize, false);
  }

  function onWindowResize() {
    _width = window.innerWidth;
    _height = window.innerHeight;
    renderer.setSize(_width, _height);
    camera.aspect = _width / _height;
    camera.updateProjectionMatrix();
    console.log("- resize -");
  }

  //--------------------------------------------------------------------

  var mat;
  var primitiveElement = function () {
    this.mesh = new THREE.Object3D();
    mat = new THREE.ShaderMaterial({
      wireframe: false,
      //fog: true,
      uniforms: {
        time: {
          type: "f",
          value: 0.0,
        },
        pointscale: {
          type: "f",
          value: 0.0,
        },
        decay: {
          type: "f",
          value: 0.0,
        },
        complex: {
          type: "f",
          value: 0.0,
        },
        waves: {
          type: "f",
          value: 0.0,
        },
        eqcolor: {
          type: "f",
          value: 1.0,
        },
        fragment: {
          type: "i",
          value: true,
        },
        redhell: {
          type: "i",
          value: true,
        },
      },
      vertexShader: document.getElementById("vertexShader").textContent,
      fragmentShader: document.getElementById("fragmentShader").textContent,
    });
    var geo = new THREE.IcosahedronGeometry(3, 100);
    var mesh = new THREE.Points(geo, mat);

    //---
    this.mesh.add(mesh);
  };

  var _primitive;
  function createPrimitive() {
    _primitive = new primitiveElement();
    scene.add(_primitive.mesh);
  }

  //--------------------------------------------------------------------

  var options = {
    perlin: {
      vel: 0.002,
      speed: 0.0005,
      perlins: 1.0,
      decay: 0.1,
      complex: 0.3,
      waves: 20.0,
      eqcolor: 11.0,
      fragment: true,
      redhell: true,
    },
    spin: {
      sinVel: 0.0,
      ampVel: 80.0,
    },
  };

  //--------------------------------------------------------------------

  function animation() {
    requestAnimationFrame(animation);
    var performance = Date.now() * 0.003;

    _primitive.mesh.rotation.y += options.perlin.vel;
    _primitive.mesh.rotation.x =
      (Math.sin(performance * options.spin.sinVel) * options.spin.ampVel * Math.PI) / 180;
    //---
    mat.uniforms["time"].value = options.perlin.speed * (Date.now() - start);
    mat.uniforms["pointscale"].value = options.perlin.perlins;
    mat.uniforms["decay"].value = options.perlin.decay;
    mat.uniforms["complex"].value = options.perlin.complex;
    mat.uniforms["waves"].value = options.perlin.waves;
    mat.uniforms["eqcolor"].value = options.perlin.eqcolor;
    mat.uniforms["fragment"].value = options.perlin.fragment;
    mat.uniforms["redhell"].value = options.perlin.redhell;
    //---
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  }

  init();
};

export default Test;
