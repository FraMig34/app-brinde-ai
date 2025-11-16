import { supabase } from './supabase'

/**
 * Script para criar o usuário administrador do sistema
 * Email: ruylhaoprincipal@gmail.com
 * Senha: Fra013Mig47
 */
export async function createAdminUser() {
  try {
    console.log('🔐 Criando usuário administrador...')

    // 1. Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'ruylhaoprincipal@gmail.com',
      password: 'Fra013Mig47',
      options: {
        data: {
          name: 'Administrador',
          birth_year: 1990,
          region: 'BR'
        }
      }
    })

    if (authError) {
      console.error('❌ Erro ao criar usuário no Auth:', authError.message)
      throw authError
    }

    if (!authData.user) {
      throw new Error('Usuário não foi criado')
    }

    console.log('✅ Usuário criado no Auth:', authData.user.id)

    // 2. Criar perfil na tabela public.users
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: 'ruylhaoprincipal@gmail.com',
        name: 'Administrador',
        birth_year: 1990,
        region: 'BR',
        is_premium: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

    if (profileError) {
      console.error('❌ Erro ao criar perfil:', profileError.message)
      throw profileError
    }

    console.log('✅ Perfil criado com sucesso!')
    console.log('🎉 Usuário administrador configurado!')
    console.log('📧 Email: ruylhaoprincipal@gmail.com')
    console.log('🔑 Senha: Fra013Mig47')

    return {
      success: true,
      userId: authData.user.id,
      message: 'Usuário administrador criado com sucesso!'
    }
  } catch (error: any) {
    console.error('❌ Erro ao criar usuário admin:', error.message)
    return {
      success: false,
      error: error.message,
      message: 'Erro ao criar usuário administrador'
    }
  }
}

/**
 * Verificar se o usuário admin já existe
 */
export async function checkAdminExists() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, name, is_premium')
      .eq('email', 'ruylhaoprincipal@gmail.com')
      .single()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    return {
      exists: !!data,
      user: data
    }
  } catch (error: any) {
    console.error('Erro ao verificar admin:', error.message)
    return {
      exists: false,
      user: null
    }
  }
}
