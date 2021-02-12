import React from 'react';
import { c } from 'ttag';
import { PrivateMainArea, useAppTitle, useUser, useOrganization, OverviewLayout } from 'react-components';
import { useEarlyAccess } from 'react-components/hooks';

import { getPages } from '../pages';
import './OverviewContainer.scss';

const OverviewContainer = () => {
    const [user] = useUser();
    const [organization] = useOrganization();
    const { hasEarlyAccess } = useEarlyAccess();
    const pages = getPages(user, organization, hasEarlyAccess).filter(({ to }) => to !== '/overview');
    useAppTitle(c('Title').t`Overview`);

    return (
        <PrivateMainArea className="flex">
            <OverviewLayout pages={pages} title={c('Title').t`Account settings`} limit={6} />
        </PrivateMainArea>
    );
};

export default OverviewContainer;
