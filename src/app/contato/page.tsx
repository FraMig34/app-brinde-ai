"use client";

import { useState } from "react";
import { Navigation } from "@/components/custom/navigation";
import { Footer } from "@/components/custom/footer";
import { Mail, MessageSquare, Send, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
    toast.success("Mensagem enviada com sucesso! Responderemos em breve.");

    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitted(false);
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <Navigation />
      
      <main className="max-w-5xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#00FF00]/10 rounded-2xl mb-6">
            <MessageSquare className="w-8 h-8 text-[#00FF00]" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Entre em Contato
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Tem alguma dúvida, sugestão ou feedback? Adoraríamos ouvir você!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <div className="w-12 h-12 bg-[#00FF00]/10 rounded-xl flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-[#00FF00]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Email</h3>
              <a 
                href="mailto:contato@brinde.ai"
                className="text-gray-400 hover:text-[#00FF00] transition-colors"
              >
                contato@brinde.ai
              </a>
            </div>

            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold mb-4">Horário de Atendimento</h3>
              <div className="space-y-2 text-gray-400">
                <p>Segunda - Sexta: 9h - 18h</p>
                <p>Sábado: 10h - 14h</p>
                <p>Domingo: Fechado</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#00FF00]/10 to-transparent rounded-2xl p-6 border border-[#00FF00]/20">
              <h3 className="text-xl font-bold mb-2">Resposta Rápida</h3>
              <p className="text-gray-400 text-sm">
                Geralmente respondemos em até 24 horas durante dias úteis.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white/5 rounded-2xl p-8 border border-white/10">
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      Nome
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF00]/50 focus:ring-2 focus:ring-[#00FF00]/20 transition-all"
                      placeholder="Seu nome"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF00]/50 focus:ring-2 focus:ring-[#00FF00]/20 transition-all"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                    Assunto
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF00]/50 focus:ring-2 focus:ring-[#00FF00]/20 transition-all"
                    placeholder="Como podemos ajudar?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Mensagem
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF00]/50 focus:ring-2 focus:ring-[#00FF00]/20 transition-all resize-none"
                    placeholder="Conte-nos mais sobre sua dúvida ou sugestão..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || isSubmitted}
                  className="w-full px-6 py-4 bg-[#00FF00] text-[#0D0D0D] rounded-xl font-bold text-lg hover:bg-[#00FF00]/90 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-[#0D0D0D]/20 border-t-[#0D0D0D] rounded-full animate-spin" />
                      Enviando...
                    </>
                  ) : isSubmitted ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Enviado!
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Enviar Mensagem
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
