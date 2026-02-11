console.clear();

/* =======================
   SCENE SETUP
======================= */
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  5000
);
camera.position.z = 500;

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.style.position = "fixed";
renderer.domElement.style.top = "0";
renderer.domElement.style.left = "0";
renderer.domElement.style.zIndex = "0";
renderer.domElement.style.transition = "1s";
document.body.appendChild(renderer.domElement);

/* =======================
   CONTROLS
======================= */
const controlsWebGL = new THREE.OrbitControls(camera, renderer.domElement);

/* =======================
   PARTICLE HEART
======================= */
const tl = gsap.timeline({
  repeat: 1,           // ek baar beat karega
  yoyo: true,
  onComplete: showFirstPage
});

const path = document.querySelector("path");
const length = path.getTotalLength();

const vertices = [];

for (let i = 0; i < length; i += 0.1) {

  const point = path.getPointAtLength(i);
  const vector = new THREE.Vector3(point.x, -point.y, 0);

  vector.x += (Math.random() - 0.5) * 30;
  vector.y += (Math.random() - 0.5) * 30;
  vector.z += (Math.random() - 0.5) * 70;

  vertices.push(vector);

  tl.from(
    vector,
    {
      x: 600 / 2,
      y: -552 / 2,
      z: 0,
      ease: "power2.inOut",
      duration: "random(2,4)"
    },
    i * 0.002
  );
}

const geometry = new THREE.BufferGeometry().setFromPoints(vertices);

const material = new THREE.PointsMaterial({
  color: 0xee5282,
  blending: THREE.AdditiveBlending,
  size: 3
});

const particles = new THREE.Points(geometry, material);

particles.position.x -= 600 / 2;
particles.position.y += 552 / 2;

scene.add(particles);

/* =======================
   ROTATION ANIMATION
======================= */
gsap.fromTo(
  scene.rotation,
  { y: -0.2 },
  {
    y: 0.2,
    repeat: 1,
    yoyo: true,
    ease: "power2.inOut",
    duration: 3
  }
);

/* =======================
   RENDER LOOP
======================= */
function render() {
  requestAnimationFrame(render);
  geometry.setFromPoints(vertices);
  renderer.render(scene, camera);
}
render();

/* =======================
   RESIZE
======================= */
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onWindowResize);

/* =======================
   SHOW FIRST PAGE
======================= */
function showFirstPage() {

  // Canvas fade out
  renderer.domElement.style.opacity = "0";

  setTimeout(() => {

    renderer.domElement.style.display = "none";

    // Directly activate first page
    document.querySelectorAll('.page').forEach(p => {
      p.classList.remove('active');
    });

    const page1 = document.getElementById("page1");
    if (page1) {
      page1.classList.add("active");
    }

  }, 1000);
}
