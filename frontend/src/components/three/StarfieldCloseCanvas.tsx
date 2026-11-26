"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader.js";
import { CopyShader } from "three/examples/jsm/shaders/CopyShader.js";

interface StarfieldThemePalette {
  bgColor: string;
  flameColor: string;
  flameColor2: string;
  colorA: string;
  colorB: string;
  colorC: string;
}

const THEME_PALETTES: Record<string, StarfieldThemePalette> = {
  green: {
    bgColor: "#061b12",
    flameColor: "#aee9ff",
    flameColor2: "#5fe6a0",
    colorA: "#aef6cf",
    colorB: "#5fe6a0",
    colorC: "#eafff2",
  },
  red: {
    bgColor: "#1f070c",
    flameColor: "#ffd166",
    flameColor2: "#ff4d6d",
    colorA: "#ffb3c1",
    colorB: "#ff4d6d",
    colorC: "#fff0f3",
  },
  marigold: {
    bgColor: "#1f1204",
    flameColor: "#ffd166",
    flameColor2: "#ff6b35",
    colorA: "#ffe08a",
    colorB: "#ff9f1c",
    colorC: "#fff8e7",
  },
  blush: {
    bgColor: "#1e0914",
    flameColor: "#ffd6ec",
    flameColor2: "#c79bff",
    colorA: "#ffc2e2",
    colorB: "#ff69b4",
    colorC: "#fff0f7",
  },
  pearl: {
    bgColor: "#0e1222",
    flameColor: "#aee9ff",
    flameColor2: "#f5e6c8",
    colorA: "#f5e6c8",
    colorB: "#d4af37",
    colorC: "#ffffff",
  },
  festival: {
    bgColor: "#140826",
    flameColor: "#aee9ff",
    flameColor2: "#ff70a6",
    colorA: "#e0b3ff",
    colorB: "#9d4edd",
    colorC: "#fff0ff",
  },
};

const CONFIG = {
  flameAmt: 0.22,
  opacity: 2,
  pointSize: 50,
  brightness: 1.85,
  drift: 2.35,
  twinkle: 1,
  spin: 0.03,
  repelRadius: 5,
  repelStrength: 0.35,
  scrollPush: 8,
  scrollDrift: 6,
  scrollSpin: 0.1,
  parallax: 0.6,
};

const LAYERS = {
  NONE: 0,
  TORUS_SCENE: 1,
  BLOOM_SCENE: 2,
  ENTIRE_SCENE: 3,
};

function hexToVec3(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return new THREE.Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}

function getActiveThemeName(): string {
  if (typeof document === "undefined") return "green";
  const attr = document.documentElement.getAttribute("data-theme") || "";
  return THEME_PALETTES[attr] ? attr : "green";
}

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function StarfieldCloseCanvas({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const getSize = () => {
      const parent = canvas.parentElement;
      return {
        w: parent ? parent.clientWidth || window.innerWidth : window.innerWidth,
        h: parent ? parent.clientHeight || window.innerHeight : window.innerHeight,
      };
    };

    const { w: initW, h: initH } = getSize();
    const initialPalette = THEME_PALETTES[getActiveThemeName()];

    let renderer: THREE.WebGL1Renderer;
    try {
      renderer = new THREE.WebGL1Renderer({ canvas, antialias: true, powerPreference: "high-performance" });
    } catch {
      return;
    }

    const getDpr = () => Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(getDpr());
    renderer.setSize(initW, initH, false);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.VSMShadowMap;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x000000, 0, 15);

    const camera = new THREE.PerspectiveCamera(45, initW / Math.max(1, initH), 0.1, 80);
    camera.position.set(0, 0, 5);
    camera.layers.enable(LAYERS.TORUS_SCENE);
    camera.layers.enable(LAYERS.BLOOM_SCENE);
    camera.layers.enable(LAYERS.ENTIRE_SCENE);
    scene.add(camera);

    const renderScene = new RenderPass(scene, camera);

    const torusComposer = new EffectComposer(renderer);
    torusComposer.renderToScreen = false;
    torusComposer.addPass(renderScene);
    torusComposer.addPass(new ShaderPass(GammaCorrectionShader));
    torusComposer.addPass(new UnrealBloomPass(new THREE.Vector2(initW, initH), 0.22, 0.2, 0));
    torusComposer.addPass(new ShaderPass(CopyShader));

    const bloomComposer = new EffectComposer(renderer);
    bloomComposer.renderToScreen = false;
    bloomComposer.addPass(renderScene);
    bloomComposer.addPass(new UnrealBloomPass(new THREE.Vector2(initW, initH), 0.4, 0.55, 0));
    bloomComposer.addPass(new ShaderPass(GammaCorrectionShader));

    const FinalShader = {
      uniforms: {
        iTime: { value: 0 },
        tDiffuse: { value: null },
        torusTexture: { value: null as THREE.Texture | null },
        bloomTexture: { value: null as THREE.Texture | null },
        haloTexture: { value: null },
        uBg: { value: hexToVec3(initialPalette.bgColor) },
        uFlameA: { value: hexToVec3(initialPalette.flameColor) },
        uFlameB: { value: hexToVec3(initialPalette.flameColor2) },
        uFlameAmt: { value: CONFIG.flameAmt },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position, 1.0); }
      `,
      fragmentShader: /* glsl */ `
        uniform float iTime; uniform sampler2D tDiffuse; uniform sampler2D bloomTexture; uniform sampler2D torusTexture; uniform sampler2D haloTexture;
        uniform vec3 uBg; uniform vec3 uFlameA; uniform vec3 uFlameB; uniform float uFlameAmt;
        varying vec2 vUv;
        vec3 warp3d(vec3 pos, float t){ float curv=.8,a=1.9,b=0.7; pos*=2.;
          pos.x+=curv*sin(t+a*pos.y)+t*b; pos.y+=curv*cos(t+a*pos.x);
          pos.y+=curv*sin(t+a*pos.z)+t*b; pos.z+=curv*cos(t+a*pos.y);
          pos.z+=curv*sin(t+a*pos.x)+t*b; pos.x+=curv*cos(t+a*pos.z);
          return 0.5+0.5*cos(pos.xyz+vec3(1,2,4)); }
        void main(){
          vec2 uv = 2.*vUv - 1.;
          vec3 w = pow(warp3d(vec3(uv.x, sin(uv.y), uv.y), iTime*1.5), vec3(1.5));
          vec3 flame = 1.5*uFlameA*w.x; flame*=w.y; flame += uFlameB*w.z;
          flame *= smoothstep(0.25, 1., abs(uv.y));
          float md = smoothstep(-0.7, 1., -uv.y*uv.x); flame *= md*md;
          vec3 bg = uBg * (1.0 - 0.4 * length(uv));
          vec3 halo = texture2D(haloTexture, vUv).xyz;
          gl_FragColor = vec4(bg + flame*uFlameAmt + texture2D(bloomTexture, vUv).xyz + texture2D(torusTexture, vUv).xyz + texture2D(tDiffuse, vUv).xyz + halo, 1.);
        }
      `,
    };

    const finalPass = new ShaderPass(FinalShader);
    finalPass.uniforms.bloomTexture.value = bloomComposer.renderTarget1.texture;
    finalPass.uniforms.torusTexture.value = torusComposer.renderTarget1.texture;

    const finalComposer = new EffectComposer(renderer);
    finalComposer.addPass(renderScene);
    finalComposer.addPass(finalPass);

    // Geometry
    const count = 4200;
    const depth = 30;
    const positions = new Float32Array(count * 3);
    const palette = new Float32Array(count);
    const bright = new Float32Array(count);
    const scales = new Float32Array(count);
    const phases = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 24;
      positions[i3 + 1] = (Math.random() - 0.5) * 16;
      positions[i3 + 2] = (Math.random() - 0.5) * 30;
      palette[i] = Math.floor(Math.random() * 3);
      bright[i] = 0.7 + Math.random() * 0.6;
      scales[i] = 0.5 + Math.pow(Math.random(), 1.4) * 2.5;
      phases[i] = Math.random();
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("aScale", new THREE.Float32BufferAttribute(scales, 1));
    geometry.setAttribute("aPhase", new THREE.Float32BufferAttribute(phases, 1));
    geometry.setAttribute("aPalette", new THREE.Float32BufferAttribute(palette, 1));
    geometry.setAttribute("aBright", new THREE.Float32BufferAttribute(bright, 1));

    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: CONFIG.pointSize },
        uOpacity: { value: 0 },
        uDrift: { value: 0 },
        uDepth: { value: depth },
        uTwinkle: { value: CONFIG.twinkle },
        uCursor: { value: new THREE.Vector3() },
        uRepelRadius: { value: CONFIG.repelRadius },
        uRepelStrength: { value: CONFIG.repelStrength },
        uActivity: { value: 0 },
        uColorA: { value: hexToVec3(initialPalette.colorA) },
        uColorB: { value: hexToVec3(initialPalette.colorB) },
        uColorC: { value: hexToVec3(initialPalette.colorC) },
        uBrightness: { value: CONFIG.brightness },
      },
      vertexShader: /* glsl */ `
        uniform float uTime; uniform float uSize; uniform float uDrift; uniform float uDepth; uniform float uTwinkle;
        uniform vec3 uCursor; uniform float uRepelRadius; uniform float uRepelStrength; uniform float uActivity;
        uniform vec3 uColorA; uniform vec3 uColorB; uniform vec3 uColorC;
        attribute float aScale; attribute float aPhase; attribute float aPalette; attribute float aBright;
        varying vec3 vColor; varying float vTwinkle;
        void main() {
          vec3 pos = position;
          pos.z = mod(pos.z + uDrift + (uDepth * 0.5), uDepth) - (uDepth * 0.5);

          float tw = sin(uTime * 1.6 + aPhase * 6.2831);
          vTwinkle = (1.0 - uTwinkle) + uTwinkle * (0.55 + 0.45 * tw);

          vec4 modelPosition = modelMatrix * vec4(pos, 1.0);

          vec3 toParticle = modelPosition.xyz - uCursor;
          float dist = length(toParticle);
          float falloff = smoothstep(uRepelRadius, 0.0, dist);
          modelPosition.xyz += normalize(toParticle + vec3(0.0001)) * falloff * uRepelStrength * uActivity;

          vec4 viewPosition = viewMatrix * modelPosition;
          gl_Position = projectionMatrix * viewPosition;
          gl_PointSize = uSize * aScale;
          gl_PointSize *= (1.0 / -viewPosition.z);

          vec3 base = aPalette < 0.5 ? uColorA : (aPalette < 1.5 ? uColorB : uColorC);
          vColor = base * aBright;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uOpacity; uniform float uBrightness;
        varying vec3 vColor; varying float vTwinkle;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          if (d > 0.5) discard;
          float strength = pow(1.0 - d * 2.0, 4.0);
          vec3 color = mix(vec3(0.0), vColor, strength);
          gl_FragColor = vec4(color * uBrightness, strength * uOpacity * vTwinkle);
        }
      `,
    });

    const points = new THREE.Points(geometry, material);
    points.layers.enable(LAYERS.ENTIRE_SCENE);

    const group = new THREE.Group();
    group.add(points);
    scene.add(group);

    // Theme synchronization target vectors for smooth colour transitions
    const targetColors = {
      bg: hexToVec3(initialPalette.bgColor),
      flameA: hexToVec3(initialPalette.flameColor),
      flameB: hexToVec3(initialPalette.flameColor2),
      colorA: hexToVec3(initialPalette.colorA),
      colorB: hexToVec3(initialPalette.colorB),
      colorC: hexToVec3(initialPalette.colorC),
    };

    const syncThemeColors = () => {
      const pal = THEME_PALETTES[getActiveThemeName()];
      targetColors.bg.copy(hexToVec3(pal.bgColor));
      targetColors.flameA.copy(hexToVec3(pal.flameColor));
      targetColors.flameB.copy(hexToVec3(pal.flameColor2));
      targetColors.colorA.copy(hexToVec3(pal.colorA));
      targetColors.colorB.copy(hexToVec3(pal.colorB));
      targetColors.colorC.copy(hexToVec3(pal.colorC));
    };

    window.addEventListener("brand-theme-changed", syncThemeColors);
    const themeObserver = new MutationObserver(syncThemeColors);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const POINTER = {
      ndc: new THREE.Vector2(0, 0),
      world: new THREE.Vector3(0, 0, 0),
      active: false,
      lastMove: 0,
      activity: 0,
    };

    const _unproj = new THREE.Vector3();
    const _dir = new THREE.Vector3();
    const _target = new THREE.Vector3();

    const updateNDC = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      POINTER.ndc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      POINTER.ndc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      POINTER.active = true;
      POINTER.lastMove = performance.now();
    };

    const onMouseMove = (e: MouseEvent) => updateNDC(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) updateNDC(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onMouseOut = () => {
      POINTER.active = false;
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchstart", onTouchMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onMouseOut, { passive: true });
    window.addEventListener("mouseout", onMouseOut);

    function updatePointer(now: number) {
      if (POINTER.active) {
        _unproj.set(POINTER.ndc.x, POINTER.ndc.y, 0.5).unproject(camera);
        _dir.copy(_unproj).sub(camera.position).normalize();
        const tHit = Math.abs(_dir.z) > 1e-4 ? -camera.position.z / _dir.z : NaN;
        if (Number.isFinite(tHit) && tHit > 0) {
          _target.copy(camera.position).addScaledVector(_dir, tHit);
        } else {
          _target.set(0, 0, 0);
        }
      } else {
        _target.set(0, 0, 0);
      }

      POINTER.world.lerp(_target, 0.12);

      const idleSeconds = (now - POINTER.lastMove) / 1000;
      const want = POINTER.active && idleSeconds < 3 ? 1 : 0;
      POINTER.activity += (want - POINTER.activity) * 0.06;

      material.uniforms.uCursor.value.copy(POINTER.world);
      material.uniforms.uActivity.value = POINTER.activity;
    }

    let scrollTarget = 0;
    let scrollSmooth = 0;
    let scrollCurrent = 0;
    const mouseSmooth = { x: 0, y: 0 };

    const computeScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollTarget = clamp(window.scrollY / maxScroll, 0, 1);
    };

    window.addEventListener("scroll", computeScroll, { passive: true });
    computeScroll();

    const handleResize = () => {
      const { w, h } = getSize();
      const dpr = getDpr();
      renderer.setPixelRatio(dpr);
      renderer.setSize(w, h, false);

      camera.aspect = w / Math.max(1, h);
      camera.updateProjectionMatrix();

      torusComposer.setPixelRatio(dpr);
      torusComposer.setSize(w, h);
      bloomComposer.setPixelRatio(dpr);
      bloomComposer.setSize(w, h);
      finalComposer.setPixelRatio(dpr);
      finalComposer.setSize(w, h);

      computeScroll();
    };

    window.addEventListener("resize", handleResize);

    const appearStart = performance.now();
    let t0 = appearStart / 1000;
    let rafId = 0;
    let isPaused = document.hidden;

    const animate = () => {
      if (isPaused) return;
      rafId = requestAnimationFrame(animate);

      const now = performance.now();
      const t = now / 1000;
      const dt = Math.min(0.05, t - t0);
      t0 = t;

      // Smoothly transition starfield & cosmic background colours on theme change
      finalPass.uniforms.uBg.value.lerp(targetColors.bg, 0.08);
      finalPass.uniforms.uFlameA.value.lerp(targetColors.flameA, 0.08);
      finalPass.uniforms.uFlameB.value.lerp(targetColors.flameB, 0.08);
      material.uniforms.uColorA.value.lerp(targetColors.colorA, 0.08);
      material.uniforms.uColorB.value.lerp(targetColors.colorB, 0.08);
      material.uniforms.uColorC.value.lerp(targetColors.colorC, 0.08);

      scrollSmooth = lerp(scrollSmooth, scrollTarget, 0.1);
      scrollCurrent = lerp(scrollCurrent, scrollSmooth, 0.06);

      mouseSmooth.x = lerp(mouseSmooth.x, POINTER.active ? POINTER.ndc.x : 0, 0.06);
      mouseSmooth.y = lerp(mouseSmooth.y, POINTER.active ? POINTER.ndc.y : 0, 0.06);

      updatePointer(now);

      const scroll = scrollCurrent;
      const m = mouseSmooth;

      material.uniforms.uTime.value = t;
      material.uniforms.uDrift.value += dt * (CONFIG.drift + scroll * CONFIG.scrollDrift);

      camera.position.set(m.x * CONFIG.parallax, m.y * CONFIG.parallax, 5 - scroll * CONFIG.scrollPush);
      camera.lookAt(m.x * CONFIG.parallax, m.y * CONFIG.parallax, -10);

      const elapsed = now - appearStart;
      const fade = clamp((elapsed - 300) / 1400, 0, 1);
      material.uniforms.uOpacity.value = fade * CONFIG.opacity;

      group.rotation.z += dt * (CONFIG.spin + scroll * CONFIG.scrollSpin);

      finalPass.uniforms.iTime.value = t;

      camera.layers.set(LAYERS.TORUS_SCENE);
      torusComposer.render();

      camera.layers.set(LAYERS.BLOOM_SCENE);
      bloomComposer.render();

      camera.layers.set(LAYERS.ENTIRE_SCENE);
      finalComposer.render();
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        isPaused = true;
        cancelAnimationFrame(rafId);
      } else {
        isPaused = false;
        t0 = performance.now() / 1000;
        animate();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    if (!isPaused) {
      animate();
    }

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("brand-theme-changed", syncThemeColors);
      themeObserver.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchstart", onTouchMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onMouseOut);
      window.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("scroll", computeScroll);
      window.removeEventListener("resize", handleResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none block w-full h-full ${className}`}
    />
  );
}
