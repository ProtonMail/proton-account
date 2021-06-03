import React from 'react';
import { c } from 'ttag';
import { UserModel } from 'proton-shared/lib/interfaces';
import isTruthy from 'proton-shared/lib/helpers/isTruthy';
import {
    StartImportSection,
    ImportListSection,
    ImportExportSection,
    SettingsPropsShared,
    useUser,
} from 'react-components';

import PrivateMainSettingsAreaWithPermissions from '../../components/PrivateMainSettingsAreaWithPermissions';

export const getImportPage = ({ user }: { user: UserModel }) => {
    return {
        text: user.isFree ? c('Title').t`Import Assistant` : c('Title').t`Import & export`,
        to: '/mail/import-export',
        icon: 'import',
        subsections: [
            {
                text: c('Title').t`Import Assistant`,
                id: 'start-import',
            },
            {
                text: c('Title').t`Current & past imports`,
                id: 'import-list',
            },
            !user.isFree && {
                text: c('Title').t`Import-Export app`,
                id: 'import-export',
            },
        ].filter(isTruthy),
    };
};

const MailImportAndExportSettings = ({ setActiveSection, location }: SettingsPropsShared) => {
    const [user] = useUser();

    return (
        <PrivateMainSettingsAreaWithPermissions
            config={getImportPage({ user })}
            setActiveSection={setActiveSection}
            location={location}
        >
            <StartImportSection />
            <ImportListSection />
            {!user.isFree && <ImportExportSection />}
        </PrivateMainSettingsAreaWithPermissions>
    );
};

export default MailImportAndExportSettings;
