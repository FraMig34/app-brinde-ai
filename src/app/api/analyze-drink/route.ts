import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface DrinkAnalysis {
  name: string;
  brand: string;
  type: string;
  alcoholContent: number;
  volume: number;
  confidence: number;
  tasteProfile: {
    sweetness: number;
    bitterness: number;
    citrus: number;
    strength: number;
    smoothness: number;
  };
  flavorNotes: string[];
  category: string;
  description: string;
  pairingRecommendations: string[];
}

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: "Imagem não fornecida" },
        { status: 400 }
      );
    }

    // Prompt avançado para análise detalhada de bebidas
    const analysisPrompt = `Você é um sommelier e especialista em bebidas alcoólicas com conhecimento profundo sobre marcas, sabores e perfis de paladar.

Analise a imagem da bebida e forneça uma análise COMPLETA e DETALHADA no seguinte formato JSON:

{
  "name": "Nome completo da bebida (ex: Absolut Vodka Original)",
  "brand": "Marca (ex: Absolut)",
  "type": "Tipo específico (vodka/whisky/rum/gin/cerveja/vinho/licor/tequila/cachaça/outro)",
  "alcoholContent": número (teor alcoólico em %, ex: 40),
  "volume": número (volume em ml, estimado pelo tamanho da garrafa - 50/275/330/350/500/700/750/1000),
  "confidence": número de 0 a 100 (confiança na identificação),
  "tasteProfile": {
    "sweetness": número de 0 a 100 (doçura - 0=seco, 100=muito doce),
    "bitterness": número de 0 a 100 (amargor - 0=suave, 100=muito amargo),
    "citrus": número de 0 a 100 (notas cítricas - 0=nenhuma, 100=muito cítrico),
    "strength": número de 0 a 100 (força/intensidade - baseado no teor alcoólico e perfil),
    "smoothness": número de 0 a 100 (suavidade - 0=áspero, 100=muito suave)
  },
  "flavorNotes": ["nota1", "nota2", "nota3"] (principais notas de sabor - ex: ["baunilha", "carvalho", "caramelo"]),
  "category": "categoria premium/standard/budget",
  "description": "Descrição detalhada do perfil de sabor e características da bebida em 2-3 frases",
  "pairingRecommendations": ["sugestão1", "sugestão2", "sugestão3"] (com que combina bem)
}

INSTRUÇÕES CRÍTICAS:
1. Se conseguir identificar claramente a bebida, forneça dados PRECISOS e REAIS da marca
2. Analise rótulo, formato da garrafa, cores, logotipos para identificação
3. Para bebidas conhecidas, use o perfil de sabor REAL documentado
4. Se não conseguir identificar com confiança >60%, retorne confidence baixo e dados genéricos
5. Para cervejas, considere se é Lager/IPA/Stout/Pilsen e ajuste perfil
6. Para vinhos, considere se é tinto/branco/rosé e uva
7. Para whisky, considere se é bourbon/scotch/irlandês
8. SEMPRE retorne JSON válido, sem texto adicional

Exemplos de perfis reais:
- Absolut Vodka: sweetness:5, bitterness:10, citrus:15, strength:75, smoothness:85
- Jack Daniel's: sweetness:45, bitterness:20, citrus:5, strength:70, smoothness:70
- Heineken: sweetness:15, bitterness:40, citrus:20, strength:25, smoothness:60
- Johnnie Walker Red: sweetness:30, bitterness:35, citrus:10, strength:75, smoothness:55

Agora analise a bebida na imagem:`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: analysisPrompt,
            },
            {
              type: "image_url",
              image_url: {
                url: image,
                detail: "high", // Alta resolução para melhor identificação
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
      temperature: 0.3, // Baixa temperatura para respostas mais consistentes
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content?.trim();
    
    if (!content) {
      throw new Error("Resposta vazia da API");
    }

    let drinkAnalysis: DrinkAnalysis;
    
    try {
      drinkAnalysis = JSON.parse(content);
    } catch (parseError) {
      console.error("Erro ao parsear JSON:", content);
      throw new Error("Formato de resposta inválido");
    }

    // Validação e fallback para dados obrigatórios
    if (!drinkAnalysis.name || drinkAnalysis.confidence < 30) {
      return NextResponse.json({
        error: "Não foi possível identificar a bebida com confiança suficiente",
        suggestion: "Tente tirar uma foto mais clara do rótulo da bebida",
        confidence: drinkAnalysis.confidence || 0,
      }, { status: 400 });
    }

    // Garantir que todos os campos existam
    const validatedAnalysis: DrinkAnalysis = {
      name: drinkAnalysis.name || "Bebida não identificada",
      brand: drinkAnalysis.brand || "Marca desconhecida",
      type: drinkAnalysis.type || "outro",
      alcoholContent: drinkAnalysis.alcoholContent || 0,
      volume: drinkAnalysis.volume || 750,
      confidence: drinkAnalysis.confidence || 0,
      tasteProfile: {
        sweetness: drinkAnalysis.tasteProfile?.sweetness || 50,
        bitterness: drinkAnalysis.tasteProfile?.bitterness || 50,
        citrus: drinkAnalysis.tasteProfile?.citrus || 50,
        strength: drinkAnalysis.tasteProfile?.strength || 50,
        smoothness: drinkAnalysis.tasteProfile?.smoothness || 50,
      },
      flavorNotes: drinkAnalysis.flavorNotes || [],
      category: drinkAnalysis.category || "standard",
      description: drinkAnalysis.description || "Bebida alcoólica",
      pairingRecommendations: drinkAnalysis.pairingRecommendations || [],
    };

    return NextResponse.json({ 
      success: true,
      analysis: validatedAnalysis 
    });

  } catch (error) {
    console.error("Erro ao analisar bebida:", error);
    return NextResponse.json(
      { 
        error: "Erro ao processar imagem",
        details: error instanceof Error ? error.message : "Erro desconhecido"
      },
      { status: 500 }
    );
  }
}
