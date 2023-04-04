// eslint-disable-next-line
import { auth, googleProvider } from "../config/firebase";
import { signInWithPopup } from "firebase/auth";

import Cookies from "universal-cookie";
const cookies = new Cookies();

export const Auth = (props) => {
  // Sign in with google account
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      cookies.set("auth-token", result.user.refreshToken);
      props.setIsAuth(true); // Redirect user to chat room after login
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="auth">
      <br />

      <p>Sign In With Google To Continue</p>
      <button onClick={signInWithGoogle}>Sign In With Google</button>
    </div>
  );
};
