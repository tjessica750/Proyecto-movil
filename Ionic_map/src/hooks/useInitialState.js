import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { getFirestore, collection, addDoc } from 'firebase/firestore'
import { useHistory } from 'react-router';

const useInitialState = () => {
    const auth = getAuth();
    const firestore = getFirestore();

    const [error , setError] = useState('');
    const [loading , setLoading] = useState(false);

    const loginUser = (formData) => {
        setLoading(true)
        signInWithEmailAndPassword(auth , formData.email, formData.password)
        .then((userCredential) => {
           
        }).catch((error)=>{
            setLoading(false)
            switch (error.code) {
                case "auth/user-not-found":
                    setError("Usuario no encontrado")
                    break;
                case "auth/invalid-email":
                    setError("Email invalido")
                    break;
                case "auth/wrong-password":
                    setError("Contraseña incorrecta")
                    break;
                default:
                    break;
            }
        })
    }

    const signUpUser = (formData) => {
        setLoading(true)
        createUserWithEmailAndPassword(auth, formData.email, formData.password)
        .then( async (userCredential) => {
            await addDoc(collection(firestore, 'usuarios'), formData)
            console.log('register successfull')

        }).catch((error) =>{
            setLoading(false)
            switch (error.code){
                case "auth/email-already-in-use":
                    setError("Ya existe un usuario con este email")
                    break;
                case "auth/weak-password":
                    setError("La contraseña debe tener mínimo 6 carácteres")
                    break;
                case "auth/invalid-email":
                    setError("Formato de email invalido")
                    break;
                default:
                    break;
                }
        })
    }

    const logOutUser = () => {
        setLoading(true)
        signOut(auth).then(() =>{
            console.log('signout successfull')
        }).catch((error) =>{
            setLoading(false)
            setError(error.message)
        })
    }

    return{
        loginUser,
        signUpUser,
        logOutUser,
        error,
        loading,
    }
};

export default useInitialState;