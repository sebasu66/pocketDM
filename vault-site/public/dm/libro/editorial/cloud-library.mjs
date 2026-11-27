// Firebase Authentication and the private, shared editorial library.
let service;
export async function connectLibrary(onCatalog) {
  const [appSdk, authSdk, dbSdk] = await Promise.all([
    import('https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js'),
    import('https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js'),
  ]);
  const response = await fetch('/__/firebase/init.json');
  if (!response.ok) throw new Error('Configuración de Firebase no disponible');
  const config = await response.json();
  const app =
    appSdk.getApps().find((x) => x.name === 'editorial') || appSdk.initializeApp(config, 'editorial');
  const auth = authSdk.getAuth(app);
  const db = dbSdk.getFirestore(app);
  await auth.authStateReady();
  const result =
    auth.currentUser || (await authSdk.signInWithPopup(auth, new authSdk.GoogleAuthProvider())).user;
  const membership = await dbSdk.getDoc(dbSdk.doc(db, 'editorial_members', result.uid));
  if (!membership.exists() || membership.data().role !== 'owner') {
    await authSdk.signOut(auth);
    throw new Error('La cuenta no está autorizada para editar diseños');
  }
  const layouts = dbSdk.collection(db, 'editorial_layouts');
  const stop = dbSdk.onSnapshot(
    layouts,
    (snapshot) => {
      onCatalog(snapshot.docs.map((record) => ({ id: record.id, ...record.data() })));
    },
    (error) => onCatalog(null, error),
  );
  service = {
    async save(id, value, expected) {
      const reference = dbSdk.doc(layouts, id);
      return dbSdk.runTransaction(db, async (transaction) => {
        const current = await transaction.get(reference);
        const revision = current.exists() ? current.data().revision : 0;
        if (revision !== expected)
          throw new Error(
            'El diseño cambió en otro dispositivo. Abrí la versión de la bóveda antes de continuar.',
          );
        const next = revision + 1;
        transaction.set(reference, { ...value, revision: next, updatedAt: dbSdk.serverTimestamp() });
        return next;
      });
    },
    async disconnect() {
      stop();
      await authSdk.signOut(auth);
      service = null;
    },
  };
  return service;
}
