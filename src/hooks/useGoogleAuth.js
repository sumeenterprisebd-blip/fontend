/**
 * Authentication Context Integration Guide
 *
 * This file keeps the custom auth context synced when a session exists.
 */

import { useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

export const useSyncAuthContext = () => {
    const { data: session, status } = useSession();

    const syncWithAuthContext = useCallback(async () => {
        if (status === 'authenticated' && session?.accessToken && session?.user) {
            try {
                localStorage.setItem('token', session.accessToken);
                localStorage.setItem('user', JSON.stringify(session.user));

                window.dispatchEvent(
                    new CustomEvent('authContextSync', {
                        detail: {
                            token: session.accessToken,
                            user: session.user,
                            isNewUser: session.isNewUser || false,
                        },
                    })
                );
            } catch (error) {
                console.error('Failed to sync auth context:', error);
            }
        }
    }, [session, status]);

    useEffect(() => {
        syncWithAuthContext();
    }, [syncWithAuthContext]);

    return { session, status };
};
