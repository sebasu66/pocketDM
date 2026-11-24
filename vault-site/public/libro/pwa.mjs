if('serviceWorker' in navigator&&window.isSecureContext){navigator.serviceWorker.register('/sw-pocketdm.js',{scope:'/',updateViaCache:'none'}).catch(e=>console.warn('Pocket DM PWA:',e.message))}
