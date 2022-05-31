import { initializeApp } from '@firebase/app';
import { firebaseConfig } from './FirebaseConfig';

export const firebaseInitalize = () => {
    return (
        initializeApp(firebaseConfig)
    );
};
