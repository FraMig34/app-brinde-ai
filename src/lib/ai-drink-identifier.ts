/**
 * Sistema Avançado de Identificação de Bebidas com IA
 * Usa OpenAI GPT-4 Vision para identificar bebidas com alta precisão
 */

import { monitoring } from './monitoring';

export interface DrinkIdentification {
  name: string;
  brand?: string;
  type: string;
  confidence: number;
  alcoholPercentage?: number;
  volume?: number;
  description?: string;
  suggestions?: string[];
}

export interface IdentificationResult {
  success: boolean;
  drink?: DrinkIdentification;
  error?: string;
  processingTime: number;
}

class AIdrinkIdentifier {
  private apiKey: string | null = null;
  private model = 'gpt-4o';
  private maxRetries = 3;

  constructor() {
    // API key será configurada via variável de ambiente
    this.apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || null;
  }

  /**
   * Identificar bebida a partir de uma imagem
   */
  async identifyDrink(imageBase64: string): Promise<IdentificationResult> {
    const startTime = performance.now();

    try {
      if (!this.apiKey) {
        throw new Error('API key da OpenAI não configurada');
      }

      monitoring.logInfo('Iniciando identificação de bebida com IA');

      const result = await this.callOpenAIVision(imageBase64);
      const processingTime = performance.now() - startTime;

      monitoring.logSuccess('Bebida identificada com sucesso', {
        drink: result.name,
        confidence: result.confidence,
        processingTime,
      });

      monitoring.logPerformance('ai_drink_identification', processingTime, {
        confidence: result.confidence,
      });

      return {
        success: true,
        drink: result,
        processingTime,
      };
    } catch (error: any) {
      const processingTime = performance.now() - startTime;
      
      monitoring.logError('Erro ao identificar bebida', {
        error: error.message,
        processingTime,
      });

      return {
        success: false,
        error: error.message || 'Erro desconhecido ao identificar bebida',
        processingTime,
      };
    }
  }

  /**
   * Chamar API da OpenAI Vision
   */
  private async callOpenAIVision(imageBase64: string, retryCount = 0): Promise<DrinkIdentification> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: `Você é um especialista em identificação de bebidas alcoólicas e não alcoólicas. 
Analise a imagem fornecida e identifique a bebida com o máximo de detalhes possível.

Retorne APENAS um JSON válido no seguinte formato (sem markdown, sem explicações):
{
  "name": "Nome completo da bebida",
  "brand": "Marca (se visível)",
  "type": "Tipo (cerveja, vinho, whisky, vodka, refrigerante, suco, etc)",
  "confidence": 0.95,
  "alcoholPercentage": 5.0,
  "volume": 350,
  "description": "Breve descrição da bebida",
  "suggestions": ["Sugestão 1", "Sugestão 2"]
}

IMPORTANTE:
- confidence deve ser um número entre 0 e 1
- alcoholPercentage é opcional (apenas para bebidas alcoólicas)
- volume em ml (opcional)
- Se não conseguir identificar com certeza, use confidence baixo (< 0.5)
- suggestions são bebidas similares ou alternativas`,
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Identifique esta bebida com o máximo de detalhes possível. Retorne apenas o JSON, sem markdown.',
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/jpeg;base64,${imageBase64}`,
                    detail: 'high',
                  },
                },
              ],
            },
          ],
          max_tokens: 500,
          temperature: 0.3, // Baixa temperatura para respostas mais precisas
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API retornou status ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error('Resposta vazia da API');
      }

      // Limpar markdown se presente
      let jsonContent = content.trim();
      if (jsonContent.startsWith('```json')) {
        jsonContent = jsonContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (jsonContent.startsWith('```')) {
        jsonContent = jsonContent.replace(/```\n?/g, '');
      }

      const result = JSON.parse(jsonContent);

      // Validar resultado
      if (!result.name || typeof result.confidence !== 'number') {
        throw new Error('Resposta da IA em formato inválido');
      }

      return result;
    } catch (error: any) {
      // Retry logic
      if (retryCount < this.maxRetries) {
        monitoring.logWarning(`Tentativa ${retryCount + 1} falhou, tentando novamente...`, {
          error: error.message,
        });
        await this.delay(1000 * (retryCount + 1)); // Backoff exponencial
        return this.callOpenAIVision(imageBase64, retryCount + 1);
      }

      throw error;
    }
  }

  /**
   * Identificar múltiplas bebidas em uma imagem
   */
  async identifyMultipleDrinks(imageBase64: string): Promise<IdentificationResult> {
    const startTime = performance.now();

    try {
      if (!this.apiKey) {
        throw new Error('API key da OpenAI não configurada');
      }

      monitoring.logInfo('Identificando múltiplas bebidas com IA');

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: `Você é um especialista em identificação de bebidas. 
Analise a imagem e identifique TODAS as bebidas visíveis.
Retorne um array JSON com todas as bebidas encontradas.`,
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Liste todas as bebidas visíveis nesta imagem. Retorne apenas um array JSON.',
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/jpeg;base64,${imageBase64}`,
                    detail: 'high',
                  },
                },
              ],
            },
          ],
          max_tokens: 1000,
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        throw new Error(`API retornou status ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      const drinks = JSON.parse(content);

      const processingTime = performance.now() - startTime;

      monitoring.logSuccess('Múltiplas bebidas identificadas', {
        count: drinks.length,
        processingTime,
      });

      return {
        success: true,
        drink: drinks[0], // Retorna a primeira bebida
        processingTime,
      };
    } catch (error: any) {
      const processingTime = performance.now() - startTime;
      
      monitoring.logError('Erro ao identificar múltiplas bebidas', {
        error: error.message,
        processingTime,
      });

      return {
        success: false,
        error: error.message,
        processingTime,
      };
    }
  }

  /**
   * Validar se a imagem contém uma bebida
   */
  async validateDrinkImage(imageBase64: string): Promise<{ isValid: boolean; reason?: string }> {
    try {
      if (!this.apiKey) {
        return { isValid: false, reason: 'API key não configurada' };
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'Você é um validador de imagens. Responda apenas "sim" ou "não" seguido de uma breve razão.',
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Esta imagem contém uma bebida (alcoólica ou não)? Responda apenas sim/não e o motivo.',
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/jpeg;base64,${imageBase64}`,
                    detail: 'low',
                  },
                },
              ],
            },
          ],
          max_tokens: 100,
          temperature: 0.1,
        }),
      });

      const data = await response.json();
      const content = data.choices[0]?.message?.content?.toLowerCase() || '';

      const isValid = content.includes('sim');
      const reason = content.replace(/sim|não/gi, '').trim();

      return { isValid, reason };
    } catch (error) {
      monitoring.logError('Erro ao validar imagem de bebida', { error });
      return { isValid: true, reason: 'Não foi possível validar, assumindo válido' };
    }
  }

  /**
   * Obter sugestões de bebidas similares
   */
  async getSimilarDrinks(drinkName: string): Promise<string[]> {
    try {
      if (!this.apiKey) {
        return [];
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: 'Você é um especialista em bebidas. Sugira bebidas similares.',
            },
            {
              role: 'user',
              content: `Liste 5 bebidas similares a "${drinkName}". Retorne apenas um array JSON com os nomes.`,
            },
          ],
          max_tokens: 200,
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      return JSON.parse(content);
    } catch (error) {
      monitoring.logError('Erro ao obter bebidas similares', { error });
      return [];
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Instância singleton
export const aiDrinkIdentifier = new AIdrinkIdentifier();
