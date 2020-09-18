import React, { useEffect, useState } from 'react';
import { c } from 'ttag';
import { loadOpenPGP } from 'proton-shared/lib/openpgp';
import { getBrowserLocale, getClosestLocaleCode } from 'proton-shared/lib/i18n/helper';
import { loadLocale, loadDateLocale } from 'proton-shared/lib/i18n/loadLocale';
import { TtagLocaleMap } from 'proton-shared/lib/interfaces/Locale';
import {
    LoaderPage,
    ModalsChildren,
    useApi,
    ProtonLoginCallback,
    useNotifications,
    useDocumentTitle,
    StandardLoadError,
} from 'react-components';
import {
    getActiveSessions,
    GetActiveSessionsResult,
    resumeSession,
} from 'proton-shared/lib/authentication/persistedSessionHelper';
import { getLocalIDFromPathname } from 'proton-shared/lib/authentication/pathnameHelper';
import { InvalidPersistentSessionError } from 'proton-shared/lib/authentication/error';
import { getIs401Error, getApiErrorMessage } from 'proton-shared/lib/api/helpers/apiErrorHelper';
import { traceError } from 'proton-shared/lib/helpers/sentry';

interface Props {
    locales?: TtagLocaleMap;
    children: React.ReactNode;
    onActiveSessions: (data: GetActiveSessionsResult) => boolean;
    onLogin: ProtonLoginCallback;
}

const AccountPublicApp = ({ locales = {}, children, onActiveSessions, onLogin }: Props) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const normalApi = useApi();
    const silentApi = <T,>(config: any) => normalApi<T>({ ...config, silence: true });
    const { createNotification } = useNotifications();

    useDocumentTitle(c('Info').t`Loading`);

    useEffect(() => {
        const runGetSessions = async () => {
            const browserLocale = getBrowserLocale();
            const localeCode = getClosestLocaleCode(browserLocale, locales);
            await Promise.all([
                loadOpenPGP(),
                loadLocale(localeCode, locales),
                loadDateLocale(localeCode, browserLocale),
            ]);
            const [activeSessionsResult] = await Promise.all([getActiveSessions(silentApi)]);
            if (!onActiveSessions(activeSessionsResult)) {
                setLoading(false);
            }
        };

        const runResumeSession = async (localID: number) => {
            await loadOpenPGP();
            try {
                const result = await resumeSession(silentApi, localID);
                return onLogin(result);
            } catch (e) {
                if (e instanceof InvalidPersistentSessionError || getIs401Error(e)) {
                    return runGetSessions();
                }
                throw e;
            }
        };

        const run = async () => {
            const localID = getLocalIDFromPathname(window.location.pathname);
            if (localID === undefined) {
                return runGetSessions();
            }
            return runResumeSession(localID);
        };

        run().catch((e) => {
            const errorMessage = getApiErrorMessage(e) || 'Unknown error';
            createNotification({ type: 'error', text: errorMessage });
            traceError(e);
            setError(true);
        });
    }, []);

    if (error) {
        return <StandardLoadError />;
    }

    if (loading) {
        return (
            <>
                <ModalsChildren />
                <LoaderPage />
            </>
        );
    }

    return (
        <>
            <ModalsChildren />
            {children}
        </>
    );
};

export default AccountPublicApp;
