import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { image, userPreferences } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: "Imagem não fornecida" },
        { status: 400 }
      );
    }

    // Chamar OpenAI Vision API para identificação avançada
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `Você é um especialista em bebidas alcoólicas com conhecimento profundo sobre marcas, tipos, características e perfis de sabor.

Sua tarefa é analisar imagens de bebidas e fornecer informações EXTREMAMENTE DETALHADAS e PRECISAS sobre:

1. **Nome completo da bebida** (incluindo linha/variação específica)
2. **Marca** (fabricante)
3. **Tipo/Categoria** (Vodka, Whiskey, Rum, Gin, Licor, etc.)
4. **Teor alcoólico** (porcentagem exata se visível no rótulo)
5. **Perfil de sabor detalhado** (0-100 para cada característica):
   - sweetness (doçura)
   - citrus (notas cítricas)
   - bitter (amargor)
   - strong (intensidade alcoólica)
   - fruity (notas frutadas)
   - herbal (notas herbais/botânicas)
6. **Descrição profissional** (2-3 frases sobre características, notas de sabor e uso recomendado)

IMPORTANTE:
- Seja PRECISO na identificação da marca e nome
- Reconheça variações específicas (Ex: "Jack Daniel's Old No. 7" não é só "Jack Daniel's")
- Analise o rótulo cuidadosamente para identificar o tipo exato
- Base o perfil de sabor em conhecimento real sobre a bebida
- Se não conseguir identificar com certeza, indique isso claramente

Retorne APENAS um objeto JSON válido no seguinte formato:
{
  "name": "Nome completo da bebida",
  "brand": "Marca",
  "type": "Tipo específico",
  "alcoholContent": número,
  "tasteProfile": {
    "sweetness": número 0-100,
    "citrus": número 0-100,
    "bitter": número 0-100,
    "strong": número 0-100,
    "fruity": número 0-100,
    "herbal": número 0-100
  },
  "description": "Descrição profissional detalhada",
  "confidence": número 0-100
}`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Identifique esta bebida com o máximo de precisão possível. Analise o rótulo, marca, tipo e forneça um perfil de sabor detalhado baseado em conhecimento real sobre a bebida.

Preferências do usuário para contexto:
- Doçura preferida: ${userPreferences?.sweetness || 50}%
- Cítrico preferido: ${userPreferences?.citrus || 50}%
- Amargo preferido: ${userPreferences?.bitter || 50}%
- Forte preferido: ${userPreferences?.strong || 50}%

Retorne apenas o JSON com as informações da bebida.`,
              },
              {
                type: "image_url",
                image_url: {
                  url: image,
                  detail: "high"
                },
              },
            ],
          },
        ],
        max_tokens: 1000,
        temperature: 0.3, // Baixa temperatura para respostas mais precisas
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error("Erro OpenAI:", errorData);
      throw new Error("Falha na identificação com OpenAI");
    }

    const data = await openaiResponse.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error("Resposta vazia da OpenAI");
    }

    // Extrair JSON da resposta
    let drinkInfo;
    try {
      // Tentar parsear diretamente
      drinkInfo = JSON.parse(content);
    } catch {
      // Se falhar, tentar extrair JSON de markdown
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```([\s\S]*?)```/);
      if (jsonMatch) {
        drinkInfo = JSON.parse(jsonMatch[1]);
      } else {
        // Última tentativa: procurar por objeto JSON no texto
        const objectMatch = content.match(/\{[\s\S]*\}/);
        if (objectMatch) {
          drinkInfo = JSON.parse(objectMatch[0]);
        } else {
          throw new Error("Não foi possível extrair JSON da resposta");
        }
      }
    }

    // Validar estrutura da resposta
    if (!drinkInfo.name || !drinkInfo.brand || !drinkInfo.type) {
      throw new Error("Resposta incompleta da IA");
    }

    // Garantir que todos os campos existam com valores padrão se necessário
    const validatedDrink = {
      name: drinkInfo.name,
      brand: drinkInfo.brand,
      type: drinkInfo.type,
      alcoholContent: drinkInfo.alcoholContent || 40,
      tasteProfile: {
        sweetness: drinkInfo.tasteProfile?.sweetness || 50,
        citrus: drinkInfo.tasteProfile?.citrus || 50,
        bitter: drinkInfo.tasteProfile?.bitter || 50,
        strong: drinkInfo.tasteProfile?.strong || 70,
        fruity: drinkInfo.tasteProfile?.fruity || 30,
        herbal: drinkInfo.tasteProfile?.herbal || 30,
      },
      description: drinkInfo.description || "Bebida identificada com sucesso.",
      confidence: drinkInfo.confidence || 85,
    };

    return NextResponse.json(validatedDrink);
  } catch (error) {
    console.error("Erro ao identificar bebida:", error);
    return NextResponse.json(
      { 
        error: "Erro ao processar imagem",
        details: error instanceof Error ? error.message : "Erro desconhecido"
      },
      { status: 500 }
    );
  }
}
