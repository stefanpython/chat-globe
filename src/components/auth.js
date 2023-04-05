import "./auth.css";

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
    <div className="auth--container">
      <div className="auth--content">
        <br />
        <img className="globe--logo" src="globe.png" alt="globe" />

        <p>Welcome to Chat Global</p>

        <div className="google-btn" onClick={signInWithGoogle}>
          <div className="google-icon-wrapper">
            <img
              className="google-icon"
              src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
              alt=""
            />
          </div>
          <p className="btn-text">
            <b>Sign in with google</b>
          </p>
        </div>
      </div>
    </div>
  );
};
