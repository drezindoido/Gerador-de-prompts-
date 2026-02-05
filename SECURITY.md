# 🔐 Guia de Segurança - Kaizen Prompts

## ✅ Configuração Atual (Segura)

### Variáveis de Ambiente Protegidas

As chaves da API Supabase estão corretamente armazenadas em `.env`:
- ✅ `.env` adicionado ao `.gitignore`
- ✅ `.env.example` criado como template
- ✅ Variáveis acessadas via `import.meta.env.VITE_*`

### Arquivos Protegidos

```
.env              # Suas chaves reais (NUNCA commitar!)
.env.local        # Ambiente local (NUNCA commitar!)
.env*.local       # Qualquer variação local (NUNCA commitar!)
```

---

## 📋 Checklist de Segurança

### Antes de Fazer Commit

- [ ] Verificar que `.env` está no `.gitignore`
- [ ] Confirmar que nenhum arquivo `.env*` aparece no `git status`
- [ ] Revisar código para hardcoded secrets
- [ ] Verificar que `.env.example` não contém valores reais

### Configuração para Novos Desenvolvedores

1. **Copiar template:**
   ```bash
   copy .env.example .env
   ```

2. **Preencher valores reais** no `.env`:
   - `VITE_SUPABASE_PROJECT_ID` - ID do projeto Supabase
   - `VITE_SUPABASE_PUBLISHABLE_KEY` - Chave pública (anon key)
   - `VITE_SUPABASE_URL` - URL do projeto

3. **NUNCA commitar** o arquivo `.env`!

---

## 🔒 Boas Práticas Aplicadas (Kaizen)

### 1. Poka-Yoke (Error Proofing)

**Validação no Cliente Supabase:**
```typescript
// src/integrations/supabase/client.ts
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// ✅ Melhor: Adicionar validação
if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  throw new Error(
    'Missing Supabase environment variables. Check your .env file.'
  );
}
```

### 2. Fail Fast

**Validar na inicialização**, não durante requisições:
- ✅ App falha no startup se config inválida
- ✅ Erro claro para desenvolvedores
- ❌ Evita erros silenciosos em produção

### 3. Separação de Ambientes

```bash
# Desenvolvimento
.env.local          # Supabase local

# Staging
.env.staging        # Supabase staging

# Produção
.env.production     # Supabase produção
```

---

## ⚠️ O Que NUNCA Fazer

### ❌ Hardcoded Secrets
```typescript
// NUNCA FAÇA ISSO!
const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
```

### ❌ Commitar .env
```bash
# NUNCA adicione .env ao git!
git add .env  # ❌ PERIGOSO!
```

### ❌ Expor Chaves no Frontend
```typescript
// ❌ Não exponha service_role key no frontend!
// Apenas anon/public keys são seguras no cliente
```

---

## 🛡️ Níveis de Segurança das Chaves

| Chave | Segurança | Uso |
|-------|-----------|-----|
| `anon` (public) | ✅ Segura no frontend | Cliente Supabase |
| `service_role` | ❌ NUNCA no frontend | Apenas backend/Edge Functions |

**Sua configuração atual usa `anon` key** ✅ - Correto para frontend!

---

## 🔄 Rotação de Chaves

Se suas chaves foram expostas:

1. **Ir para Supabase Dashboard** → Settings → API
2. **Gerar novas chaves**
3. **Atualizar `.env`** com novas chaves
4. **Reiniciar aplicação**

---

## 📚 Recursos Adicionais

- [Supabase Security Best Practices](https://supabase.com/docs/guides/auth/security-best-practices)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Row Level Security (RLS)](https://supabase.com/docs/guides/auth/row-level-security)

---

## ✨ Próximos Passos (Kaizen)

### Melhorias Incrementais

1. **Adicionar validação de env** no `client.ts`
2. **Configurar RLS** no Supabase para todas as tabelas
3. **Implementar rate limiting** nas Edge Functions
4. **Adicionar logging** de tentativas de acesso suspeitas
5. **Configurar CORS** adequadamente no Supabase

### Monitoramento

- [ ] Configurar alertas de uso anormal da API
- [ ] Revisar logs de autenticação semanalmente
- [ ] Monitorar custos do Supabase
