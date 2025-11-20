import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Configurações do Paga Keoto
const PAGA_KEOTO_API_URL = process.env.PAGA_KEOTO_API_URL || "https://api.pagakeoto.com/v1";
const PAGA_KEOTO_API_KEY = process.env.PAGA_KEOTO_API_KEY;
const PAGA_KEOTO_MERCHANT_ID = process.env.PAGA_KEOTO_MERCHANT_ID;

export async function POST(request: NextRequest) {
  try {
    const { userId, email, region } = await request.json();

    if (!userId || !email || !region) {
      return NextResponse.json(
        { success: false, error: "Dados incompletos" },
        { status: 400 }
      );
    }

    // Verificar se as credenciais do Paga Keoto estão configuradas
    if (!PAGA_KEOTO_API_KEY || !PAGA_KEOTO_MERCHANT_ID) {
      return NextResponse.json(
        { success: false, error: "Configuração de pagamento incompleta" },
        { status: 500 }
      );
    }

    // Definir preço baseado na região
    const price = region === 'brasil' ? 19.90 : 4.99;
    const currency = region === 'brasil' ? 'BRL' : 'EUR';

    // Criar pedido no banco de dados
    const { data: order, error: orderError } = await supabase
      .from("payment_orders")
      .insert({
        user_id: userId,
        amount: price,
        currency: currency,
        status: "pending",
        region: region,
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error("Erro ao criar pedido:", orderError);
      return NextResponse.json(
        { success: false, error: "Erro ao criar pedido" },
        { status: 500 }
      );
    }

    // Criar pagamento no Paga Keoto
    const pagaKeotoPayload = {
      merchant_id: PAGA_KEOTO_MERCHANT_ID,
      order_id: order.id,
      amount: price,
      currency: currency,
      description: "Brinde.AI Premium - Assinatura Mensal",
      customer_email: email,
      customer_id: userId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
      webhook_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/webhook`,
      metadata: {
        user_id: userId,
        order_id: order.id,
        plan: "premium_monthly",
      },
    };

    const pagaKeotoResponse = await fetch(`${PAGA_KEOTO_API_URL}/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${PAGA_KEOTO_API_KEY}`,
      },
      body: JSON.stringify(pagaKeotoPayload),
    });

    if (!pagaKeotoResponse.ok) {
      const errorData = await pagaKeotoResponse.json();
      console.error("Erro do Paga Keoto:", errorData);
      
      // Atualizar status do pedido para erro
      await supabase
        .from("payment_orders")
        .update({ status: "failed" })
        .eq("id", order.id);

      return NextResponse.json(
        { success: false, error: "Erro ao processar pagamento" },
        { status: 500 }
      );
    }

    const pagaKeotoData = await pagaKeotoResponse.json();

    // Atualizar pedido com ID do Paga Keoto
    await supabase
      .from("payment_orders")
      .update({ 
        paga_keoto_payment_id: pagaKeotoData.payment_id,
        paga_keoto_data: pagaKeotoData,
      })
      .eq("id", order.id);

    return NextResponse.json({
      success: true,
      paymentUrl: pagaKeotoData.payment_url,
      orderId: order.id,
    });

  } catch (error) {
    console.error("Erro no processamento:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
