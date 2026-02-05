# 🚀 Guia Rápido: Configurar Supabase (5 minutos)

Siga estes passos para configurar tudo no Supabase Dashboard.

---

## 📋 Passo 1: Aplicar Migration (Criar Tabela)

### 1.1 Abrir SQL Editor

**Link direto:** https://supabase.com/dashboard/project/bbcdqjbablugivrfcdkp/sql/new

### 1.2 Copiar e Colar SQL

Copie TODO o código abaixo e cole no SQL Editor:

```sql
-- Migration: Add site_settings table for admin theme customization
-- Created: 2026-02-05

-- Create site_settings table
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS policies
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read site settings (for theme colors)
CREATE POLICY "Anyone can read site settings"
  ON public.site_settings
  FOR SELECT
  USING (true);

-- Only admins can insert/update/delete site settings
CREATE POLICY "Only admins can modify site settings"
  ON public.site_settings
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Insert default theme colors
INSERT INTO public.site_settings (setting_key, setting_value)
VALUES 
  ('theme_colors', '{
    "primary": "#8B5CF6",
    "secondary": "#EC4899",
    "accent": "#F59E0B",
    "background": "#0F172A",
    "foreground": "#F8FAFC"
  }'::jsonb)
ON CONFLICT (setting_key) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_site_settings_updated_at
    BEFORE UPDATE ON public.site_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comment
COMMENT ON TABLE public.site_settings IS 'Stores site-wide settings including theme colors customizable by admins';
```

### 1.3 Executar

1. Clique em **"Run"** (ou pressione `Ctrl+Enter`)
2. Aguarde a mensagem: **"Success. No rows returned"**

✅ **Pronto!** Tabela `site_settings` criada com sucesso!

---

## 🔑 Passo 2: Configurar OpenRouter API Key

### 2.1 Abrir Edge Functions Secrets

**Link direto:** https://supabase.com/dashboard/project/bbcdqjbablugivrfcdkp/settings/functions

### 2.2 Adicionar Secret

1. Clique em **"Add new secret"** ou **"Secrets"** → **"New secret"**
2. Preencha:
   - **Name:** `OPENROUTER_API_KEY`
   - **Value:** `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`
3. Clique em **"Save"** ou **"Add secret"**

✅ **Pronto!** Chave OpenRouter configurada!

---

## 👤 Passo 3: Criar Usuário Admin

### Opção A: Atualizar Usuário Existente (Recomendado)

#### 3.1 Abrir Authentication → Users

**Link direto:** https://supabase.com/dashboard/project/bbcdqjbablugivrfcdkp/auth/users

#### 3.2 Selecionar Seu Usuário

1. Encontre seu email na lista
2. Clique no usuário

#### 3.3 Editar User Metadata

1. Role até **"User Metadata"** ou **"Raw User Meta Data"**
2. Clique em **"Edit"**
3. Adicione ou edite o JSON:

```json
{
  "role": "admin"
}
```

4. Clique em **"Save"**

✅ **Pronto!** Você agora é admin!

---

### Opção B: Via SQL (Alternativa)

Se preferir fazer via SQL:

**Link direto:** https://supabase.com/dashboard/project/bbcdqjbablugivrfcdkp/sql/new

```sql
-- Substitua 'seu-email@exemplo.com' pelo seu email real
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE email = 'seu-email@exemplo.com';
```

Clique em **"Run"**.

✅ **Pronto!** Você agora é admin!

---

## 🧪 Passo 4: Testar Tudo

### 4.1 Reiniciar Aplicação

```bash
# No terminal, pare o servidor (Ctrl+C)
# Inicie novamente
npm run dev
```

### 4.2 Fazer Login

1. Acesse: http://localhost:5173/login
2. Faça login com o email que você tornou admin

### 4.3 Acessar Painel Admin

1. Acesse: http://localhost:5173/admin
2. Você deve ver o painel admin!

### 4.4 Testar Customização de Cores

1. No painel admin, clique em **"Settings"**
2. Vá na tab **"Tema e Cores"**
3. Mude uma cor (ex: primária para azul)
4. Clique em **"Salvar Alterações"**
5. Veja a cor mudar em tempo real! 🎨

### 4.5 Testar Geração de Prompts com IA

1. Acesse: http://localhost:5173/generator
2. Clique na opção **"IA"**
3. Digite uma descrição (ex: "Uma mulher em um café")
4. Clique em **"Gerar com IA"**
5. Aguarde o prompt ser gerado! 🤖

---

## ✅ Checklist Final

Marque conforme for completando:

- [ ] **Passo 1:** Migration aplicada (tabela `site_settings` criada)
- [ ] **Passo 2:** Secret `OPENROUTER_API_KEY` configurado
- [ ] **Passo 3:** Usuário admin criado
- [ ] **Passo 4.1:** Aplicação reiniciada
- [ ] **Passo 4.2:** Login feito
- [ ] **Passo 4.3:** Painel admin acessível
- [ ] **Passo 4.4:** Customização de cores funcionando
- [ ] **Passo 4.5:** Geração de prompts com IA funcionando

---

## 🆘 Problemas Comuns

### "Acesso negado ao admin"
→ Verifique se adicionou `"role": "admin"` no user metadata

### "OPENROUTER_API_KEY is not configured"
→ Verifique se adicionou o secret nas Edge Functions

### "Erro ao carregar cores do tema"
→ Verifique se a migration foi aplicada corretamente

### Geração de prompts não funciona
→ Verifique:
1. Secret configurado
2. Edge Functions deployadas
3. Logs no Supabase: https://supabase.com/dashboard/project/bbcdqjbablugivrfcdkp/logs

---

## 📊 Verificar Configuração

### Ver Tabela Criada

**Link:** https://supabase.com/dashboard/project/bbcdqjbablugivrfcdkp/editor

Procure por `site_settings` na lista de tabelas.

### Ver Secrets Configurados

**Link:** https://supabase.com/dashboard/project/bbcdqjbablugivrfcdkp/settings/functions

Deve aparecer `OPENROUTER_API_KEY` na lista.

### Ver Usuários Admin

**Link:** https://supabase.com/dashboard/project/bbcdqjbablugivrfcdkp/auth/users

Clique no seu usuário e veja se tem `"role": "admin"` no metadata.

---

## 🎉 Tudo Pronto!

Depois de completar todos os passos, você terá:

- ✅ Sistema de customização de cores funcionando
- ✅ Geração de prompts com IA funcionando
- ✅ Sistema de fallback de modelos ativo
- ✅ Painel admin completo

**Tempo estimado:** 5 minutos ⏱️

---

## 📞 Precisa de Ajuda?

Se algo não funcionar, me avise e eu te ajudo a debugar! 😊
