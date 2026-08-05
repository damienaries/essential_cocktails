import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { signOut } from 'firebase/auth';
import { getFirebaseAuth } from '../lib/firebase';
import { USER_SCOPED_ROOT_KEYS } from '../lib/queryClient';

/** Signs the user out and returns them to the home page. */
export function useLogout() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useCallback(async () => {
		await signOut(getFirebaseAuth());
		// Drop this account's saves and menus from memory. Their keys are uid-scoped
		// so the next user couldn't read them, but there's no reason to keep them
		// around on a shared device. The public drinks cache is left alone.
		for (const key of USER_SCOPED_ROOT_KEYS) {
			queryClient.removeQueries({ queryKey: [key] });
		}
		navigate('/');
	}, [navigate, queryClient]);
}
