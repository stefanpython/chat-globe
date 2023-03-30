// eslint-disable-next-line
import { useState } from "react";
import { auth, googleProvider } from "../config/firebase";
import { signInWithPopup, signOut } from "firebase/auth";

export const Auth = () => {
  console.log(auth?.currentUser?.email);

  // Sign in with google account
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error(err);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <br />

      <button onClick={logout}>Logout</button>

      <button onClick={signInWithGoogle}>Sign In With Google</button>
    </div>
  );
};
