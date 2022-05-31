import React, { useEffect, useRef, useState } from 'react'
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { firebaseInitalize } from '../Firebase/FirebaseInitalize';
import { useAppDispatch } from '../Redux/hooks';
import { currentLoginUser } from '../Redux/counterSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FirebaseSignInProvider } from '@firebase/util';
// import axios from 'axios';
import io from 'socket.io-client';
import swal from 'sweetalert';

firebaseInitalize();

export const useFirebase = () => {

    // const socketClient = useRef<SocketIOClient.Socket>();
    // socketClient.current = io.connect("http://localhost:5000");
    const [user, setUser] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [processing, setProcessing] = useState<boolean>(false);
    let creatId = user.metadata?.createdAt;
    const googleProvider = new GoogleAuthProvider();
    const auth: any = getAuth();
    const location: any = useLocation();

    const signUpWithEmail = (name: string, email: string, password: any) => {
        setLoading(true);
        setProcessing(true);
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                //update user profile
                updateProfile(auth.currentUser, {
                    displayName: name, photoURL: "https://w7.pngwing.com/pngs/831/88/png-transparent-user-profile-computer-icons-user-interface-mystique-miscellaneous-user-interface-design-smile-thumbnail.png"
                }).then((data) => {
                    const user = userCredential.user;
                    const { createdAt }: any = user.metadata
                    const userData: object = { photoURL: user.photoURL, displayName: user.displayName, uid: user.uid, createdAt: createdAt, email: user.email, phone: null, adress: null, contracts: [], groups: [], profession: null };
                    saveUser(userData, 'POST');
                    dispatch(currentLoginUser({ userData }));
                    setProcessing(false);
                    navigate(location.state?.from.pathname || '/')
                }).catch((error) => {
                    setError(error.message)
                }).finally(() => setLoading(false));

            }).catch(error => {
                setProcessing(false);
                setError(error.message);
            })
    };

    const logInWithEmail = (email: string, password: any) => {
        setLoading(true)
        setProcessing(true);
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user: any = userCredential.user;
                const { createdAt }: any = user.metadata
                const userData: object = { photoURL: user.photoURL, displayName: user.displayName, uid: user.uid, createdAt: createdAt, email: user.email, phone: null, adress: null, contracts: [], groups: [], profession: null };
                dispatch(currentLoginUser({ userData }));
                setProcessing(false);
                navigate(location.state?.from.pathname || '/');
            })
            .catch((error) => {
                setError(error.message);
                setProcessing(false);
            }).finally(() => setLoading(false))
    }



    const handleGoogleSign = (location: any) => {
        setLoading(true);
        signInWithPopup(auth, googleProvider)
            .then((result: any) => {
                const user = result.user;
                const createdDate: any = { createdAt: user.metadata.createdAt }
                const userData: object = { photoURL: user.photoURL, displayName: user.displayName, uid: user.uid, createdAt: createdDate.createdAt, email: user.email, phone: null, adress: null, contracts: [], groups: [], profession: null };

                dispatch(currentLoginUser({ userData }));
                const redirect: any = location.state?.from.pathname || '/';
                navigate(redirect);
                setLoading(false);


                axios.get(`https://enigmatic-garden-12643.herokuapp.com/users/checkuser/${user?.uid}`)
                    .then(res => {
                        if (res.data.newUser === true) {
                            saveUser(userData, 'PUT');
                        } else {
                        }
                    })

                // saveUser(userData, 'PUT')

                // fetch('https://enigmatic-garden-12643.herokuapp.com/users', {
                //     method: 'PUT',
                //     headers: {
                //         'content-type': 'application/json'
                //     },
                //     body: JSON.stringify(userData)
                // })
                //     .then()
                // empty dependency array means this effect will only run once (like componentDidMount in classes)
                // axios.post(`https://enigmatic-garden-12643.herokuapp.com/users`, user)
            }).catch((error) => {
                setError(error.message);
            }).finally(() => setLoading(false));
    }

    useEffect(() => {
        setLoading(true);
        onAuthStateChanged(auth, (user: any) => {
            if (user) {
                // loginUser
                const createdDate: any = { createdAt: user.metadata.createdAt }
                const userData: object = { photoURL: user.photoURL, displayName: user.displayName, uid: user.uid, createdAt: createdDate.createdAt, email: user.email, };
                // socketClient?.current?.emit('login', { loginUser: userData });
                dispatch(currentLoginUser(userData));
                setUser(user)
            } else {
                setUser({});
                dispatch(currentLoginUser({}));
            }
            setLoading(false);
        })
    }, [auth]);


    // save user on database 
    const saveUser = (data: object, method: string) => {
        fetch('https://enigmatic-garden-12643.herokuapp.com/users', {
            method: method,
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then()
    };



    const logOut = () => {
        setLoading(true);
        const auth = getAuth();
        signOut(auth).then(() => {
            setUser({});
            dispatch(currentLoginUser({}));
        }).catch((error) => {
            console.error(error);
        }).finally(() => setLoading(false));
    }

    // send reset paassword email
    const reseatPassword = (email: string) => {
        setProcessing(true);
        sendPasswordResetEmail(auth, email)
            .then(() => {
                setProcessing(false);
                swal("Email sent", "Please check your email", "success");
            })
            .catch((error) => {
                const errorMessage = error.message;
                setError(errorMessage);
                setProcessing(false);
            });

    };

    // update profile picture and name
    const updatePhotoAndName = (name: string, photo: string) => {
        updateProfile(auth.currentUser, {
            displayName: name, photoURL: photo
        }).then((data) => {
            // Profile updated!
            // ...
        }).catch((error) => {
            console.log(error.message);
            // An error occurred
            // ...
        });
    };

    return {
        handleGoogleSign,
        user,
        error,
        loading,
        logOut,
        signUpWithEmail,
        logInWithEmail,
        processing,
        reseatPassword,
        updatePhotoAndName
    };
}