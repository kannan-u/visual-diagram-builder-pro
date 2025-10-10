import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
 apiKey: "AIzaSyClFT7vMROoac_Pn2S3WMYFBNy6VIMmk1A",
  authDomain: "diagram-editor-f6b86.firebaseapp.com",
  projectId: "diagram-editor-f6b86",
  storageBucket: "diagram-editor-f6b86.firebasestorage.app",
  messagingSenderId: "1006938644233",
  appId: "1:1006938644233:web:2ac83f470634e419d03dd8",
  measurementId: "G-YGB6VW5N71"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
