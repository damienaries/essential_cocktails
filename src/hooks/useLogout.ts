import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { getFirebaseAuth } from '../lib/firebase';

/** Signs the user out and returns them to the home page. */
export function useLogout() {
	const navigate = useNavigate();
	return useCallback(async () => {
		await signOut(getFirebaseAuth());
		navigate('/');
	}, [navigate]);
}
