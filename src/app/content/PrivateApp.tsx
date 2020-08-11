import React from 'react';
import { StandardPrivateApp } from 'react-components';
import { TtagLocaleMap } from 'proton-shared/lib/interfaces/Locale';
import {
    UserModel,
    MailSettingsModel,
    UserSettingsModel,
    DomainsModel,
    AddressesModel,
    LabelsModel,
    FiltersModel,
    OrganizationModel,
    MembersModel,
    SubscriptionModel,
    PaymentMethodsModel,
} from 'proton-shared/lib/models';

import PrivateLayout from './PrivateLayout';

const EVENT_MODELS = [
    UserModel,
    MailSettingsModel,
    UserSettingsModel,
    AddressesModel,
    DomainsModel,
    LabelsModel,
    FiltersModel,
    SubscriptionModel,
    OrganizationModel,
    MembersModel,
    PaymentMethodsModel,
];

const PRELOAD_MODELS = [UserSettingsModel, UserModel, MailSettingsModel];

interface Props {
    onLogout: () => void;
    locales: TtagLocaleMap;
}

const PrivateApp = ({ onLogout, locales }: Props) => {
    return (
        <StandardPrivateApp
            onLogout={onLogout}
            locales={locales}
            preloadModels={PRELOAD_MODELS}
            eventModels={EVENT_MODELS}
        >
            <PrivateLayout />
        </StandardPrivateApp>
    );
};

export default PrivateApp;
