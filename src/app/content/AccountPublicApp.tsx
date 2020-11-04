import React, { useEffect, useState } from 'react';
import { loadOpenPGP } from 'proton-shared/lib/openpgp';
import { getBrowserLocale, getClosestLocaleCode, getClosestLocaleMatch } from 'proton-shared/lib/i18n/helper';
import { loadLocale, loadDateLocale } from 'proton-shared/lib/i18n/loadLocale';
import { TtagLocaleMap } from 'proton-shared/lib/interfaces/Locale';
import {
    LoaderPage,
    ModalsChildren,
    useApi,
    ProtonLoginCallback,
    StandardLoadError,
    useErrorHandler,
} from 'react-components';
import {
    getActiveSessions,
    GetActiveSessionsResult,
    resumeSession,
} from 'proton-shared/lib/authentication/persistedSessionHelper';
import { getLocalIDFromPathname } from 'proton-shared/lib/authentication/pathnameHelper';
import { InvalidPersistentSessionError } from 'proton-shared/lib/authentication/error';
import { getIs401Error } from 'proton-shared/lib/api/helpers/apiErrorHelper';
import { getCookie } from 'proton-shared/lib/helpers/cookies';

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
    const errorHandler = useErrorHandler();

    useEffect(() => {
        const runGetSessions = async () => {
            const searchParams = new URLSearchParams(window.location.search);
            const languageParams = searchParams.get('language');
            const languageCookie = getCookie('Locale');
            const browserLocale = getBrowserLocale();
            const localeCode =
                getClosestLocaleMatch(languageParams || languageCookie || '', locales) ||
                getClosestLocaleCode(browserLocale, locales);
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
            errorHandler(e);
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
