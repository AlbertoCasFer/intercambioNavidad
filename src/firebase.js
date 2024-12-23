import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyD_uXtzhqMJbeuNR5RX13-IGJJ3arZs7zQ',
	authDomain: 'intercambio-nav-2024.firebaseapp.com',
	projectId: 'intercambio-nav-2024',
	storageBucket: 'intercambio-nav-2024.appspot.com',
	messagingSenderId: '483853724446',
	appId: '1:483853724446:web:f4e9c9618905f03463b70f',
	measurementId: 'G-1NF2368RT5',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
