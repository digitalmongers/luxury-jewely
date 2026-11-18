'use client';

import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  ContactShadows,
  Environment,
  Lightformer,
  OrbitControls,
  useTexture,
} from '@react-three/drei';
import * as THREE from 'three';
import { ChevronDown, ChevronUp, RotateCw, Layers, Camera } from 'lucide-react';
import { FinishId, FinishOption } from '../data/product';
import { NextImage } from './NextImage';
import { useProductCatalog } from './ProductCatalogContext';

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

type ViewerMode = '3d-sculpture' | '360-turntable';
type CameraPreset = 'hero' | 'clasp' | 'profile';

interface PlatinumBali3DViewerProps {
  selectedFinish: FinishOption;
  onSelectFinish: (finish: FinishOption) => void;
}

class HelicalStrandCurve extends THREE.Curve<THREE.Vector3> {
  radius: number;
  phaseOffset: number;
  twistTurns: number;
  strandOffset: number;

  constructor(radius = 0.82, phaseOffset = 0, twistTurns = 3, strandOffset = 0.085) {
    super();
    this.radius = radius;
    this.phaseOffset = phaseOffset;
    this.twistTurns = twistTurns;
    this.strandOffset = strandOffset;
  }

  getPoint(t: number, optionalTarget = new THREE.Vector3()): THREE.Vector3 {
    // Leaves a small clean gap at the top for the hinged clasp assembly
    const startAngle = Math.PI * 0.5 + 0.24;
    const arcSpan = Math.PI * 2 - 0.48;
    const theta = startAngle + t * arcSpan;

    const localTwist = t * Math.PI * 2 * this.twistTurns + this.phaseOffset;
    const radialOffset = Math.cos(localTwist) * this.strandOffset;
    const lateralOffset = Math.sin(localTwist) * this.strandOffset;

    const r = this.radius + radialOffset;
    const x = Math.cos(theta) * r;
    const y = Math.sin(theta) * r;
    const z = lateralOffset;

    return optionalTarget.set(x, y, z);
  }
}

interface SingleEarringProps {
  finishId: FinishId;
  explode: number;
  position: [number, number, number];
  rotationY: number;
}

const SingleBaliEarring: React.FC<SingleEarringProps> = ({
  finishId,
  explode,
  position,
  rotationY,
}) => {
  const strand1Ref = useRef<THREE.Mesh>(null);
  const strand2Ref = useRef<THREE.Mesh>(null);
  const strand3Ref = useRef<THREE.Mesh>(null);
  const claspRef = useRef<THREE.Group>(null);
  const diamondsRef = useRef<THREE.Group>(null);

  const geometries = useMemo(() => {
    const c1 = new HelicalStrandCurve(0.84, 0, 3.0, 0.082);
    const c2 = new HelicalStrandCurve(0.84, (Math.PI * 2) / 3, 3.0, 0.082);
    const c3 = new HelicalStrandCurve(0.84, (Math.PI * 4) / 3, 3.0, 0.082);

    const g1 = new THREE.TubeGeometry(c1, 140, 0.056, 20, false);
    const g2 = new THREE.TubeGeometry(c2, 140, 0.052, 20, false);
    const g3 = new THREE.TubeGeometry(c3, 140, 0.052, 20, false);

    // Curved locking ear-post arc bridging top clasp gap
    const postCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.2, 0.83, 0),
      new THREE.Vector3(0, 0.91, 0),
      new THREE.Vector3(0.2, 0.83, 0),
    ]);
    const postGeo = new THREE.TubeGeometry(postCurve, 32, 0.022, 12, false);

    return { g1, g2, g3, postGeo };
  }, []);

  useEffect(() => {
    return () => {
      geometries.g1.dispose();
      geometries.g2.dispose();
      geometries.g3.dispose();
      geometries.postGeo.dispose();
    };
  }, [geometries]);

  const platinumParams = useMemo(() => {
    if (finishId === 'satin-pt950') {
      return {
        color: '#d4d8df',
        metalness: 0.94,
        roughness: 0.28,
        anisotropy: 0.85,
        clearcoat: 0.15,
      };
    }
    return {
      color: '#edf0f5',
      metalness: 0.98,
      roughness: 0.07,
      anisotropy: 0.3,
      clearcoat: 0.45,
    };
  }, [finishId]);

  const centerStrandColor = finishId === 'champagne-pt950' ? '#dcc49c' : platinumParams.color;

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const targetZ1 = explode * 0.36;
    const targetZ2 = -explode * 0.36;
    const targetYClasp = explode * 0.44;
    const targetRadialDiamonds = explode * 0.26;

    if (strand1Ref.current) {
      strand1Ref.current.position.z = THREE.MathUtils.damp(
        strand1Ref.current.position.z,
        targetZ1,
        7,
        dt
      );
    }
    if (strand3Ref.current) {
      strand3Ref.current.position.z = THREE.MathUtils.damp(
        strand3Ref.current.position.z,
        targetZ2,
        7,
        dt
      );
    }
    if (claspRef.current) {
      claspRef.current.position.y = THREE.MathUtils.damp(
        claspRef.current.position.y,
        targetYClasp,
        7,
        dt
      );
    }
    if (diamondsRef.current) {
      diamondsRef.current.position.y = THREE.MathUtils.damp(
        diamondsRef.current.position.y,
        -targetRadialDiamonds,
        7,
        dt
      );
    }
  });

  const diamondAngles = [-Math.PI * 0.68, -Math.PI * 0.5, -Math.PI * 0.32];

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Primary Strand 1 */}
      <mesh ref={strand1Ref} geometry={geometries.g1} castShadow receiveShadow>
        <meshPhysicalMaterial
          color={platinumParams.color}
          metalness={platinumParams.metalness}
          roughness={platinumParams.roughness}
          anisotropy={platinumParams.anisotropy}
          clearcoat={platinumParams.clearcoat}
          envMapIntensity={1.35}
        />
      </mesh>

      {/* Center Interlocking Strand 2 */}
      <mesh ref={strand2Ref} geometry={geometries.g2} castShadow receiveShadow>
        <meshPhysicalMaterial
          color={centerStrandColor}
          metalness={0.97}
          roughness={finishId === 'satin-pt950' ? 0.14 : 0.08}
          clearcoat={0.5}
          envMapIntensity={1.45}
        />
      </mesh>

      {/* Inner Architectural Strand 3 */}
      <mesh ref={strand3Ref} geometry={geometries.g3} castShadow receiveShadow>
        <meshPhysicalMaterial
          color={platinumParams.color}
          metalness={platinumParams.metalness}
          roughness={platinumParams.roughness + 0.05}
          anisotropy={platinumParams.anisotropy}
          envMapIntensity={1.3}
        />
      </mesh>

      {/* Precision Hinged Click-Top Snap Clasp Assembly */}
      <group ref={claspRef}>
        <mesh geometry={geometries.postGeo} castShadow>
          <meshPhysicalMaterial color="#eef1f6" metalness={0.98} roughness={0.05} />
        </mesh>
        {/* Left hinge collar */}
        <mesh position={[-0.22, 0.81, 0]} rotation={[0, 0, -0.25]} castShadow>
          <cylinderGeometry args={[0.075, 0.075, 0.14, 24]} />
          <meshPhysicalMaterial color="#e8ebf0" metalness={0.96} roughness={0.1} />
        </mesh>
        {/* Right snap housing */}
        <mesh position={[0.22, 0.81, 0]} rotation={[0, 0, 0.25]} castShadow>
          <boxGeometry args={[0.14, 0.16, 0.15]} />
          <meshPhysicalMaterial color="#e8ebf0" metalness={0.96} roughness={0.12} />
        </mesh>
        {/* Micro hinge pivot pin */}
        <mesh position={[-0.22, 0.81, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.024, 0.024, 0.18, 16]} />
          <meshPhysicalMaterial color="#d6c7ae" metalness={0.95} roughness={0.15} />
        </mesh>
      </group>

      {/* Trio of Bezel-Set Natural Diamond Accents */}
      <group ref={diamondsRef}>
        {diamondAngles.map((angle, i) => {
          const r = 0.92;
          const x = Math.cos(angle) * r;
          const y = Math.sin(angle) * r;
          return (
            <group key={i} position={[x, y, 0.05]} rotation={[0, 0, angle + Math.PI / 2]}>
              {/* Platinum Bezel Collet */}
              <mesh castShadow>
                <cylinderGeometry args={[0.068, 0.058, 0.05, 24]} />
                <meshPhysicalMaterial color="#f2f4f8" metalness={0.98} roughness={0.05} />
              </mesh>
              {/* Faceted Natural Diamond */}
              <mesh position={[0, 0.025, 0]}>
                <octahedronGeometry args={[0.052, 1]} />
                <meshPhysicalMaterial
                  color="#ffffff"
                  metalness={0.05}
                  roughness={0.02}
                  ior={2.417}
                  reflectivity={1}
                  clearcoat={1}
                  envMapIntensity={2.4}
                />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
};

interface TurntableStageProps {
  gallery: Array<{ id: string; src: string }>;
  activeAngleIdx: number;
  onAngleChange: (idx: number) => void;
  autoRotate: boolean;
}

const PhotographicTurntableStage: React.FC<TurntableStageProps> = ({
  gallery,
  activeAngleIdx,
  onAngleChange,
  autoRotate,
}) => {
  const textures = useTexture(gallery.map((g) => g.src));
  const carouselRef = useRef<THREE.Group>(null);
  const { gl } = useThree();

  useEffect(() => {
    const maxAniso = gl.capabilities.getMaxAnisotropy();
    textures.forEach((tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = maxAniso;
      tex.needsUpdate = true;
    });
  }, [textures, gl]);

  const panelCount = textures.length;
  const radius = 2.4;

  useFrame((_, delta) => {
    if (!carouselRef.current) return;
    if (autoRotate) {
      carouselRef.current.rotation.y += delta * 0.25;
    } else {
      const targetAngle = -(activeAngleIdx * ((Math.PI * 2) / panelCount));
      carouselRef.current.rotation.y = THREE.MathUtils.damp(
        carouselRef.current.rotation.y,
        targetAngle,
        5,
        Math.min(delta, 0.05)
      );
    }
  });

  return (
    <group position={[0, 0.1, 0]}>
      <group ref={carouselRef}>
        {textures.map((tex, idx) => {
          const angle = (idx / panelCount) * Math.PI * 2;
          const x = Math.sin(angle) * radius;
          const z = Math.cos(angle) * radius;
          const isCurrent = idx === activeAngleIdx;
          return (
            <group
              key={gallery[idx]?.id || idx}
              position={[x, 0, z]}
              rotation={[0, angle, 0]}
              onClick={(e) => {
                e.stopPropagation();
                onAngleChange(idx);
              }}
            >
              {/* Frame backing */}
              <mesh position={[0, 0, -0.03]}>
                <boxGeometry args={[2.46, 1.88, 0.04]} />
                <meshStandardMaterial
                  color={isCurrent ? '#2b2823' : '#141418'}
                  metalness={0.8}
                  roughness={0.35}
                />
              </mesh>
              {/* Studio Product Image Plane */}
              <mesh>
                <planeGeometry args={[2.36, 1.78]} />
                <meshBasicMaterial map={tex} toneMapped={false} />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
};

interface CameraControllerProps {
  preset: CameraPreset;
  mode: ViewerMode;
  autoRotate: boolean;
  isSoftwareGl: boolean;
  resetSignal: number;
}

const CameraRig: React.FC<CameraControllerProps> = ({
  preset,
  mode,
  autoRotate,
  isSoftwareGl,
  resetSignal,
}) => {
  const { camera, size } = useThree();
  const controlsRef = useRef<React.ComponentRef<typeof OrbitControls>>(null);
  const transitioningRef = useRef(false);
  const targetPos = useRef(new THREE.Vector3(0, 0.75, 4.1));
  const targetLookAt = useRef(new THREE.Vector3(0, 0.15, 0));

  const isNarrow = size.width < 640;

  useEffect(() => {
    const distanceBoost = isNarrow ? 1.45 : 0;
    const mobileYShift = isNarrow ? -0.18 : 0;
    if (mode === '360-turntable') {
      targetPos.current.set(0, 0.35, 5.2 + distanceBoost);
      targetLookAt.current.set(0, 0.05 + mobileYShift, 0);
    } else if (preset === 'clasp') {
      targetPos.current.set(0.6, 1.15, 2.25 + (isNarrow ? 0.75 : 0));
      targetLookAt.current.set(0.42, 0.75 + (isNarrow ? -0.08 : 0), 0);
    } else if (preset === 'profile') {
      targetPos.current.set(3.2 + (isNarrow ? 0.8 : 0), 0.45, 2.2 + (isNarrow ? 0.7 : 0));
      targetLookAt.current.set(0, 0.15 + mobileYShift, 0);
    } else {
      targetPos.current.set(0, 0.65, 3.85 + distanceBoost);
      targetLookAt.current.set(0, 0.12 + mobileYShift, 0);
    }
    transitioningRef.current = true;
  }, [preset, mode, resetSignal, isNarrow]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    if (transitioningRef.current && controlsRef.current) {
      camera.position.x = THREE.MathUtils.damp(camera.position.x, targetPos.current.x, 6, dt);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, targetPos.current.y, 6, dt);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, targetPos.current.z, 6, dt);

      controlsRef.current.target.x = THREE.MathUtils.damp(
        controlsRef.current.target.x,
        targetLookAt.current.x,
        6,
        dt
      );
      controlsRef.current.target.y = THREE.MathUtils.damp(
        controlsRef.current.target.y,
        targetLookAt.current.y,
        6,
        dt
      );
      controlsRef.current.target.z = THREE.MathUtils.damp(
        controlsRef.current.target.z,
        targetLookAt.current.z,
        6,
        dt
      );

      if (camera.position.distanceTo(targetPos.current) < 0.02) {
        transitioningRef.current = false;
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enablePan={false}
      enableDamping={!isSoftwareGl}
      dampingFactor={0.05}
      autoRotate={autoRotate && !isSoftwareGl && mode === '3d-sculpture'}
      autoRotateSpeed={1.25}
      minDistance={1.8}
      maxDistance={7.0}
      minPolarAngle={Math.PI * 0.15}
      maxPolarAngle={Math.PI * 0.62}
      onStart={() => {
        transitioningRef.current = false;
      }}
    />
  );
};

export const PlatinumBali3DViewer: React.FC<PlatinumBali3DViewerProps> = ({
  selectedFinish,
  onSelectFinish,
}) => {
  const PRODUCT_DATA = useProductCatalog();
  const isSoftwareGl = useMemo(() => detectSoftwareWebGL(), []);
  const [mode, setMode] = useState<ViewerMode>('3d-sculpture');
  const [explode, setExplode] = useState(0);
  const [preset, setPreset] = useState<CameraPreset>('hero');
  const [autoRotate, setAutoRotate] = useState(true);
  const [dockExpanded, setDockExpanded] = useState(true);
  const [activeAngleIdx, setActiveAngleIdx] = useState(0);
  const [resetSignal, setResetSignal] = useState(0);
  const [contextLost, setContextLost] = useState(false);

  return (
    <section id="atelier-3d" className="py-12 sm:py-16 md:py-24 border-b border-white/[0.08] bg-[#09090C]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 md:gap-6 mb-6 md:mb-8">
          <div className="space-y-2 max-w-2xl">
            <span className="text-[12px] tracking-[0.08em] text-[#D6C7AE] block">
              Interactive 360° Atelier
            </span>
            <h2
              className="font-display text-[clamp(1.75rem,3vw,2.75rem)] leading-[1.1] font-semibold text-[#F4F4F6]"
              style={{ textWrap: 'balance' }}
            >
              Inspect the Trinity Architecture from Every Angle
            </h2>
          </div>

          {/* Mode Switcher */}
          <div className="grid grid-cols-2 sm:inline-flex items-center p-1 bg-[#121217] border border-white/[0.08] w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setMode('3d-sculpture')}
              className={`px-3 sm:px-4 py-2.5 sm:py-2 text-[12px] font-medium transition-colors whitespace-nowrap cursor-pointer text-center ${
                mode === '3d-sculpture'
                  ? 'bg-[#F4F4F6] text-[#08080A]'
                  : 'text-[#A1A1AA] hover:text-[#F4F4F6]'
              }`}
            >
              3D Sculpted Model
            </button>
            <button
              type="button"
              onClick={() => setMode('360-turntable')}
              className={`px-3 sm:px-4 py-2.5 sm:py-2 text-[12px] font-medium transition-colors whitespace-nowrap cursor-pointer text-center ${
                mode === '360-turntable'
                  ? 'bg-[#F4F4F6] text-[#08080A]'
                  : 'text-[#A1A1AA] hover:text-[#F4F4F6]'
              }`}
            >
              360° Studio Orbit
            </button>
          </div>
        </div>

        {/* Full-bleed Unobstructed 3D Viewport */}
        <div
          data-cursor="Drag 360°"
          className="relative w-full h-[460px] sm:h-[520px] md:h-[620px] bg-[#0B0B0F] border border-white/[0.08] overflow-hidden"
        >
          {/* Top-Left Minimal Spec Readout */}
          <div className="absolute top-4 left-4 right-4 sm:top-5 sm:left-5 sm:right-auto z-10 pointer-events-none max-w-md">
            <p className="text-[12px] font-medium text-[#F4F4F6] truncate sm:whitespace-normal">
              {mode === '3d-sculpture' ? selectedFinish.name : PRODUCT_DATA.gallery[activeAngleIdx].caption}
            </p>
            <p className="font-mono-tabular text-[11px] text-[#9A9AA6] mt-0.5">
              {mode === '3d-sculpture'
                ? 'Drag to orbit · Pinch or scroll to zoom'
                : 'Drag 360° or tap any studio frame'}
            </p>
          </div>

          {contextLost ? (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-[#0C0C10]">
              <NextImage
                src={PRODUCT_DATA.gallery[0].src}
                alt={PRODUCT_DATA.gallery[0].alt}
                width={256}
                height={192}
                sizes="256px"
                className="w-64 h-48 object-cover mb-4 border border-white/10"
              />
              <p className="text-sm text-[#D6C7AE]">
                3D context paused — showing studio preview.
              </p>
              <button
                type="button"
                onClick={() => setContextLost(false)}
                className="mt-3 px-4 py-2 text-xs font-medium bg-[#F4F4F6] text-[#08080A] cursor-pointer"
              >
                Restore 360° Viewport
              </button>
            </div>
          ) : (
            <Canvas
              dpr={isSoftwareGl ? 1 : [1, 2]}
              shadows={!isSoftwareGl}
              camera={{ position: [0, 0.65, 3.85], fov: 36 }}
              gl={{
                antialias: !isSoftwareGl,
                powerPreference: 'high-performance',
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: 1.15,
              }}
              onCreated={({ gl }) => {
                const canvas = gl.domElement;
                canvas.addEventListener('webglcontextlost', (e) => {
                  e.preventDefault();
                  setContextLost(true);
                });
                canvas.addEventListener('webglcontextrestored', () => {
                  setContextLost(false);
                });
              }}
            >
              <color attach="background" args={['#0B0B0F']} />
              <fog attach="fog" args={['#0B0B0F', 8, 18]} />

              {/* Warm Key + Cool Hemisphere Studio Rig */}
              <hemisphereLight args={['#dce3f2', '#17161a', 0.65]} />
              <directionalLight
                position={[3.5, 5, 4]}
                intensity={2.1}
                color="#fff6e8"
                castShadow={!isSoftwareGl}
                shadow-mapSize={[1024, 1024]}
                shadow-bias={-0.0005}
              />
              <directionalLight position={[-4, 2, -3]} intensity={1.1} color="#b8c9e6" />

              {/* Procedural Studio Reflection Environment (zero external HDR 404s) */}
              <Environment resolution={256} frames={1}>
                <Lightformer
                  form="rect"
                  intensity={3.5}
                  position={[0, 4, 2]}
                  rotation={[Math.PI / 3, 0, 0]}
                  scale={[6, 2.5, 1]}
                  color="#ffffff"
                />
                <Lightformer
                  form="rect"
                  intensity={2.2}
                  position={[-4, 1.5, 2]}
                  rotation={[0, Math.PI / 2.5, 0]}
                  scale={[4, 3, 1]}
                  color="#e6ecf7"
                />
                <Lightformer
                  form="rect"
                  intensity={2.0}
                  position={[4, 1, -2]}
                  rotation={[0, -Math.PI / 2.5, 0]}
                  scale={[4, 3, 1]}
                  color="#f2e5d0"
                />
              </Environment>

              <Suspense fallback={null}>
                {mode === '3d-sculpture' ? (
                  <group position={[0, 0.14, 0]}>
                    <SingleBaliEarring
                      finishId={selectedFinish.id}
                      explode={explode}
                      position={[-0.68, 0.06, 0.14]}
                      rotationY={0.34}
                    />
                    <SingleBaliEarring
                      finishId={selectedFinish.id}
                      explode={explode}
                      position={[0.68, 0.06, -0.14]}
                      rotationY={-0.44}
                    />
                    {/* Honed Basalt Display Plinth */}
                    <mesh position={[0, -1.04, 0]} receiveShadow>
                      <cylinderGeometry args={[1.95, 2.15, 0.24, 64]} />
                      <meshStandardMaterial color="#131318" roughness={0.78} metalness={0.18} />
                    </mesh>
                    {/* Fine metallic bezel trim on plinth */}
                    <mesh position={[0, -0.92, 0]} rotation={[Math.PI / 2, 0, 0]}>
                      <torusGeometry args={[1.95, 0.012, 12, 96]} />
                      <meshStandardMaterial color="#8f8675" metalness={0.9} roughness={0.25} />
                    </mesh>
                  </group>
                ) : (
                  <PhotographicTurntableStage
                    gallery={PRODUCT_DATA.gallery}
                    activeAngleIdx={activeAngleIdx}
                    onAngleChange={(idx) => {
                      setAutoRotate(false);
                      setActiveAngleIdx(idx);
                    }}
                    autoRotate={autoRotate}
                  />
                )}
              </Suspense>

              {!isSoftwareGl && (
                <ContactShadows
                  position={[0, -0.91, 0]}
                  opacity={0.55}
                  scale={6}
                  blur={2.2}
                  far={2.5}
                />
              )}

              <CameraRig
                preset={preset}
                mode={mode}
                autoRotate={autoRotate}
                isSoftwareGl={isSoftwareGl}
                resetSignal={resetSignal}
              />
            </Canvas>
          )}

          {/* Collapsible Unified Bottom Control Dock (Solid dark surface, zero backdrop-blur over WebGL) */}
          <div
            className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center"
            style={{ width: 'min(880px, 95%)' }}
          >
            <button
              type="button"
              onClick={() => setDockExpanded((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:py-1 text-[11px] font-medium text-[#D6C7AE] bg-[#141419] border border-b-0 border-white/[0.12] hover:text-white cursor-pointer"
            >
              {dockExpanded ? (
                <>
                  <ChevronDown className="w-3.5 h-3.5" />
                  <span>Hide Controls</span>
                </>
              ) : (
                <>
                  <ChevronUp className="w-3.5 h-3.5" />
                  <span>Show Controls</span>
                </>
              )}
            </button>

            {dockExpanded && (
              <div className="w-full bg-[#121217]/95 border border-white/[0.12] px-3 py-2.5 sm:px-4 sm:py-3 flex flex-col lg:flex-row lg:flex-wrap lg:items-center lg:justify-between gap-2.5 sm:gap-3">
                {mode === '3d-sculpture' ? (
                  <>
                    {/* Exploded Assembly Slider */}
                    <div className="flex items-center gap-3 w-full lg:w-auto lg:min-w-[190px]">
                      <Layers className="w-3.5 h-3.5 text-[#D6C7AE] shrink-0" />
                      <label
                        htmlFor="explode-range"
                        className="text-[11px] font-medium text-[#E4E4E7] whitespace-nowrap"
                      >
                        Explode
                      </label>
                      <input
                        id="explode-range"
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={explode}
                        onChange={(e) => setExplode(parseFloat(e.target.value))}
                        className="atelier-slider flex-1 lg:w-24"
                      />
                    </div>

                    {/* Finish Swatches (horizontally scrollable on narrow mobile) */}
                    <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-0.5 lg:pb-0">
                      {PRODUCT_DATA.finishes.map((f) => {
                        const active = f.id === selectedFinish.id;
                        return (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => onSelectFinish(f)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:py-1 text-[11px] border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                              active
                                ? 'border-[#D6C7AE] bg-[#1C1C23] text-[#F4F4F6]'
                                : 'border-white/[0.08] bg-transparent text-[#A1A1AA] hover:text-[#F4F4F6]'
                            }`}
                          >
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-white/25"
                              style={{ backgroundColor: f.swatchHex }}
                            />
                            <span>{f.shortLabel}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Camera Presets + Auto-Orbit (horizontally scrollable on narrow mobile) */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 lg:pb-0">
                      <Camera className="w-3.5 h-3.5 text-[#9A9AA6] mr-0.5 shrink-0" />
                      {(['hero', 'clasp', 'profile'] as CameraPreset[]).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => {
                            setPreset(p);
                            setResetSignal((s) => s + 1);
                          }}
                          className={`px-2.5 py-1.5 sm:py-1 text-[11px] capitalize border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                            preset === p
                              ? 'border-[#D6C7AE] text-[#F4F4F6] bg-[#1C1C23]'
                              : 'border-white/[0.08] text-[#A1A1AA] hover:text-[#F4F4F6]'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setAutoRotate((r) => !r)}
                        aria-pressed={autoRotate}
                        className={`inline-flex items-center gap-1 px-2.5 py-1.5 sm:py-1 text-[11px] border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          autoRotate
                            ? 'border-[#D6C7AE] text-[#D6C7AE] bg-[#1C1C23]'
                            : 'border-white/[0.08] text-[#A1A1AA]'
                        }`}
                      >
                        <RotateCw className="w-3 h-3" />
                        <span>Orbit</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-wrap items-center justify-between gap-2 w-full">
                    {/* 360 Studio Orbit Frame Selector */}
                    <div className="flex items-center gap-1.5 overflow-x-auto">
                      {PRODUCT_DATA.gallery.map((g, idx) => (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => {
                            setAutoRotate(false);
                            setActiveAngleIdx(idx);
                          }}
                          className={`px-2.5 py-1.5 sm:py-1 text-[11px] border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                            activeAngleIdx === idx
                              ? 'border-[#D6C7AE] bg-[#1C1C23] text-[#F4F4F6]'
                              : 'border-white/[0.08] text-[#A1A1AA] hover:text-[#F4F4F6]'
                          }`}
                        >
                          Angle 0{idx + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setAutoRotate((r) => !r)}
                      aria-pressed={autoRotate}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-1 text-[11px] border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        autoRotate
                          ? 'border-[#D6C7AE] text-[#D6C7AE] bg-[#1C1C23]'
                          : 'border-white/[0.08] text-[#A1A1AA]'
                      }`}
                    >
                      <RotateCw className="w-3 h-3" />
                      <span>{autoRotate ? 'Pause 360° Spin' : 'Auto 360° Spin'}</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
