import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

import * as THREE from "three";

import { PrimaryButton } from "@fluentui/react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

function App() {
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);

    const geometry = new THREE.BufferGeometry();
    // const material = new THREE.PointsMaterial({ color: 0x00ff00 });

    let material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        size: { value: 10 },
        scale: { value: 1 },
        color: { value: new THREE.Color("maroon") },
      },
      vertexShader: THREE.ShaderLib.points.vertexShader,
      fragmentShader: `
      uniform vec3 color;
      void main() {
          vec2 xy = gl_PointCoord.xy - vec2(0.15);
          float ll = length(xy);
          gl_FragColor = vec4(color, step(ll, 0.15));
      }
      `,
    });

    const vertices = new Float32Array(
      Array.from({ length: 30000 }, () => (Math.random() * 2) / 100)
    );

    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    // geometry.computeBoundingSphere();

    let points = new THREE.Points(geometry, material);
    scene.add(points);

    camera.position.z = -70;
    camera.position.x = -70;
    camera.position.y = -50;

    const a = 10;
    const b = 28;
    const c = 8 / 3;

    function animate(t: number) {
      for (let i = 0; i < vertices.length; i += 3) {
        const x = vertices[i];
        const y = vertices[i + 1];
        const z = vertices[i + 2];

        vertices[i] = x + t * a * (y - x);
        vertices[i + 1] = y + t * (x * (b - z) - y);
        vertices[i + 2] = z + t * (x * y - c * z);
      }

      geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

      requestAnimationFrame(() => animate(t + 0.00001));
      controls.update();
      renderer.render(scene, camera);
    }
    animate(0.001);
  });
  return <div id="three-container"></div>;
}

export default App;
