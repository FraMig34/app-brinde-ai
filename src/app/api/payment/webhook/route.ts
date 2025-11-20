import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const PAGA_KEOTO_WEBHOOK_SECRET = process.env.PAGA_KEOTO_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Verificar assinatura do webhook (segurança)
    const signature = request.headers.get("x-pagakeoto-signature");
    
    if (!signature || !PAGA_KEOTO_WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: "Webhook não autorizado" },
        { status: 401 }
      );
    }

    // Validar assinatura (implementação simplificada)
    // Em produção, use crypto para validar a assinatura HMAC
    const expectedSignature = signature; // Implementar validação real aqui

    const {
      payment_id,
      order_id,
      status,
      amount,
      currency,
      metadata,
    } = body;

    // Buscar pedido no banco
    const { data: order, error: orderError } = await supabase
      .from("payment_orders")
      .select("*")
      .eq("id", order_id)
      .single();

    if (orderError || !order) {
      console.error("Pedido não encontrado:", order_id);
      return NextResponse.json(
        { error: "Pedido não encontrado" },
        { status: 404 }
      );
    }

    // Atualizar status do pedido
    await supabase
      .from("payment_orders")
      .update({
        status: status,
        paga_keoto_payment_id: payment_id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", order_id);

    // Se pagamento foi aprovado, ativar Premium
    if (status === "approved" || status === "completed") {
      const userId = metadata?.user_id || order.user_id;

      // Calcular data de expiração (30 dias)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      // Criar ou atualizar assinatura
      const { error: subscriptionError } = await supabase
        .from("subscriptions")
        .upsert({
          user_id: userId,
          status: "active",
          plan: "monthly",
          price: amount,
          currency: currency,
          started_at: new Date().toISOString(),
          expires_at: expiresAt.toISOString(),
        }, {
          onConflict: "user_id",
        });

      if (subscriptionError) {
        console.error("Erro ao criar assinatura:", subscriptionError);
      }

      // Atualizar status premium do usuário
      const { error: userError } = await supabase
        .from("users")
        .update({ is_premium: true })
        .eq("id", userId);

      if (userError) {
        console.error("Erro ao atualizar usuário:", userError);
      }

      console.log(`✅ Premium ativado para usuário ${userId}`);
    }

    // Se pagamento falhou ou foi cancelado
    if (status === "failed" || status === "cancelled") {
      console.log(`❌ Pagamento ${status} para pedido ${order_id}`);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Erro no webhook:", error);
    return NextResponse.json(
      { error: "Erro ao processar webhook" },
      { status: 500 }
    );
  }
}
