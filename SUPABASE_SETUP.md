# 🔧 Configuração do Supabase - Kaizen Prompts

## ✅ Chave OpenRouter Adicionada!

Sua chave OpenRouter foi adicionada ao arquivo `.env`:
```env
OPENROUTER_API_KEY="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"
```

---

## 📋 Próximos Passos: Configurar no Supabase

### 1. Aplicar Migration (Criar Tabela de Configurações)

Você precisa rodar a migration para criar a tabela `site_settings`:

```bash
cd C:\Users\Administrator\Desktop\SiteKaizen\kaizen-prompts

# Se você tem Supabase CLI instalado:
supabase db push

# OU aplique manualmente no Supabase Dashboard:
# 1. Vá em: https://supabase.com/dashboard/project/bbcdqjbablugivrfcdkp/sql
# 2. Copie o conteúdo de: supabase/migrations/20260205034125_add_site_settings.sql
# 3. Cole e execute
```

### 2. Configurar Chave OpenRouter nas Edge Functions

A chave OpenRouter precisa ser configurada como **Secret** no Supabase:

#### Opção A: Via Supabase Dashboard (Recomendado)

1. **Acesse:** https://supabase.com/dashboard/project/bbcdqjbablugivrfcdkp/settings/functions
2. **Clique em:** "Edge Functions" → "Secrets"
3. **Adicione um novo secret:**
   - **Name:** `OPENROUTER_API_KEY`
   - **Value:** `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`
4. **Salve**

#### Opção B: Via Supabase CLI

```bash
supabase secrets set OPENROUTER_API_KEY=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
```

---

## 🎨 Funcionalidade de Admin - Customização de Cores

### O Que Foi Criado

1. **Tabela no Banco:** `site_settings`
   - Armazena configurações do site (cores, textos, etc)
   - RLS habilitado (apenas admins podem modificar)

2. **Componente Admin:** `AdminThemeCustomizer.tsx`
   - Color pickers para 5 cores principais
   - Preview em tempo real
   - Salva no banco de dados
   - Aplica cores automaticamente no site

3. **Integração:** Adicionado ao `AdminSettings.tsx`
   - Tab "Tema e Cores" com o customizador
   - Tab "Geral" para futuras configurações

### Como Usar

1. **Acesse o painel admin:**
   ```
   http://localhost:5173/admin
   ```

2. **Vá em:** Settings → Tema e Cores

3. **Customize as cores:**
   - Primária (botões, links)
   - Secundária (destaques)
   - Accent (elementos especiais)
   - Background (fundo)
   - Foreground (texto)

4. **Clique em "Salvar Alterações"**

5. **As cores serão aplicadas em todo o site!**

---

## 🔐 Criar Usuário Admin

Para acessar o painel admin, você precisa de um usuário com role `admin`:

### Opção 1: Via Supabase Dashboard

1. **Acesse:** https://supabase.com/dashboard/project/bbcdqjbablugivrfcdkp/auth/users
2. **Crie um novo usuário** ou selecione um existente
3. **Edite o usuário** e adicione em **User Metadata (raw_user_meta_data)**:
   ```json
   {
     "role": "admin"
   }
   ```
4. **Salve**

### Opção 2: Via SQL

Execute no SQL Editor do Supabase:

```sql
-- Atualizar usuário existente para admin (substitua o email)
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE email = 'seu-email@exemplo.com';
```

---

## 🚀 Testar Tudo

### 1. Reiniciar Aplicação

```bash
# Pare o servidor (Ctrl+C)
# Inicie novamente
npm run dev
```

### 2. Testar Geração de Prompts com IA

A chave OpenRouter agora está configurada. Teste:

1. Vá em: http://localhost:5173/generator
2. Use a opção "IA" para gerar prompts
3. Deve funcionar com a nova chave!

### 3. Testar Customização de Cores

1. Faça login com usuário admin
2. Vá em: http://localhost:5173/admin
3. Clique em "Settings"
4. Tab "Tema e Cores"
5. Mude as cores e salve
6. Veja as cores mudarem no site!

---

## 📊 Estrutura de Cores

### Cores Padrão

```typescript
{
  primary: "#8B5CF6",     // Roxo vibrante
  secondary: "#EC4899",   // Rosa
  accent: "#F59E0B",      // Laranja/Amarelo
  background: "#0F172A",  // Azul escuro
  foreground: "#F8FAFC"   // Branco/Cinza claro
}
```

### Como as Cores São Aplicadas

O componente converte HEX → HSL e aplica nas CSS variables:
- `--primary` → Botões, links, destaques
- `--secondary` → Elementos secundários
- `--accent` → Badges, notificações
- `--background` → Fundo da página
- `--foreground` → Texto principal

---

## ⚠️ Importante

### Segurança

- ✅ `.env` está no `.gitignore` (chaves protegidas)
- ✅ OpenRouter key deve ser configurada como Secret no Supabase
- ✅ Apenas admins podem modificar cores (RLS habilitado)

### Próximos Passos

1. **Aplicar migration** (criar tabela site_settings)
2. **Configurar OpenRouter secret** no Supabase
3. **Criar usuário admin**
4. **Testar customização de cores**

---

## 🆘 Troubleshooting

### "OPENROUTER_API_KEY is not configured"

→ Você não configurou o secret no Supabase Edge Functions

**Solução:** Siga o passo 2 acima

### "Erro ao carregar cores do tema"

→ A migration não foi aplicada (tabela site_settings não existe)

**Solução:** Aplique a migration (passo 1)

### "Acesso negado ao admin"

→ Seu usuário não tem role `admin`

**Solução:** Configure o usuário como admin (ver seção acima)

---

## 📚 Arquivos Modificados/Criados

### Novos Arquivos

1. `supabase/migrations/20260205034125_add_site_settings.sql`
2. `src/components/admin/AdminThemeCustomizer.tsx`

### Arquivos Modificados

1. `.env` - Adicionada chave OpenRouter
2. `.env.example` - Atualizado template
3. `src/components/admin/AdminSettings.tsx` - Integrado customizador

---

## ✨ Resultado Final

Depois de configurar tudo:

- ✅ Geração de prompts com IA funcionando (OpenRouter)
- ✅ Admin pode customizar cores do site
- ✅ Mudanças aplicadas em tempo real
- ✅ Cores salvas no banco de dados
- ✅ Todos os usuários veem as cores customizadas
