import { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import cn from 'classnames';
import { PaymentGateway } from '@/types';
import { RadioGroup } from '@/components/ui/radio-group';
import { paymentGatewayAtom } from '@/components/cart/lib/checkout';
import PaymentOnline from '@/components/cart/payment/payment-online';
import { useIsDarkMode } from '@/lib/hooks/use-is-dark-mode';
import { useSettings } from '@/data/settings';
import Alert from '@/components/ui/alert';
import { StripeIcon } from '@/components/icons/payment-gateways/stripe';
import { PayPalIcon } from '@/components/icons/payment-gateways/paypal';
import { RazorPayIcon } from '@/components/icons/payment-gateways/razorpay';
import { MollieIcon } from '@/components/icons/payment-gateways/mollie';
import { PayStack } from '@/components/icons/payment-gateways/paystack';
import BitpayIcon from '@/components/icons/payment-gateways/bitpay';
import { PayPalDarkIcon } from '@/components/icons/payment-gateways/paypal-dark';
import BitpayDarkIcon from '@/components/icons/payment-gateways/bitpay-dark';
import { MollieDarkIcon } from '@/components/icons/payment-gateways/mollie-dark';
import { PayStackDark } from '@/components/icons/payment-gateways/paystack-dark';
import { RazorPayDarkIcon } from '@/components/icons/payment-gateways/razorpay-dark';
import { useAtom } from 'jotai';
import CoinbaseIcon from '@/components/icons/payment-gateways/coinbase';
import Uploader from '@/components/ui/forms/uploader';
import { manualPaymentAtom } from '@/components/cart/lib/checkout';

interface PaymentMethodInformation {
  name: string;
  value: PaymentGateway;
  icon: any;
  darkIcon?: any;
  component: React.FunctionComponent;
  width: number;
  height: number;
}

interface PaymentGroupOptionProps {
  payment: PaymentMethodInformation;
  theme?: string;
}

export const PaymentGroupOption: React.FC<PaymentGroupOptionProps> = ({
  payment: { name, darkIcon, value, icon },
  theme,
}) => {
  const { isDarkMode } = useIsDarkMode();
  return (
    <RadioGroup.Option value={value} key={value}>
      {({ checked }) => (
        <div
          className={cn(
            'relative flex h-[5.625rem] w-full cursor-pointer items-center justify-center rounded border bg-light-300 py-3 text-center dark:border-[#3A3A3A] dark:bg-[#303030]',
            checked && 'border-brand dark:border-brand-dark'
            // {
            //   'shadow-600 !border-gray-800 bg-light': theme === 'bw' && checked,
            // }
          )}
        >
          {icon || darkIcon ? (
            isDarkMode ? (
              darkIcon
            ) : (
              icon
            )
          ) : (
            <span className="text-heading text-xs font-semibold">{name}</span>
          )}
        </div>
      )}
    </RadioGroup.Option>
  );
};

const PaymentGrid: React.FC<{ className?: string; theme?: 'bw' }> = ({
  className,
  theme,
}) => {
  const [gateway, setGateway] = useAtom(paymentGatewayAtom);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { t } = useTranslation('common');
  const { settings, isLoading } = useSettings();

  const [defaultGateway, setDefaultGateway] = useState(
    settings?.defaultPaymentGateway?.toUpperCase() || ''
  );

  const [availableGateway, setAvailableGateway] = useState(
    settings?.paymentGateway || []
  );

  // FixME
  // @ts-ignore
  const AVAILABLE_PAYMENT_METHODS_MAP: Record<
    PaymentGateway,
    PaymentMethodInformation
  > = {
    STRIPE: {
      name: 'Stripe',
      value: PaymentGateway.STRIPE,
      icon: <StripeIcon />,
      darkIcon: <StripeIcon />,
      component: PaymentOnline,
      width: 40,
      height: 28,
    },
    PAYPAL: {
      name: 'Paypal',
      value: PaymentGateway.PAYPAL,
      icon: <PayPalIcon />,
      darkIcon: <PayPalDarkIcon />,
      component: PaymentOnline,
      width: 82,
      height: 21,
    },
    RAZORPAY: {
      name: 'RazorPay',
      value: PaymentGateway.RAZORPAY,
      icon: <RazorPayIcon />,
      darkIcon: <RazorPayDarkIcon />,
      component: PaymentOnline,
      width: 82,
      height: 40,
    },
    MOLLIE: {
      name: 'Mollie',
      value: PaymentGateway.MOLLIE,
      icon: <MollieIcon />,
      darkIcon: <MollieDarkIcon />,
      component: PaymentOnline,
      width: 100,
      height: 52,
    },
    PAYSTACK: {
      name: 'Paystack',
      value: PaymentGateway.PAYSTACK,
      icon: <PayStack />,
      darkIcon: <PayStackDark />,
      component: PaymentOnline,
      width: 100,
      height: 52,
    },
    BITPAY: {
      name: 'Bitpay',
      value: PaymentGateway.BITPAY,
      icon: <BitpayIcon />,
      darkIcon: <BitpayDarkIcon />,
      component: PaymentOnline,
      width: 100,
      height: 52,
    },
    COINBASE: {
      name: 'Coinbase',
      value: PaymentGateway.COINBASE,
      icon: <CoinbaseIcon className="w-32" />,
      darkIcon: <CoinbaseIcon className="w-32" />,
      component: PaymentOnline,
      width: 100,
      height: 52,
    },
    MANUAL_PAYMENT: {
      name: 'Manual Payment',
      value: PaymentGateway.MANUAL_PAYMENT,
      icon: null,
      darkIcon: null,
      component: PaymentOnline,
      width: 100,
      height: 52,
    },
  };

  useEffect(() => {
    if (settings && availableGateway) {
      setGateway(
        settings?.defaultPaymentGateway?.toUpperCase() as PaymentGateway
      );
    }
  }, [isLoading, defaultGateway, availableGateway]);

  const PaymentMethod = AVAILABLE_PAYMENT_METHODS_MAP[gateway];
  const Component = PaymentMethod?.component ?? PaymentOnline;
  return (
    <div className={className}>
      {errorMessage ? (
        <Alert
          message={t(`common:${errorMessage}`)}
          variant="error"
          closeable={true}
          className="mt-5"
          onClose={() => setErrorMessage(null)}
        />
      ) : null}

      <RadioGroup value={gateway} onChange={setGateway}>
        <RadioGroup.Label className="mb-5 block text-13px font-medium dark:text-white">
          {t('text-choose-payment')}
        </RadioGroup.Label>

        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3">
          {settings?.useEnableGateway &&
            availableGateway &&
            availableGateway.map((gateway: any, index: any) => {
              return (
                <Fragment key={index}>
                  <PaymentGroupOption
                    theme={theme}
                    payment={
                      AVAILABLE_PAYMENT_METHODS_MAP[
                        gateway?.name.toUpperCase() as PaymentGateway
                      ]
                    }
                  />
                </Fragment>
              );
            })}
          {/* {settings?.paymentGateway && (
            <PaymentGroupOption
              theme={theme}
              payment={
                AVAILABLE_PAYMENT_METHODS_MAP[
                  settings?.paymentGateway?.toUpperCase() as PaymentGateway
                ]
              }
            />
          )} */}
        </div>
      </RadioGroup>
      {/* <div className="mb-5">
        <Component />
      </div> */}
      {gateway === PaymentGateway.MANUAL_PAYMENT && <ManualPaymentFields />}
    </div>
  );
};

export default PaymentGrid;

function CopyableNumber({ label, number, color }: { label: string; number: string; color: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!number) return;
    navigator.clipboard.writeText(number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!number) return null;

  return (
    <div className="flex items-center justify-between rounded-lg border border-light-400 bg-light-200 p-3 shadow-sm transition-all hover:border-brand dark:border-dark-500 dark:bg-dark-300 dark:hover:border-brand-dark">
      <div className="flex items-center space-x-3 rtl:space-x-reverse">
        <span 
          style={{ backgroundColor: color }}
          className="px-2.5 py-1 text-xs font-bold rounded-md uppercase tracking-wider text-white select-none shadow-sm"
        >
          {label}
        </span>
        <span className="font-semibold text-dark-800 dark:text-light-800 text-sm tracking-wide">
          {number}
        </span>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        className={cn(
          "flex items-center space-x-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all duration-300 shadow-sm",
          copied
            ? "bg-emerald-500 text-white dark:bg-emerald-600"
            : "bg-light-400 text-dark-600 hover:bg-brand hover:text-white dark:bg-dark-600 dark:text-light-400 dark:hover:bg-brand-dark dark:hover:text-white"
        )}
      >
        {copied ? (
          <>
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>Copied</span>
          </>
        ) : (
          <>
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            <span>Copy</span>
          </>
        )}
      </button>
    </div>
  );
}

function ManualPaymentFields() {
  const { settings } = useSettings();
  const [
    {
      manual_payment_transaction_id,
      manual_payment_proof,
      manual_payment_note,
    },
    setManualPayment,
  ] = useAtom(manualPaymentAtom);

  const options = settings?.options;
  const hasManualPaymentDetails =
    options?.manualPaymentDescription ||
    options?.bkashNumber ||
    options?.nagadNumber ||
    options?.rocketNumber;

  return (
    <div className="mb-5 space-y-4 rounded border border-light-400 p-4 text-sm dark:border-dark-400">
      {hasManualPaymentDetails && (
        <div className="mb-6 rounded-lg bg-light-100 p-5 dark:bg-dark-250 border border-light-300 dark:border-dark-450 space-y-4">
          <h4 className="text-sm font-bold text-dark-800 dark:text-light-100 border-b border-light-300 dark:border-dark-400 pb-2">
            Manual Payment Instructions
          </h4>
          {options?.manualPaymentDescription && (
            <p className="text-xs text-dark-600 dark:text-light-400 whitespace-pre-line leading-relaxed">
              {options.manualPaymentDescription}
            </p>
          )}
          <div className="space-y-3">
            {options?.bkashNumber && (
              <CopyableNumber label="bKash" number={options.bkashNumber} color="#E2136E" />
            )}
            {options?.nagadNumber && (
              <CopyableNumber label="Nagad" number={options.nagadNumber} color="#F7941D" />
            )}
            {options?.rocketNumber && (
              <CopyableNumber label="Rocket" number={options.rocketNumber} color="#8C288E" />
            )}
          </div>
        </div>
      )}

      <div>
        <label className="mb-2 block font-medium text-dark dark:text-light">
          Transaction ID
        </label>
        <input
          value={manual_payment_transaction_id}
          onChange={(event) =>
            setManualPayment({
              manual_payment_transaction_id: event.target.value,
            })
          }
          className="h-11 w-full rounded border border-light-500 bg-transparent px-4 text-dark outline-none focus:border-brand dark:border-dark-600 dark:text-light"
          placeholder="Enter your transaction ID"
        />
      </div>
      <div>
        <label className="mb-2 block font-medium text-dark dark:text-light">
          Payment proof
        </label>
        <Uploader
          multiple={false}
          value={manual_payment_proof}
          onChange={(value: any) =>
            setManualPayment({ manual_payment_proof: value })
          }
        />
      </div>
      <div>
        <label className="mb-2 block font-medium text-dark dark:text-light">
          Note
        </label>
        <textarea
          value={manual_payment_note}
          onChange={(event) =>
            setManualPayment({ manual_payment_note: event.target.value })
          }
          className="min-h-[88px] w-full rounded border border-light-500 bg-transparent px-4 py-3 text-dark outline-none focus:border-brand dark:border-dark-600 dark:text-light"
          placeholder="Optional payment note"
        />
      </div>
    </div>
  );
}
