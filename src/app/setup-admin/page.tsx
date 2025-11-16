'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CheckCircle, XCircle, Loader2, AlertCircle, Shield, RefreshCw, Mail } from 'lucide-react'

export default function SetupAdminPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string; details?: string } | null>(null)

  const adminEmail = 'ruylhaoprincipal@gmail.com'
  const adminPassword = 'Fra013Mig47'

  const resendConfirmationEmail = async () => {
    setLoading(true)
    setResult(null)

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: adminEmail
      })

      if (error) throw error

      setResult({
        success: true,
        message: '📧 EMAIL DE CONFIRMAÇÃO REENVIADO!',
        details: `Um novo email de confirmação foi enviado para ${adminEmail}.\n\nVerifique sua caixa de entrada e spam.\n\nDepois de confirmar o email, volte aqui e use o botão "Fazer Login como Admin".`
      })
    } catch (error: any) {
      setResult({
        success: false,
        message: '❌ Erro ao reenviar email',
        details: error.message || 'Verifique se o email está correto.'
      })
    } finally {
      setLoading(false)
    }
  }

  const loginAsAdmin = async () => {
    setLoading(true)
    setResult(null)

    try {
      // Tentar fazer login
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: adminEmail,
        password: adminPassword
      })

      // Tratar erro de email não confirmado
      if (loginError?.message.includes('Email not confirmed')) {
        setResult({
          success: false,
          message: '⚠️ EMAIL NÃO CONFIRMADO',
          details: `O email ${adminEmail} ainda não foi confirmado.\n\n🔧 SOLUÇÕES:\n\n1. RECOMENDADO: Desabilite a confirmação de email no Supabase:\n   • Acesse: https://supabase.com/dashboard\n   • Seu projeto → Authentication → Providers → Email\n   • Desmarque "Confirm email"\n   • Salve e tente fazer login novamente\n\n2. OU confirme o email:\n   • Verifique sua caixa de entrada e spam\n   • Clique no link de confirmação\n   • Use o botão "Reenviar Email de Confirmação" abaixo se necessário`
        })
        setLoading(false)
        return
      }

      // Tratar erro de credenciais inválidas
      if (loginError?.message.includes('Invalid login credentials')) {
        setResult({
          success: false,
          message: '❌ CREDENCIAIS INVÁLIDAS',
          details: `O email ou senha estão incorretos, ou o usuário não existe.\n\n🔧 SOLUÇÕES:\n\n1. Se é a primeira vez: Use o botão "Criar Novo Admin"\n\n2. Se esqueceu a senha: Use o botão "Resetar Senha do Admin"\n\n3. Se o usuário existe mas não consegue logar:\n   • Acesse: https://supabase.com/dashboard\n   • Authentication → Users\n   • Delete o usuário: ${adminEmail}\n   • Volte aqui e use "Criar Novo Admin"`
        })
        setLoading(false)
        return
      }

      if (loginError) throw loginError

      if (!loginData?.user) {
        throw new Error('Login falhou - usuário não encontrado')
      }

      // Atualizar/criar perfil com privilégios de admin
      const { error: upsertError } = await supabase
        .from('users')
        .upsert({
          id: loginData.user.id,
          email: adminEmail,
          name: 'Administrador',
          birth_year: 1990,
          region: 'brasil',
          is_premium: true,
          is_super_admin: true,
          role: 'admin',
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        })

      if (upsertError) {
        console.warn('Aviso ao atualizar perfil:', upsertError)
      }

      setResult({
        success: true,
        message: '✅ LOGIN REALIZADO COM SUCESSO!',
        details: `🎉 Você está logado como SUPER ADMINISTRADOR!\n\n✨ Privilégios ativados:\n• is_super_admin: true (dono do site)\n• is_premium: true (acesso total)\n• role: admin (função administrativa)\n\nVocê pode usar o sistema com TODOS os benefícios de administrador!`
      })
    } catch (error: any) {
      setResult({
        success: false,
        message: '❌ Erro no login',
        details: `${error.message}\n\nSe o problema persistir, delete o usuário no Supabase Dashboard e crie novamente.`
      })
    } finally {
      setLoading(false)
    }
  }

  const createAdminUser = async () => {
    setLoading(true)
    setResult(null)

    try {
      // Tentar criar novo usuário
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: adminEmail,
        password: adminPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/setup-admin`,
          data: {
            name: 'Administrador',
            birth_year: 1990,
            region: 'brasil',
            is_super_admin: true,
            role: 'admin'
          }
        }
      })

      // Se usuário já existe na tabela auth
      if (authError?.message.includes('already registered') || authError?.message.includes('User already registered')) {
        setResult({
          success: false,
          message: '⚠️ USUÁRIO JÁ EXISTE',
          details: `O email ${adminEmail} já está cadastrado no sistema de autenticação.\n\n🔧 ESCOLHA UMA OPÇÃO:\n\n1. Use o botão "Fazer Login como Admin" (se você sabe a senha)\n2. Use o botão "Resetar Senha do Admin" (para redefinir a senha)\n3. Delete o usuário no Supabase Dashboard:\n   • Acesse: https://supabase.com/dashboard\n   • Authentication → Users\n   • Delete: ${adminEmail}\n   • Volte aqui e tente novamente`
        })
        setLoading(false)
        return
      }

      if (authError) {
        throw new Error(`Erro ao criar usuário: ${authError.message}`)
      }

      if (!authData?.user) {
        throw new Error('Usuário não foi criado')
      }

      // Criar perfil na tabela users (ignorar se já existe)
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: adminEmail,
          name: 'Administrador',
          birth_year: 1990,
          region: 'brasil',
          is_premium: true,
          is_super_admin: true,
          role: 'admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      // Se o perfil já existe (código 23505), apenas atualizar
      if (profileError && profileError.code === '23505') {
        await supabase
          .from('users')
          .update({
            is_premium: true,
            is_super_admin: true,
            role: 'admin',
            updated_at: new Date().toISOString()
          })
          .eq('email', adminEmail)
      }

      // Verificar se precisa confirmar email
      if (authData.user && !authData.session) {
        setResult({
          success: false,
          message: '⚠️ USUÁRIO CRIADO - EMAIL NÃO CONFIRMADO',
          details: `O usuário foi criado com sucesso, mas o Supabase está configurado para exigir confirmação de email.\n\n🔧 SOLUÇÕES:\n\n1. RECOMENDADO: Desabilite a confirmação de email:\n   • Acesse: https://supabase.com/dashboard\n   • Seu projeto → Authentication → Providers → Email\n   • Desmarque "Confirm email"\n   • Salve e use o botão "Fazer Login como Admin"\n\n2. OU confirme o email:\n   • Verifique sua caixa de entrada: ${adminEmail}\n   • Clique no link de confirmação\n   • Use o botão "Reenviar Email de Confirmação" abaixo se necessário`
        })
        setLoading(false)
        return
      }

      // Se conseguiu criar e já tem sessão, está logado
      setResult({
        success: true,
        message: '✅ ADMIN CRIADO E LOGADO COM SUCESSO!',
        details: `🎉 Você agora é o SUPER ADMINISTRADOR do sistema!\n\n✨ Privilégios ativados:\n• is_super_admin: true (dono do site)\n• is_premium: true (acesso total)\n• role: admin (função administrativa)\n\nVocê está logado e pode usar o sistema com TODOS os benefícios!`
      })
    } catch (error: any) {
      setResult({
        success: false,
        message: '❌ Erro ao criar admin',
        details: error.message || 'Erro desconhecido. Verifique as configurações do Supabase.'
      })
    } finally {
      setLoading(false)
    }
  }

  const resetAdminPassword = async () => {
    setLoading(true)
    setResult(null)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(adminEmail, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) throw error

      setResult({
        success: true,
        message: '📧 EMAIL DE RESET ENVIADO!',
        details: `Um email foi enviado para ${adminEmail} com instruções para redefinir a senha.\n\nVerifique sua caixa de entrada e spam.\n\nDepois de redefinir a senha, volte aqui e use o botão "Fazer Login como Admin".`
      })
    } catch (error: any) {
      setResult({
        success: false,
        message: '❌ Erro ao enviar email de reset',
        details: error.message || 'Verifique se o email está correto e tente novamente.'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 bg-white/10 backdrop-blur-lg border-white/20">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-3">
            <Shield className="h-12 w-12 text-yellow-400" />
            <h1 className="text-4xl font-bold text-white">
              Setup Super Admin
            </h1>
          </div>
          
          <p className="text-gray-300 text-lg">
            Configure o perfil de SUPER ADMINISTRADOR com todos os privilégios do sistema.
          </p>

          <div className="bg-slate-800/50 rounded-lg p-6 text-left space-y-3">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-yellow-400" />
              Credenciais Admin:
            </h2>
            <p className="text-gray-300">
              <strong className="text-white">Email:</strong> ruylhaoprincipal@gmail.com
            </p>
            <p className="text-gray-300">
              <strong className="text-white">Senha:</strong> Fra013Mig47
            </p>
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-yellow-300 font-semibold mb-2">🔐 Privilégios de Super Admin:</p>
              <ul className="text-gray-300 space-y-1 ml-4">
                <li>✅ is_super_admin: true (dono do site)</li>
                <li>✅ is_premium: true (acesso total)</li>
                <li>✅ role: admin (função administrativa)</li>
                <li>✅ Acesso ilimitado a todas as funcionalidades</li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={createAdminUser}
              disabled={loading}
              size="lg"
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-6"
            >
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Shield className="mr-2 h-5 w-5" />
              )}
              Criar Novo Admin
            </Button>

            <Button
              onClick={loginAsAdmin}
              disabled={loading}
              size="lg"
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-6"
            >
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <CheckCircle className="mr-2 h-5 w-5" />
              )}
              Fazer Login como Admin
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={resetAdminPassword}
              disabled={loading}
              size="lg"
              variant="outline"
              className="w-full border-orange-500/50 text-orange-300 hover:bg-orange-500/20 font-semibold py-6"
            >
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-5 w-5" />
              )}
              🔄 Resetar Senha
            </Button>

            <Button
              onClick={resendConfirmationEmail}
              disabled={loading}
              size="lg"
              variant="outline"
              className="w-full border-blue-500/50 text-blue-300 hover:bg-blue-500/20 font-semibold py-6"
            >
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Mail className="mr-2 h-5 w-5" />
              )}
              📧 Reenviar Confirmação
            </Button>
          </div>

          {result && (
            <div
              className={`p-4 rounded-lg flex items-start gap-3 ${
                result.success
                  ? 'bg-green-500/20 border border-green-500/50'
                  : 'bg-red-500/20 border border-red-500/50'
              }`}
            >
              {result.success ? (
                <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="h-6 w-6 text-red-400 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1 text-left">
                <p className={`font-semibold ${result.success ? 'text-green-100' : 'text-red-100'}`}>
                  {result.message}
                </p>
                {result.details && (
                  <p className={`text-sm mt-2 whitespace-pre-line ${result.success ? 'text-green-200' : 'text-red-200'}`}>
                    {result.details}
                  </p>
                )}
                {result.success && (
                  <Button
                    onClick={() => window.location.href = '/'}
                    className="mt-4 bg-white/20 hover:bg-white/30"
                  >
                    ✨ Ir para o Sistema
                  </Button>
                )}
              </div>
            </div>
          )}

          <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-left text-sm text-blue-100">
              <p className="font-semibold mb-2">💡 Como usar:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong>Primeira vez?</strong> Use "Criar Novo Admin"</li>
                <li><strong>Já criou antes?</strong> Use "Fazer Login como Admin"</li>
                <li><strong>Esqueceu a senha?</strong> Use "Resetar Senha"</li>
                <li><strong>Email não confirmado?</strong> Use "Reenviar Confirmação"</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="text-left text-sm text-yellow-100">
              <p className="font-semibold mb-2">⚠️ PROBLEMA COMUM: "Email not confirmed"</p>
              <p className="mb-2">Se você receber este erro, o Supabase está exigindo confirmação de email.</p>
              <p className="font-semibold">SOLUÇÃO RECOMENDADA:</p>
              <ol className="list-decimal list-inside space-y-1 ml-2 mt-1">
                <li>Acesse: <a href="https://supabase.com/dashboard" target="_blank" className="underline">https://supabase.com/dashboard</a></li>
                <li>Seu projeto → Authentication → Providers → Email</li>
                <li>Desmarque "Confirm email"</li>
                <li>Salve e tente fazer login novamente</li>
              </ol>
            </div>
          </div>

          <div className="text-sm text-gray-400 space-y-2 pt-4 border-t border-white/10">
            <p className="flex items-center justify-center gap-2">
              <Shield className="h-4 w-4 text-yellow-400" />
              Esta é a conta de SUPER ADMINISTRADOR do sistema.
            </p>
            <p>
              ✅ Super Admin tem controle total e acesso ilimitado.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
