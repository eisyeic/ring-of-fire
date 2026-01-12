import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideDatabase, getDatabase } from '@angular/fire/database';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// Firebase-Konfiguration
const firebaseConfig = {
  apiKey: "AIzaSyDaK-8VRQwd0R6KD-NBgnCTdxYTccI4XJc",
  authDomain: "ring-of-fire-96da8.firebaseapp.com",
  projectId: "ring-of-fire-96da8",
  storageBucket: "ring-of-fire-96da8.firebasestorage.app",
  messagingSenderId: "548747925970",
  appId: "1:548747925970:web:ba1425caaa35750dae500b"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideClientHydration(), 
    provideAnimationsAsync(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase())
  ]
};