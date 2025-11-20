"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, X, Check, RotateCcw, Loader2, AlertCircle, Sparkles } from "lucide-react";
import { aiDrinkIdentifier } from "@/lib/ai-drink-identifier";
import { monitoring } from "@/lib/monitoring";

interface DrinkCameraCaptureProps {
  onDrinkConfirmed: (drinkName: string) => void;
  onClose: () => void;
}

export function DrinkCameraCapture({ onDrinkConfirmed, onClose }: DrinkCameraCaptureProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [identifiedDrink, setIdentifiedDrink] = useState<{
    name: string;
    brand?: string;
    type: string;
    confidence: number;
    description?: string;
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [processingTime, setProcessingTime] = useState<number>(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    startCamera();
    monitoring.logInfo('DrinkCameraCapture montado');
    
    return () => {
      stopCamera();
      monitoring.logInfo('DrinkCameraCapture desmontado');
    };
  }, []);

  const startCamera = async () => {
    try {
      monitoring.logInfo('Iniciando câmera');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: 1280, height: 720 },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError(null);
      monitoring.logSuccess('Câmera iniciada com sucesso');
    } catch (err: any) {
      monitoring.logError('Erro ao acessar câmera', { error: err.message });
      setError("Não foi possível acessar a câmera. Verifique as permissões.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      monitoring.logInfo('Câmera parada');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    monitoring.logInfo('Capturando foto');

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/jpeg", 0.8);
    setCapturedImage(imageData);
    stopCamera();
    
    monitoring.logSuccess('Foto capturada', {
      width: canvas.width,
      height: canvas.height,
    });

    analyzeImage(imageData);
  };

  const analyzeImage = async (imageData: string) => {
    setIsAnalyzing(true);
    setError(null);

    monitoring.logInfo('Iniciando análise de imagem com IA');

    try {
      // Extrair base64 da imagem
      const base64Image = imageData.split(',')[1];

      // Usar o novo sistema de IA
      const result = await aiDrinkIdentifier.identifyDrink(base64Image);

      setProcessingTime(result.processingTime);

      if (!result.success || !result.drink) {
        throw new Error(result.error || 'Não foi possível identificar a bebida');
      }

      const drink = result.drink;

      // Verificar confiança mínima
      if (drink.confidence < 0.3) {
        monitoring.logWarning('Confiança baixa na identificação', {
          confidence: drink.confidence,
          drink: drink.name,
        });
        setError(`Identificação incerta (${Math.round(drink.confidence * 100)}% de confiança). Tente uma foto mais clara.`);
        return;
      }

      setIdentifiedDrink(drink);
      setShowConfirmation(true);

      monitoring.logSuccess('Bebida identificada com sucesso', {
        drink: drink.name,
        confidence: drink.confidence,
        processingTime: result.processingTime,
      });
    } catch (err: any) {
      monitoring.logError('Erro ao analisar imagem', { error: err.message });
      setError(err.message || "Não foi possível identificar a bebida. Tente novamente.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConfirm = () => {
    if (identifiedDrink) {
      const drinkName = identifiedDrink.brand 
        ? `${identifiedDrink.brand} ${identifiedDrink.name}`
        : identifiedDrink.name;

      monitoring.logSuccess('Bebida confirmada pelo usuário', {
        drink: drinkName,
        confidence: identifiedDrink.confidence,
      });

      onDrinkConfirmed(drinkName);
      onClose();
    }
  };

  const handleRetry = () => {
    monitoring.logInfo('Usuário solicitou nova tentativa');
    setCapturedImage(null);
    setIdentifiedDrink(null);
    setShowConfirmation(false);
    setError(null);
    setProcessingTime(0);
    startCamera();
  };

  const handleManualInput = () => {
    const drinkName = prompt("Digite o nome da bebida manualmente:");
    if (drinkName && drinkName.trim()) {
      monitoring.logInfo('Bebida adicionada manualmente', { drink: drinkName });
      onDrinkConfirmed(drinkName.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
      <div className="relative w-full max-w-2xl bg-[#1A1A1A] rounded-2xl overflow-hidden border border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#00FF00]" />
            <h3 className="text-xl font-bold">Identificar Bebida com IA</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera/Image View */}
        <div className="relative aspect-[4/3] bg-black">
          {!capturedImage ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              
              {/* Bottle Silhouette Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <svg
                  viewBox="0 0 200 400"
                  className="w-32 h-64 opacity-30"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                >
                  {/* Bottle neck */}
                  <rect x="75" y="20" width="50" height="80" rx="5" />
                  {/* Bottle body */}
                  <path d="M 60 100 L 60 350 Q 60 370 80 370 L 120 370 Q 140 370 140 350 L 140 100 Z" />
                  {/* Cap */}
                  <rect x="70" y="10" width="60" height="15" rx="3" />
                </svg>
              </div>

              {/* Guide Text */}
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <div className="inline-block px-4 py-2 bg-black/70 rounded-lg backdrop-blur-sm">
                  <p className="text-sm text-white font-medium">
                    Posicione a garrafa dentro da silhueta
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    IA avançada com GPT-4 Vision
                  </p>
                </div>
              </div>
            </>
          ) : (
            <img
              src={capturedImage}
              alt="Bebida capturada"
              className="w-full h-full object-cover"
            />
          )}

          {/* Hidden canvas for capture */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-500/10 border-t border-red-500/30">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-400">{error}</p>
                <button
                  onClick={handleManualInput}
                  className="text-xs text-red-300 hover:text-red-200 underline mt-1"
                >
                  Adicionar manualmente
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Analyzing State */}
        {isAnalyzing && (
          <div className="p-6 border-t border-white/10">
            <div className="flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#00FF00]" />
              <div className="text-center">
                <p className="text-gray-300 font-medium">Identificando bebida com IA...</p>
                <p className="text-xs text-gray-500 mt-1">Usando GPT-4 Vision para análise precisa</p>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation */}
        {showConfirmation && identifiedDrink && !isAnalyzing && (
          <div className="p-6 border-t border-white/10 space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-2">Identificamos:</p>
              <p className="text-2xl font-bold text-[#00FF00]">
                {identifiedDrink.brand && `${identifiedDrink.brand} `}
                {identifiedDrink.name}
              </p>
              <p className="text-sm text-gray-400 mt-1">{identifiedDrink.type}</p>
              
              {identifiedDrink.description && (
                <p className="text-xs text-gray-500 mt-2 max-w-md mx-auto">
                  {identifiedDrink.description}
                </p>
              )}

              {/* Confidence and Processing Time */}
              <div className="flex items-center justify-center gap-4 mt-3">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#00FF00]" />
                  <span className="text-xs text-gray-400">
                    {Math.round(identifiedDrink.confidence * 100)}% confiança
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                  <span className="text-xs text-gray-400">
                    {(processingTime / 1000).toFixed(1)}s
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-center text-gray-300 mb-4">
                Esta é a bebida correta?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleRetry}
                  className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Não, tentar novamente
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 px-4 py-3 bg-[#00FF00] text-[#0D0D0D] hover:bg-[#00FF00]/90 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Sim, confirmar
                </button>
              </div>
              
              <button
                onClick={handleManualInput}
                className="w-full mt-2 text-xs text-gray-400 hover:text-gray-300 underline"
              >
                Ou adicionar manualmente
              </button>
            </div>
          </div>
        )}

        {/* Capture Button */}
        {!capturedImage && !isAnalyzing && stream && (
          <div className="p-6 border-t border-white/10">
            <button
              onClick={capturePhoto}
              className="w-full px-6 py-4 bg-[#00FF00] text-[#0D0D0D] rounded-xl font-bold hover:bg-[#00FF00]/90 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Camera className="w-5 h-5" />
              Capturar Foto
            </button>
            <button
              onClick={handleManualInput}
              className="w-full mt-2 text-sm text-gray-400 hover:text-gray-300 underline"
            >
              Adicionar manualmente sem foto
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
