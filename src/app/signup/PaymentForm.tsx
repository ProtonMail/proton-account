import React from 'react';
import { PAYMENT_METHOD_TYPE, PLAN_SERVICES } from 'proton-shared/lib/constants';
import { Plan } from 'proton-shared/lib/interfaces';
import { SubscriptionCheckResponse } from 'proton-shared/lib/interfaces/Subscription';
import { noop } from 'proton-shared/lib/helpers/function';

import { Payment, SubscriptionCheckout, useLoading } from 'react-components';
import { SignupModel, SignupPayPal } from './interfaces';
import CheckoutButton from './CheckoutButton';

interface Props {
    model: SignupModel;
    checkResult: SubscriptionCheckResponse;
    onChange: (model: SignupModel) => void;
    card: any;
    onCardChange: (key: string, value: string) => void;
    paypal: SignupPayPal;
    paypalCredit: SignupPayPal;
    method?: PAYMENT_METHOD_TYPE;
    onMethodChange: (method: PAYMENT_METHOD_TYPE) => void;
    errors: any;
    canPay: boolean;
    loading: boolean;
    plans?: Plan[];
    onSubmit: () => Promise<void>;
}

const PaymentForm = ({
    plans,
    checkResult,
    model,
    onChange,
    card,
    onCardChange,
    paypal,
    paypalCredit,
    canPay,
    method,
    onMethodChange,
    errors,
    loading,
    onSubmit,
}: Props) => {
    const [loadingSubmit, withLoading] = useLoading();

    return (
        <form
            name="payment-form"
            onSubmit={(event) => {
                event.preventDefault();
                withLoading(onSubmit()).catch(noop);
            }}
            method="post"
        >
            <div className="flex-no-min-children flex-nowrap on-mobile-flex-column on-mobile-flex-wrap">
                <div className="flex-item-fluid no-min-dimensions on-mobile-w100 pr1 on-mobile-pr0">
                    <Payment
                        type="signup"
                        paypal={paypal}
                        paypalCredit={paypalCredit}
                        method={method}
                        amount={checkResult.AmountDue}
                        currency={model.currency}
                        card={card}
                        onMethod={onMethodChange}
                        onCard={onCardChange}
                        errors={errors}
                    />
                </div>
                <div className="bg-weak w25 min-w14e on-mobile-w100">
                    <SubscriptionCheckout
                        submit={
                            <CheckoutButton
                                loading={loading || loadingSubmit}
                                canPay={canPay}
                                paypal={paypal}
                                method={method}
                                checkResult={checkResult}
                                className="w100"
                            />
                        }
                        plans={plans}
                        checkResult={checkResult}
                        loading={loading || loadingSubmit}
                        service={PLAN_SERVICES.MAIL}
                        currency={model.currency}
                        cycle={model.cycle}
                        planIDs={model.planIDs}
                        onChangeCurrency={(currency) => onChange({ ...model, currency })}
                        onChangeCycle={(cycle) => onChange({ ...model, cycle })}
                    />
                </div>
            </div>
        </form>
    );
};

export default PaymentForm;