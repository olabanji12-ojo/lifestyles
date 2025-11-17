// src/utils/authHelpers.ts
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import toast from 'react-hot-toast';

export const handleLogout = async (navigate: Function) => {
  try {
    await signOut(auth);
    toast.success('Logged out safely');
    navigate('/login');
  } catch (error) {
    toast.error('Logout failed');
    console.error(error);
  }
};
