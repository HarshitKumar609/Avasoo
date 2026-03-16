// CheckoutForm.jsx
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const InnerForm = ({ onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleConfirm = async () => {
    if (!stripe || !elements) return;

    const result = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (result.error) {
      alert(result.error.message);
    } else if (result.paymentIntent.status === "succeeded") {
      onSuccess();
    }
  };

  return (
    <>
      <PaymentElement />
      <button
        onClick={handleConfirm}
        className="mt-4 w-full bg-green-600 text-white py-2 rounded"
      >
        Pay Securely
      </button>
    </>
  );
};

const CheckoutForm = ({ clientSecret, onSuccess }) => (
  <Elements stripe={stripePromise} options={{ clientSecret }}>
    <InnerForm onSuccess={onSuccess} />
  </Elements>
);

export default CheckoutForm;
