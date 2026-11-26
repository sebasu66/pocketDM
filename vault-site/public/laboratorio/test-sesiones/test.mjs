import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js';
import {
  getAuth,
  signInAnonymously,
  connectAuthEmulator,
} from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js';
import {
  getFirestore,
  connectFirestoreEmulator,
  doc,
  collection,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  arrayUnion,
  serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js';

const get = (id) => document.getElementById(id);
const status = get('status');
const error = get('error');
if (
  !location.hostname.includes('--') &&
  location.hostname !== 'localhost' &&
  location.hostname !== '127.0.0.1'
) {
  get('start').hidden = true;
  error.textContent = 'Las salas de prueba están disponibles en la vista previa del proyecto.';
} else {
  try {
    const response = await fetch('/__/firebase/init.json');
    if (!response.ok) throw new Error('La configuración no está disponible');
    const app = initializeApp(await response.json(), 'pocketdm-test');
    const auth = getAuth(app);
    const db = getFirestore(app);
    if (location.hostname === 'localhost' && new URLSearchParams(location.search).get('emulator') === '1') {
      connectAuthEmulator(auth, 'http://127.0.0.1:19099', { disableWarnings: true });
      connectFirestoreEmulator(db, '127.0.0.1', 18080);
    }
    await auth.authStateReady();
    const user = auth.currentUser || (await signInAnonymously(auth)).user;
    async function enter(reference, asHost) {
      const snapshot = await getDoc(reference);
      if (!snapshot.exists()) throw new Error('La sala no existe o ya no está disponible');
      const data = snapshot.data();
      if (!asHost && !data.players.includes(user.uid)) {
        await updateDoc(reference, { players: arrayUnion(user.uid) });
      }
      get('start').hidden = true;
      get('room').hidden = false;
      get('role').textContent = asHost ? 'Anfitrión' : 'Jugador de prueba';
      if (asHost) {
        const link = new URL(location.href);
        link.hash = reference.id;
        get('link').value = link.href;
        get('invite').hidden = false;
      }
      onSnapshot(
        reference,
        (current) => {
          if (!current.exists()) {
            status.textContent = 'La sala ya no está disponible.';
            return;
          }
          const players = current.data().players;
          status.textContent = 'Anfitrión conectado · ' + players.length + ' de 4 jugadores';
          get('players').replaceChildren(
            ...players.map((uid, index) => {
              const item = document.createElement('li');
              item.textContent = 'Jugador ' + (index + 1) + (uid === user.uid ? ' · vos' : '');
              return item;
            }),
          );
        },
        () => {
          status.textContent = 'Se perdió la conexión con la sala.';
        },
      );
    }
    get('host').onclick = async () => {
      get('host').disabled = true;
      try {
        const reference = doc(collection(db, 'test_rooms'));
        await setDoc(reference, { host: user.uid, players: [], createdAt: serverTimestamp() });
        location.hash = reference.id;
        await enter(reference, true);
      } catch (e) {
        error.textContent = 'No se pudo crear la sala: ' + e.message;
        get('host').disabled = false;
      }
    };
    get('copy').onclick = async () => {
      try {
        await navigator.clipboard.writeText(get('link').value);
        status.textContent = 'Enlace copiado.';
      } catch {
        get('link').select();
      }
    };
    const roomId = decodeURIComponent(location.hash.slice(1));
    if (roomId && /^[A-Za-z0-9]{20}$/.test(roomId)) {
      const reference = doc(db, 'test_rooms', roomId);
      const snapshot = await getDoc(reference);
      if (!snapshot.exists()) throw new Error('La sala no existe');
      await enter(reference, snapshot.data().host === user.uid);
    }
  } catch (e) {
    error.textContent = 'No se pudo conectar la sala de prueba: ' + e.message;
  }
}
