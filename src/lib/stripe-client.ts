"use client";

import { loadStripe } from '@stripe/stripe-js';

// Inicializar Stripe no cliente de forma segura
let stripePromise: ReturnType<typeof loadStripe>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
    );
  }
  return stripePromise;
};
