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

    // let material = new THREE.ShaderMaterial({
    //   transparent: true,
    //   uniforms: {
    //     size: { value: 20 },
    //     scale: { value: 1 },
    //     color: { value: new THREE.Color("maroon") },
    //   },
    //   vertexShader: THREE.ShaderLib.points.vertexShader,
    //   fragmentShader: `
    //   uniform vec3 color;
    //   void main() {
    //       vec2 xy = gl_PointCoord.xy - vec2(0.5);
    //       float ll = length(xy);

    //       gl_FragColor = vec4(color, step(ll, 0.5) > 0.0);
    //   }
    //   `,
    // });

    // const numParticles = 50;
    // const trailLength = 1000;

    // const vertices = new Float32Array(
    //   Array.from(
    //     { length: numParticles * trailLength * 3 },
    //     () => (Math.random() * 2) / 100
    //   )
    // );

    // geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    // geometry.computeBoundingSphere();

    // let points = new THREE.Points(
    //   geometry,
    //   new THREE.PointsMaterial({ color: "maroon", size: 0.5 })
    // );
    // scene.add(points);

    let lines = Array.from({ length: 10 }).map(() =>
      new Array(100).fill(
        new THREE.Vector3(
          (Math.random() * 2) / 100,
          (Math.random() * 2) / 100,
          (Math.random() * 2) / 100
        )
      )
    );

    camera.position.z = -70;
    camera.position.x = -70;
    camera.position.y = -50;

    const a = 10;
    const b = 28;
    const c = 8 / 3;

    const increment = 0.00001;
    const start = 0.001;

    const material = new THREE.LineBasicMaterial({ color: "maroon" });

    function animate(t: number) {
      while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
      }

      lines = lines.map((line) =>
        line.map((point, i) => {
          const x = point.x;
          const y = point.y;
          const z = point.z;

          let ti = t + i / t;

          let xi = x + ti * a * (y - x);
          let yi = y + ti * (x * (b - z) - y);
          let zi = z + ti * (x * y - c * z);

          return new THREE.Vector3(xi, yi, zi);
        })
      );

      lines.forEach((line) => {
        const buffer = new THREE.BufferGeometry().setFromPoints(line);
        const geometry = new THREE.Line(buffer, material);
        scene.add(geometry);
      });

      // for each particle
      // for (let i = 0; i < vertices.length; i += 30) {
      //   const x = vertices[i];
      //   const y = vertices[i + 1];
      //   const z = vertices[i + 2];

      //   // for each trail particle
      //   for (let j = 0; j < trailLength; j += 1) {
      //     let ti = t + j * (increment / 10000000);

      //     vertices[i + j * 3] = x + ti * a * (y - x);
      //     vertices[i + 1 + j * 3] = y + ti * (x * (b - z) - y);
      //     vertices[i + 2 + j * 3] = z + ti * (x * y - c * z);
      //   }
      // }

      // for (let i = 0; i < vertices.length / (trailLength * 3); i += 1) {
      //   for (let j = 0; j < trailLength; j += 1) {
      //     // let j = 0;
      //     let ti = t + j * increment;

      //     const x = vertices[i * trailLength * 3];
      //     const y = vertices[i * trailLength * 3 + 1];
      //     const z = vertices[i * trailLength * 3 + 2];

      //     vertices[i * trailLength * 3 + j] = x + ti * a * (y - x);
      //     vertices[i * trailLength * 3 + 1 + j] = y + ti * (x * (b - z) - y);
      //     vertices[i * trailLength * 3 + 2 + j] = z + ti * (x * y - c * z);
      //   }
      // }

      // geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

      requestAnimationFrame(() => animate(t + increment));
      controls.update();
      renderer.render(scene, camera);
    }
    animate(start);
  });
  return <div id="three-container"></div>;
}

export default App;
