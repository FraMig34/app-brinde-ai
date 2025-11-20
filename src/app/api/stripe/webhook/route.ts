import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';

// Webhook para processar eventos do Stripe de forma SEGURA
export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Assinatura ausente' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    // Verificar assinatura do webhook (SEGURANÇA CRÍTICA)
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error('Erro na verificação do webhook:', error);
    return NextResponse.json(
      { error: 'Assinatura inválida' },
      { status: 400 }
    );
  }

  // Processar eventos
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const customerId = session.customer as string;

        if (userId) {
          // Aqui você atualizaria o banco de dados do usuário
          console.log(`✅ Pagamento confirmado para usuário ${userId}`);
          console.log(`Customer ID: ${customerId}`);
          
          // TODO: Atualizar status premium no banco de dados
          // await updateUserPremiumStatus(userId, true, customerId);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;
        const status = subscription.status;

        if (userId) {
          console.log(`🔄 Assinatura atualizada para usuário ${userId}: ${status}`);
          
          // TODO: Atualizar status da assinatura no banco
          // await updateSubscriptionStatus(userId, status);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;

        if (userId) {
          console.log(`❌ Assinatura cancelada para usuário ${userId}`);
          
          // TODO: Remover status premium do usuário
          // await updateUserPremiumStatus(userId, false);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        console.log(`⚠️ Falha no pagamento para customer ${customerId}`);
        
        // TODO: Notificar usuário sobre falha no pagamento
        // await notifyPaymentFailure(customerId);
        break;
      }

      default:
        console.log(`Evento não tratado: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    return NextResponse.json(
      { error: 'Erro ao processar evento' },
      { status: 500 }
    );
  }
}
