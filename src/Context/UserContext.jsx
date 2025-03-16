import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { createContext, useEffect, useState } from 'react';
import { app } from '../Credentials';
import { getDoc, getFirestore, doc, setDoc } from 'firebase/firestore';

const UserContext = createContext(null);

const auth = getAuth(app);
const db = getFirestore(app);

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState({});
    const [Logged, setLogged] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (userConnected) => {
            if (userConnected) {
                setUser(userConnected);
                const userDocRef = doc(db, "users", userConnected.uid);
                try {
                    const docSnap = await getDoc(userDocRef);
                    if (!docSnap.exists()) {
                        console.log("No such document!");
                        setProfile({});
                    } else {
                        setProfile(docSnap.data());
                        setLogged(true);
                    }
                } catch (error) {
                    setProfile({});
                }
            } else {
                setUser(null);
                setProfile({});
                setLogged(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const updateProfile = async (newProfile) => {
        if (user) {
            const userDocRef = doc(db, "users", user.uid);
            try {
                await setDoc(userDocRef, newProfile, { merge: true });
                setProfile(newProfile);
                console.log("Perfil actualizado correctamente");
            } catch (error) {
                console.error("Error al actualizar el perfil:", error);
            }
        } else {
            console.error("No hay un usuario autenticado");
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser, profile, setProfile, Logged, updateProfile }}>
            {children}
        </UserContext.Provider>
    );
};

export { UserProvider, UserContext };