import { onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { useEffect, useState } from 'react'
import { auth, provider } from '../services/auth/Firebase';

function Login() {    

    const [User, setUser] = useState<any>(null);

    // Google Login
    async function loginHandler() {
        try {
            await signInWithPopup(auth, provider);
            // onAuthStateChanged automatically handle karega
        } catch (error) {
            console.error("Login Error:", error);
        }
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            try {
                if (currentUser) {
                    setUser(currentUser);
                    // Firebase JWT Token
                    const token = await currentUser.getIdToken();
                    console.log("Firebase Token:", token);

                } else {
                    setUser(null);
                }

            } catch (error) {
                console.error("Backend Error:", error)
            };
            return () => unsubscribe();
        }
        )
    }, []);

    return (
        <div>

            {(User) ?
                <button onClick={loginHandler} >Login</button>
                :
                <button onClick={loginHandler} >Login</button>
            }

        </div>
    )
}

export default Login