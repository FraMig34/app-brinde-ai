import Stripe from 'stripe';

// Configuração segura do Stripe no servidor
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
  appInfo: {
    name: 'Brinde.AI',
    version: '1.0.0',
  },
});

// Produtos e preços
export const STRIPE_PRODUCTS = {
  PREMIUM_MONTHLY: {
    priceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PRICE_ID!,
    name: 'Premium Mensal',
    price: 19.90,
    interval: 'month' as const,
  },
  PREMIUM_YEARLY: {
    priceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_YEARLY_PRICE_ID!,
    name: 'Premium Anual',
    price: 199.90,
    interval: 'year' as const,
  },
} as const;

// Validação de assinatura
export async function validateSubscription(customerId: string): Promise<boolean> {
  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1,
    });

    return subscriptions.data.length > 0;
  } catch (error) {
    console.error('Erro ao validar assinatura:', error);
    return false;
  }
}

// Criar sessão de checkout segura
export async function createCheckoutSession(
  priceId: string,
  userId: string,
  userEmail: string,
  successUrl: string,
  cancelUrl: string
) {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: userEmail,
      metadata: {
        userId,
      },
      subscription_data: {
        metadata: {
          userId,
        },
      },
      // Segurança adicional
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      consent_collection: {
        terms_of_service: 'required',
      },
    });

    return session;
  } catch (error) {
    console.error('Erro ao criar sessão de checkout:', error);
    throw new Error('Falha ao criar sessão de pagamento');
  }
}

// Criar portal do cliente para gerenciar assinatura
export async function createCustomerPortalSession(
  customerId: string,
  returnUrl: string
) {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return session;
  } catch (error) {
    console.error('Erro ao criar portal do cliente:', error);
    throw new Error('Falha ao acessar portal de gerenciamento');
  }
}
