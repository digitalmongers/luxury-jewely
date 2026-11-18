import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

function detectSoftwareWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

export const AuroraShaderCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSoftwareGl = detectSoftwareWebGL();

    if (isSoftwareGl || prefersReduced) {
      return;
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true,
        powerPreference: 'low-power',
      });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(mount.clientWidth, mount.clientHeight) },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      depthWrite: false,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec2 uResolution;
        varying vec2 vUv;

        float wave(vec2 uv, float speed, float freq, float phase) {
          return sin(uv.x * freq + uTime * speed + phase) * 0.5 +
                 cos(uv.y * (freq * 0.7) - uTime * speed * 0.8 + phase) * 0.5;
        }

        void main() {
          vec2 uv = vUv;
          float n1 = wave(uv, 0.22, 2.4, 0.0);
          float n2 = wave(uv * 1.4, 0.16, 3.1, 1.7);
          float ribbon = smoothstep(-0.3, 0.85, n1 * 0.6 + n2 * 0.4);

          vec3 obsidian = vec3(0.031, 0.031, 0.039);
          vec3 platinumMist = vec3(0.145, 0.155, 0.185);
          vec3 champagneWarm = vec3(0.22, 0.19, 0.15);

          float warmMask = smoothstep(0.35, 0.9, uv.x) * smoothstep(0.1, 0.8, 1.0 - uv.y);
          vec3 color = mix(obsidian, platinumMist, ribbon * 0.52);
          color = mix(color, champagneWarm, ribbon * warmMask * 0.35);

          float vignette = smoothstep(1.15, 0.2, length(uv - vec2(0.5)));
          gl_FragColor = vec4(color, vignette * 0.85);
        }
      `,
    });

    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(quad);

    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      uniforms.uResolution.value.set(w, h);
    };
    window.addEventListener('resize', onResize);

    const clock = new THREE.Clock();
    let frameId = 0;
    const renderLoop = () => {
      uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(renderLoop);
    };
    frameId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', onResize);
      quad.geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse 70% 55% at 72% 28%, rgba(214,199,174,0.09), transparent 65%), radial-gradient(ellipse 65% 60% at 22% 72%, rgba(167,173,184,0.08), transparent 70%)',
      }}
    />
  );
};
