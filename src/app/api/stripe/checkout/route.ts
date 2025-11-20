import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe';
import { headers } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { priceId, userId, userEmail } = body;

    // Validação de entrada
    if (!priceId || !userId || !userEmail) {
      return NextResponse.json(
        { error: 'Dados incompletos' },
        { status: 400 }
      );
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    // URLs de retorno
    const headersList = await headers();
    const origin = headersList.get('origin') || 'http://localhost:3000';
    const successUrl = `${origin}/premium/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/premium`;

    // Criar sessão de checkout
    const session = await createCheckoutSession(
      priceId,
      userId,
      userEmail,
      successUrl,
      cancelUrl
    );

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Erro no checkout:', error);
    return NextResponse.json(
      { error: 'Erro ao processar pagamento' },
      { status: 500 }
    );
  }
}
