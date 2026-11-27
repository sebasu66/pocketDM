const { initializeTestEnvironment, assertFails, assertSucceeds } = require('@firebase/rules-unit-testing');
const {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  getDocs,
  collection,
  serverTimestamp,
  arrayUnion,
} = require('firebase/firestore');
const fs = require('fs');
(async () => {
  const env = await initializeTestEnvironment({
    projectId: 'demo-pocket-editorial',
    firestore: { rules: fs.readFileSync('firestore.rules', 'utf8') },
  });
  try {
    await env.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), 'editorial_members', 'editor'), { role: 'owner' });
    });
    const owner = env
      .authenticatedContext('editor', { firebase: { sign_in_provider: 'google.com' }, email_verified: true })
      .firestore();
    const fake = env
      .authenticatedContext('editor', { firebase: { sign_in_provider: 'anonymous' } })
      .firestore();
    const other = env
      .authenticatedContext('other', { firebase: { sign_in_provider: 'google.com' }, email_verified: true })
      .firestore();
    const anon = env.unauthenticatedContext().firestore();
    const user = (n) =>
      env.authenticatedContext(n, { firebase: { sign_in_provider: 'anonymous' } }).firestore();
    const item = (db) => doc(db, 'editorial_layouts', 'one'),
      valid = {
        name: 'Un diseño',
        component: 'dialogue',
        settings: '{}',
        revision: 1,
        updatedAt: serverTimestamp(),
      };
    await assertFails(setDoc(item(anon), valid));
    await assertFails(setDoc(item(other), valid));
    await assertFails(setDoc(item(fake), valid));
    await assertSucceeds(setDoc(item(owner), valid));
    await assertSucceeds(getDoc(item(owner)));
    await assertSucceeds(getDocs(collection(owner, 'editorial_layouts')));
    await assertFails(getDoc(item(anon)));
    await assertFails(getDocs(collection(other, 'editorial_layouts')));
    await assertFails(setDoc(doc(other, 'editorial_members', 'other'), { role: 'owner' }));
    await assertFails(setDoc(item(owner), valid));
    await assertFails(setDoc(item(owner), { ...valid, revision: 2, component: 'other' }));
    await assertFails(setDoc(item(owner), { ...valid, revision: 2, extra: 'bad' }));
    await assertFails(setDoc(item(owner), { ...valid, revision: 2, settings: 'x'.repeat(500001) }));
    await assertSucceeds(setDoc(item(owner), { ...valid, revision: 2 }));
    await assertFails(setDoc(item(owner), { ...valid, revision: 2 }));
    const host = user('host'),
      room = (db) => doc(db, 'test_rooms', 'random-room');
    await assertSucceeds(setDoc(room(host), { host: 'host', players: [], createdAt: serverTimestamp() }));
    await assertFails(getDocs(collection(host, 'test_rooms')));
    await assertFails(getDoc(room(anon)));
    for (let n = 1; n <= 4; n++)
      await assertSucceeds(updateDoc(room(user('p' + n)), { players: arrayUnion('p' + n) }));
    await assertFails(updateDoc(room(user('fifth')), { players: arrayUnion('fifth') }));
    await assertFails(updateDoc(room(user('p1')), { players: arrayUnion('p1') }));
    await assertFails(updateDoc(room(user('intruder')), { host: 'intruder' }));
    await assertFails(getDoc(doc(anon, 'campaigns', 'legacy')));
    await assertFails(setDoc(doc(other, 'campaigns', 'legacy'), { name: 'x' }));
    await assertSucceeds(setDoc(doc(owner, 'campaigns', 'legacy'), { name: 'x' }));
    const art = (db, id='BKG__red_sky') => doc(db,'editorial_assets',id);
    const draft = {id:'BKG/red_sky',storagePath:'editorial-assets/BKG/red_sky.png',mime:'image/png',alt:'Cielo rojo',size:4096,status:'draft',createdAt:serverTimestamp()};
    await assertFails(setDoc(art(anon),draft));
    await assertFails(setDoc(art(other),draft));
    await assertFails(setDoc(art(fake),draft));
    await assertFails(setDoc(art(owner,'bad'),draft));
    await assertFails(setDoc(art(owner),{...draft,storagePath:'private/red_sky.png'}));
    await assertSucceeds(setDoc(art(owner),draft));
    await assertSucceeds(getDoc(art(owner)));
    await assertFails(getDoc(art(anon)));
    await assertFails(updateDoc(art(owner),{status:'published'}));
    console.log('PASS: biblioteca, identidad, cuatro jugadores, integridad y protección de datos anteriores');
  } finally {
    await env.cleanup();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
