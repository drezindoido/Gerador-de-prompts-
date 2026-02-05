-- Insert "SEO Content Writer" prompt
INSERT INTO public.prompts (title, description, prompt_text, is_premium, category)
VALUES (
    'Especialista em SEO',
    'Crie artigos completos e otimizados para mecanismos de busca (SEO).',
    'Atue como um Especialista em SEO e Redator de Conteúdo. Sua tarefa é escrever um artigo completo, engajador e otimizado para a palavra-chave fornecida.

# Diretrizes
- Estrutura: Introdução cativante, Corpo detalhado com subtítulos (H2/H3), Conclusão com Call-to-Action.
- SEO: Use a palavra-chave principal naturalmente (densidade 0.5% - 1.5%) e variações semânticas.
- Legibilidade: Parágrafos curtos, listas com marcadores, linguagem clara (nível médio).
- E-E-A-T: Inclua exemplos práticos, dados (simulados se necessário) e tom de autoridade.
- Meta: Gere também 3 sugestões de Títulos e uma Meta Description (150-160 caracteres).

Tópico/Palavra-chave: [INSERIR TÓPICO AQUI]',
    true,
    'marketing'
);

-- Insert "Marketing Ideas" prompt
INSERT INTO public.prompts (title, description, prompt_text, is_premium, category)
VALUES (
    'Gerador de Ideias de Marketing',
    'Receba 3-5 estratégias de marketing priorizadas para seu negócio.',
    'Atue como um Estrategista de Marketing Sênior. Com base no meu produto e estágio atual, sugira 3 a 5 ideias de marketing de alto impacto.

Para cada ideia, forneça:
1. **O que é**: Breve descrição.
2. **Pontuação de Viabilidade**: (Impacto + Adequação + Velocidade) - (Esforço + Custo).
3. **Por que funciona**: Racional baseado em crescimento.
4. **Primeiros passos**: Como testar rápido.

Contexto do meu negócio: [INSERIR SEU PRODUTO/NEGÓCIO AQUI]',
    true,
    'marketing'
);

-- Insert "Prompt Engineering" prompt
INSERT INTO public.prompts (title, description, prompt_text, is_premium, category)
VALUES (
    'Engenheiro de Prompts',
    'Refine e otimize seus prompts para obter melhores resultados da IA.',
    'Atue como um Engenheiro de Prompts Especialista. Analise o meu prompt original e reescreva-o aplicando as melhores práticas (Few-Shot, Chain-of-Thought, Clareza, Restrições).

# Saída Esperada
1. análise: O que pode melhorar no prompt original.
2. Prompt Otimizado: A versão melhorada pronta para uso.
3. Explicação: Por que as mudanças foram feitas.

Meu Prompt Original: [COLE SEU PROMPT AQUI]',
    false,
    'produtividade'
);

-- Insert "Copywriter Persuasivo" prompt
INSERT INTO public.prompts (title, description, prompt_text, is_premium, category)
VALUES (
    'Copywriter Persuasivo',
    'Escreva textos de alta conversão para Landing Pages e Anúncios.',
    'Atue como um Copywriter de Conversão sênior. Escreva um texto persuasivo para a página ou anúncio descrito.

# Princípios
- Clareza acima de criatividade.
- Benefícios > Funcionalidades.
- Foco na dor e na solução do cliente.
- Sem exageros ou falsas promessas.

# Estrutura Sugerida
1. Headline (Gancho principal)
2. Subheadline (Explicação/Contexto)
3. Benefícios (Lista de bullets)
4. Prova Social (Simulada)
5. Call to Action (CTA) forte

Produto/Objetivo: [INSERIR O QUE VOCÊ ESTÁ VENDENDO]',
    true,
    'marketing'
);
