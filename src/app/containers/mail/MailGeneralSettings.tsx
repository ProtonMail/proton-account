import React from 'react';
import { c } from 'ttag';

import {
    MessagesSection,
    MailGeneralAdvancedSection,
    SettingsPropsShared,
    PmMeSection,
    useAddresses,
} from 'react-components';

import { ADDRESS_TYPE } from 'proton-shared/lib/constants';
import { UserModel } from 'proton-shared/lib/interfaces';
import isTruthy from 'proton-shared/lib/helpers/isTruthy';
import { getHasOnlyExternalAddresses } from 'proton-shared/lib/helpers/address';

import PrivateMainSettingsAreaWithPermissions from '../../components/PrivateMainSettingsAreaWithPermissions';
import PrivateMainAreaLoading from '../../components/PrivateMainAreaLoading';

export const getGeneralPage = (user: UserModel, showPmMeSection: boolean) => {
    return {
        text: c('Title').t`General`,
        to: '/mail/general',
        icon: 'general',
        subsections: [
            showPmMeSection && {
                text: c('Title').t`Short domain (@pm.me)`,
                id: 'pmme',
            },
            {
                text: c('Title').t`Messages`,
                id: 'messages',
            },
            {
                text: c('Title').t`Advanced`,
                id: 'advanced',
            },
        ].filter(isTruthy),
    };
};

interface Props extends SettingsPropsShared {
    user: UserModel;
}

const MailGeneralSettings = ({ location, user }: Props) => {
    const [addresses, loading] = useAddresses();

    if (loading && !Array.isArray(addresses)) {
        return <PrivateMainAreaLoading />;
    }

    const { hasPaidMail, canPay, isSubUser } = user;
    const isExternalUser = getHasOnlyExternalAddresses(addresses);
    const isPMAddressActive = addresses.some(({ Type }) => Type === ADDRESS_TYPE.TYPE_PREMIUM);
    const showPmMeSection = !isExternalUser && canPay && !isSubUser && !(isPMAddressActive && hasPaidMail);

    return (
        <PrivateMainSettingsAreaWithPermissions location={location} config={getGeneralPage(user, showPmMeSection)}>
            {showPmMeSection && <PmMeSection isPMAddressActive={isPMAddressActive} />}
            <MessagesSection />
            <MailGeneralAdvancedSection />
        </PrivateMainSettingsAreaWithPermissions>
    );
};

export default MailGeneralSettings;
