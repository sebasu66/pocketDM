import {validAssetId,publicAssets} from './asset-catalog.mjs';
const extensions={'image/png':'png','image/jpeg':'jpg','image/webp':'webp','image/avif':'avif'};
const maxBytes=10*1024*1024;
const configUrl='https://pocketdm-prototipos.web.app/__/firebase/init.json';
const pathFor=(id,mime)=>'editorial-assets/'+id+'.'+extensions[mime];
export async function connectAssetLibrary(){
 const [appSdk,authSdk,dbSdk,storeSdk]=await Promise.all(['app','auth','firestore','storage'].map(x=>import('https://www.gstatic.com/firebasejs/11.9.1/firebase-'+x+'.js')));
 const r=await fetch(configUrl);if(!r.ok)throw Error('Configuración Firebase no disponible');const config=await r.json();if(config.projectId!=='lore-weaver-rt9pc')throw Error('Proyecto incorrecto');
 const app=appSdk.getApps().find(x=>x.name==='editorial')||appSdk.initializeApp(config,'editorial');
 const auth=authSdk.getAuth(app),db=dbSdk.getFirestore(app),storage=storeSdk.getStorage(app);await auth.authStateReady();
 const user=auth.currentUser||(await authSdk.signInWithPopup(auth,new authSdk.GoogleAuthProvider())).user;
 const member=await dbSdk.getDoc(dbSdk.doc(db,'editorial_members',user.uid));if(member.data()?.role!=='owner')throw Error('Cuenta no autorizada para editar la biblioteca');
 const doc=id=>dbSdk.doc(db,'editorial_assets',id.replace('/','__'));
 const assertOwner=()=>{if(auth.currentUser?.uid!==user.uid)throw Error('Sesión cerrada')};
 const validRecord=a=>validAssetId(a.id)&&Object.hasOwn(extensions,a.mime)&&a.storagePath===pathFor(a.id,a.mime)&&!Object.hasOwn(publicAssets,a.id)&&typeof a.alt==='string'&&a.status==='draft';
 return {
  async list(){assertOwner();const result=await dbSdk.getDocs(dbSdk.collection(db,'editorial_assets'));return result.docs.map(x=>x.data()).filter(validRecord)},
  async upload(id,file,alt){
   assertOwner();if(!validAssetId(id)||Object.hasOwn(publicAssets,id)||!Object.hasOwn(extensions,file.type)||file.size<1||file.size>maxBytes||!alt.trim()||alt.length>300)throw Error('Nombre, formato o tamaño inválido');
   if((await dbSdk.getDoc(doc(id))).exists())throw Error('Ya existe ese código');
   const storagePath=pathFor(id,file.type);await storeSdk.uploadBytes(storeSdk.ref(storage,storagePath),file,{contentType:file.type,customMetadata:{assetId:id}});
   // If this step fails, the immutable object needs administrative recovery. Never overwrite another asset.
   await dbSdk.runTransaction(db,async tx=>{if((await tx.get(doc(id))).exists())throw Error('Código ocupado');tx.set(doc(id),{id,storagePath,mime:file.type,alt:alt.trim(),size:file.size,status:'draft',createdAt:dbSdk.serverTimestamp()})});
  },
  async preview(a){assertOwner();if(!validRecord(a))throw Error('Recurso no válido');const bytes=await storeSdk.getBytes(storeSdk.ref(storage,a.storagePath),maxBytes);return new Blob([bytes],{type:a.mime})},
  async disconnect(){await authSdk.signOut(auth)}
 };
}