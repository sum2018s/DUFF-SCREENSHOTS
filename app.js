"use strict";

// Structure: 3d.html. Appearance: css/styles.css. Scene logic: this file.
const canvas = document.getElementById("renderCanvas");
const statusText = document.getElementById("scene-status");
const resetButton = document.getElementById("reset-view");
let engine;

function createScene() {
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color4(0.08, 0.14, 0.17, 1);

  const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas, true);
  camera.speed = 0.25;

  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.9;
  const keyLight = new BABYLON.DirectionalLight("keyLight", new BABYLON.Vector3(-0.4, -1, 0.6), scene);
  keyLight.intensity = 1.1;
  const fill = new BABYLON.PointLight("fill", new BABYLON.Vector3(3, 4, -3), scene);
  fill.intensity = 12;

  const groundMat = new BABYLON.StandardMaterial("groundMat", scene);
  groundMat.diffuseColor = new BABYLON.Color3(0.12, 0.16, 0.18);
  groundMat.specularColor = new BABYLON.Color3(0.08, 0.08, 0.08);

  // Theme customization: replace the template sphere with a DUFF-themed soda can.
  const canBody = BABYLON.MeshBuilder.CreateCylinder("duffCan", {
    height: 3.8,
    diameter: 2.2,
    tessellation: 64
  }, scene);
  canBody.position.y = 1.9;

  const canMat = new BABYLON.StandardMaterial("duffCanMat", scene);
  canMat.diffuseColor = new BABYLON.Color3(0.86, 0.03, 0.05);
  canMat.specularColor = new BABYLON.Color3(0.9, 0.75, 0.55);
  canMat.roughness = 0.25;
  canBody.material = canMat;

  const top = BABYLON.MeshBuilder.CreateCylinder("canTop", {
    height: 0.12,
    diameter: 2.22,
    tessellation: 64
  }, scene);
  top.position.y = 3.84;
  const metalMat = new BABYLON.StandardMaterial("metalMat", scene);
  metalMat.diffuseColor = new BABYLON.Color3(0.65, 0.67, 0.7);
  metalMat.specularColor = new BABYLON.Color3(1, 1, 1);
  top.material = metalMat;

  const bottom = BABYLON.MeshBuilder.CreateCylinder("canBottom", {
    height: 0.12,
    diameter: 2.22,
    tessellation: 64
  }, scene);
  bottom.position.y = 0;
  bottom.material = metalMat;

  const label = BABYLON.MeshBuilder.CreateCylinder("duffLabel", {
    height: 1.45,
    diameter: 2.24,
    tessellation: 64
  }, scene);
  label.position.y = 2.05;
  const labelMat = new BABYLON.StandardMaterial("labelMat", scene);
  labelMat.diffuseColor = new BABYLON.Color3(1, 0.84, 0.08);
  labelMat.specularColor = new BABYLON.Color3(0.8, 0.55, 0.1);
  label.material = labelMat;

  // White front badge makes the DUFF theme immediately visible.
  const badge = BABYLON.MeshBuilder.CreatePlane("duffBadge", {
    width: 1.65,
    height: 0.7
  }, scene);
  badge.position = new BABYLON.Vector3(0, 2.15, -1.14);
  badge.rotation.y = Math.PI;
  const badgeTexture = new BABYLON.DynamicTexture("duffBadgeTexture", {
    width: 512,
    height: 220
  }, scene, true);
  const badgeContext = badgeTexture.getContext();
  badgeContext.fillStyle = "#ffffff";
  badgeContext.fillRect(0, 0, 512, 220);
  badgeContext.strokeStyle = "#111111";
  badgeContext.lineWidth = 14;
  badgeContext.strokeRect(7, 7, 498, 206);
  badgeContext.fillStyle = "#111111";
  badgeContext.font = "900 118px Arial";
  badgeContext.textAlign = "center";
  badgeContext.textBaseline = "middle";
  badgeContext.fillText("DUFF", 256, 115);
  badgeTexture.update();

  const badgeMat = new BABYLON.StandardMaterial("badgeMat", scene);
  badgeMat.diffuseTexture = badgeTexture;
  badgeMat.emissiveColor = new BABYLON.Color3(0.08, 0.08, 0.08);
  badge.material = badgeMat;

  const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 10, height: 10, subdivisions: 2 }, scene);
  ground.material = groundMat;

  const ring = BABYLON.MeshBuilder.CreateTorus("ring", { diameter: 3.6, thickness: 0.08, tessellation: 64 }, scene);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.04;
  const ringMat = new BABYLON.StandardMaterial("ringMat", scene);
  ringMat.emissiveColor = new BABYLON.Color3(1, 0.72, 0.08);
  ring.material = ringMat;

  // Optional extension: add a differently named object and give it its own position.
  // Keep one scene creation, one render loop, and one resize listener.

  // Supplied camera recovery. A new custom button is not required for Week 4.
  resetButton.addEventListener("click", () => {
    camera.position.set(0, 5, -10);
    camera.setTarget(BABYLON.Vector3.Zero());
    statusText.textContent = "Camera reset to the starting view.";
  });
  return scene;
}

try {
  if (!window.BABYLON || !BABYLON.Engine.isSupported()) {
    throw new Error("The Babylon.js engine or WebGL is unavailable.");
  }
  engine = new BABYLON.Engine(canvas, true);
  const scene = createScene();
  engine.runRenderLoop(() => scene.render());
  window.addEventListener("resize", () => engine.resize());
  resetButton.disabled = false;

  // INTRO PRACTICE: replace these messages with your own accurate context.
  console.log("Week 5: DUFF-themed can and ground scene loaded.");
  statusText.textContent = "Scene ready: a DUFF-themed can on a ground plane.";
} catch (error) {
  if (engine) engine.dispose();
  canvas.hidden = true;
  statusText.textContent = "The 3D view could not start. Keep the whole week4 folder together, reload, and check the browser console. If this device cannot run WebGL, ask your instructor for the supported lab route.";
  console.error("Scene startup:", error);
}
