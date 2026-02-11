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
   PARTICLE HEART (OPTIMIZED)
======================= */
const tl = gsap.timeline({
  repeat: 0,           // No extra repeat → faster
  yoyo: true,
  onComplete: showFirstPage
});

const path = document.querySelector("path");
const length = path.getTotalLength();
const vertices = [];

// Reduce number of points & delays for faster animation
for (let i = 0; i < length; i += 0.5) {  // bigger step → fewer particles

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
      duration: "random(1,2)" // shorter duration → faster
    },
    i * 0.001 // smaller delay → faster overall
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
    repeat: 0, // single smooth rotation
    yoyo: true,
    ease: "power2.inOut",
    duration: 2
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
  renderer.domElement.style.opacity = "0";

  setTimeout(() => {
    renderer.domElement.style.display = "none";
    goToPage("page1");  // show first page immediately
  }, 500); // fade out fast
}

/* =======================
   PAGE SWITCH FUNCTION
======================= */
function goToPage(id) {
  // Stop all videos
  const videos = document.querySelectorAll("video");
  videos.forEach(v => {
    v.pause();
    v.currentTime = 0;
  });

  // Hide all pages
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
  });

  // Show requested page
  const activePage = document.getElementById(id);
  if (activePage) {
    activePage.classList.add('active');
  }

  // Auto-play videos if required
  if (id === "videos") startFeelVideos();
  if (id === "story") startStoryVideo();
  if (id === "final") startFinalVideo();
}

/* =======================
   VIDEO HELPERS
======================= */
function stopAllVideos() {
  const videos = document.querySelectorAll("video");
  videos.forEach(video => {
    video.pause();
    video.currentTime = 0;
  });
}

function startFeelVideos() {
  stopAllVideos();
  const feelVideos = document.querySelectorAll(".feelVideo");
  if (feelVideos.length > 0) {
    feelVideos[0].play().catch(()=>{});
  }
}

function startStoryVideo() {
  stopAllVideos();
  const storyVideo = document.getElementById("storyVideo");
  if (storyVideo) storyVideo.play().catch(()=>{});
}

function startFinalVideo() {
  stopAllVideos();
  const finalVideo = document.getElementById("finalVideo");
  if (finalVideo) finalVideo.play().catch(()=>{});
}

/* =======================
   YES/NO BUTTON EFFECT
======================= */
let taps = 0;
function growYes() {
    taps++;
    let yes = document.getElementById("yesBtn");
    yes.style.transform = `scale(${1 + taps * 0.5})`;

    if (taps >= 4) {
        yes.style.position = "absolute";
        yes.style.left = "50%";
        yes.style.top = "60%";
        yes.style.transform = "translate(-50%, -50%) scale(4)";
        document.getElementById("noBtn").style.display = "none";
    }
}
