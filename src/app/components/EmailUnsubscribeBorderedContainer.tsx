import React from 'react';
import { classnames } from 'react-components';
import './EmailUnsubscribeBorderedContainer.scss';

interface EmailUnsubscribeBorderedContainerProps {
    children: React.ReactNode;
    className?: string;
}

const EmailUnsubscribeBorderedContainer = ({
    children,
    className: classNameProp,
}: EmailUnsubscribeBorderedContainerProps) => {
    const className = classnames([
        'flex flex-column flex-items-center mt4 bordered-container p2 email-unsubscribe-container',
        classNameProp,
    ]);

    return <div className={className}>{children}</div>;
};

export default EmailUnsubscribeBorderedContainer;
