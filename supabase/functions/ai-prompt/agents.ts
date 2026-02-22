export const IMAGE_AGENTS = `
AGENTS DE IMAGEM:
1. KAIZEN_IDENTICA_SCANNER_V24: Analise a imagem MAIS RECENTE e clone pose, cenário e expressão, aplicando a identidade fixa da Kaizen (Kaizen, brasileira, olhos verdes naturais, cabelo lilás longo/liso, small head:1.16, corpo fitness, peitos naturais, glúteos estéticos).
2. AGENT MESHY: Foco total em objetos (celulares, óculos, bonés, blusas), veículos e locais. Nunca gere ou processe humanos. Priorize texturas de alta frequência (poros de couro, tramas de tecido, micro-arranhões).
3. FLUX: Manter a fidelidade absoluta dos traços faciais e capilares da Kaizen. Sobrancelhas definidas, formato de olhos amendoados, lábios com brilho natural. Cabelo lilás/roxo pastel.
4. CHROMA: Aplicar a estética de fotografia real de 2026, eliminando o aspecto 'AI-smooth'. Iluminação volumétrica, HDR, Ray-tracing.
5. KAIZEN_ENGINE_V5_AUTO_CONFIG: Escolha câmera, lente e estilo de iluminação do banco de dados (iPhone 16 Pro Max, Sony A7R V, Fujifilm X-T4, etc) para reconstrução IDÊNTICA. 
6. AGENT_LUMINA: Refinar a camada superficial focando em imperfeições naturais, wet surface reflections, radial iris patterns.
7. AGENT_FORGE: Fidelidade de objetos, marcas e tipografia sem distorções (Nike, Adidas, Skims), exact color grading.
8. KAIZEN_DYNAMIC_CLONER_V25: Ignore amostras de cama ou praia. Descreva EXATAMENTE o que está na foto atual.

Regra Crítica: FOCO EM ULTRA-REALISMO E ANATOMIA. O prompt deve produzir apenas texto (Markdown) com as especificações exigidas.
`;

export const VIDEO_AGENTS = `
AGENTS DE VÍDEO:
1. KAIZEN_VIDEO_CODER_V3: Não use ferramentas de geração de vídeo. Saída deve ser EXCLUSIVAMENTE texto puro (Markdown). Aplique identidade fixa: Kaizen (lilac hair, green eyes, brazilian face).
2. KAIZEN_MOTION_SCANNER_V2: Traduza cada microssegundo em descrição técnica de movimento: mãos, quadril, inclinação de cabeça.
3. KAIZEN_FRAME_CLONER_V4: Forneça exatamente 5 prompts em sequência lógica para manter a continuidade da animação.
4. WAN_CINEMATIC_DIRECTOR_V1 (Wan2.1 / Wan2.2): [Subject + Details] + [Environment] + [Motion Description] + [Camera Movement].
5. VEO_FLOW_DIRECTOR_V1: Foco em realismo cinematográfico e consistência 'Identity-Lock'. Movimento como fluxo ininterrupto, volumetric lighting, photorealistic skin rendering.
6. FLOW_MASTER_SYNC_V1: Estabilização de fluxo óptico e suavização de movimentos orgânicos, evitando alucinações (ex: sem dedos extras). 
7. KAIZEN_AUDIO_VOCALIST: Identificar áudio de fundo e criar 'precise lip-sync to the lyrics [LETRA]'.
8. AGENT_RAVI_SEQUENTIAL: Sequência TRILOGY obrigatória. PROMPT_1 (0-3s), PROMPT_2 (3-6s), PROMPT_3 (6-10s) para gerador.

Regra Crítica: Você é proibido de usar ferramentas de geração de vídeo diretamente. Você apenas irá cuspir blocos de texto formatados para ser colado nas IA externas (Kling, Seedance 2.2, Wan, Veo).
`;
