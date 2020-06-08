// import THREE from 'https://xrpackage.org/xrpackage/three.module.js';
// import {XRPackageEngine, XRPackage} from 'https://xrpackage.org/xrpackage.js';
import THREE from 'http://127.0.0.1:3000/xrpackage/three.module.js';
import {XRPackageEngine, XRPackage} from 'http://127.0.0.1:3000/xrpackage.js';

const localVector = new THREE.Vector3();
const localVector2 = new THREE.Vector3();
const localQuaternion = new THREE.Quaternion();
const localMatrix = new THREE.Matrix4();

(async () => {
  const pe = new XRPackageEngine({
    orbitControls: true,
  });
  document.body.appendChild(pe.domElement);
  pe.domElement.style.backgroundColor = '#000';
  
  pe.camera.position.set(0, 1, 2);
  pe.camera.updateMatrixWorld();
  pe.setCamera(pe.camera);
  
  pe.orbitControls.target.set(0, 1, 0);

  {
    const res = await fetch('./doggo/a.wbn');
    const ab = await res.arrayBuffer();
    const uint8Array = new Uint8Array(ab);
    const p = new XRPackage(uint8Array);
    p.setMatrix(localMatrix.compose(localVector.set(0, 0, 0), localQuaternion.set(0, 0, 0, 1), localVector2.set(1, 1, 1)));
    pe.add(p);
  }
  {
    const res = await fetch('./tree/a.wbn');
    const ab = await res.arrayBuffer();
    const uint8Array = new Uint8Array(ab);
    const p = new XRPackage(uint8Array);
    p.setMatrix(localMatrix.compose(localVector.set(0, -30, -31), localQuaternion.set(0, 0, 0, 1), localVector2.set(1, 1, 1)));
    pe.add(p);
  }

  /* const renderer = new THREE.WebGLRenderer({
    canvas: pe.domElement,
    context: pe.getContext('webgl'),
    // antialias: true,
    // alpha: true,
    // preserveDrawingBuffer: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.autoClear = false;
  renderer.sortObjects = false;
  renderer.physicallyCorrectLights = true;
  renderer.xr.enabled = true;
  // document.body.appendChild(renderer.domElement);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0.5, 1);

  function animate(timestamp, frame) {
    renderer.render(scene, camera);
  }
  renderer.setAnimationLoop(animate); */

  let currentSession = null;
  function onSessionStarted(session) {
    session.addEventListener('end', onSessionEnded);
    
    currentSession = session;

    pe.setSession(session);
  }
  function onSessionEnded() {
    currentSession.removeEventListener('end', onSessionEnded);

    currentSession = null;

    pe.setSession(null);
  }
  document.getElementById('enter-xr-button').addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    
    if (currentSession === null) {
      navigator.xr.requestSession('immersive-vr', {
        optionalFeatures: [
          'local-floor',
          'bounded-floor',
        ],
      }).then(onSessionStarted);
    } else {
      currentSession.end();
    }
  });

})();