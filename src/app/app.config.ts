import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'algoritmo3-8ee11',
        appId: '1:227965352149:web:00197192f4272f05314a5c',
        storageBucket: 'algoritmo3-8ee11.firebasestorage.app',
        apiKey: 'AIzaSyBebRYQK8AYLJSNcjp5k2LfDe4T3mBBAYc',
        authDomain: 'algoritmo3-8ee11.firebaseapp.com',
        messagingSenderId: '227965352149'
      })
    ),
    provideAuth(() => getAuth()),
    provideHttpClient(),
    provideAnimations()
  ]
};
