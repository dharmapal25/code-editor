import './App.css'
import { useEffect, useState } from "react";
import Navbar from './components/Navbar/Navbar'
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/auth/Firebase';
import { authUserInfo } from "./context/AuthContext";
import JSEditor from './pages/JSEditor';

const App = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true); // 1. Loading state banayi

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          setUser(currentUser);
          const token = await currentUser.getIdToken();
          console.log("Firebase Token:", token);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Backend Error:", error);
      } finally {
        setLoading(false); // 2. Check poora hone ke baad loading false kar di
      }
    });

    return () => unsubscribe();
  }, []);


  // 3. Agar Firebase abhi check kar raha hai, toh Loading screen dikhao
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h2>Loading Authentication...</h2>
      </div>
    );
  }

  console.log(user)

  return (
    <>
    <authUserInfo.Provider value={[user,setUser]}>
      <Navbar />
      <JSEditor />
    </authUserInfo.Provider>
    </>
  )
};

export default App;