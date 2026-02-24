
import React, { useState, useEffect } from 'react';
import { CHARACTERS, LOCATIONS, CAMERA_DATABASE, OUTFITS, EXPRESSIONS, CELEBRITIES, LIGHTING, BRANDS } from './constants';
import { Character, ImageSize, AspectRatio } from './types';
import { GeminiService } from './services/geminiService';
import { GroqService } from './services/groqService';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'home' | 'generator' | 'editor' | 'vault' | 'cloud'>('home');
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(CHARACTERS[0]);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  // Persistence
  const [blockKey, setBlockKey] = useState(localStorage.getItem('kaizen_block_key') || '');
  const [vaultImages, setVaultImages] = useState<string[]>(JSON.parse(localStorage.getItem('kaizen_vault') || '[]'));
  
  // Custom Character DNA (Home Slot)
  const [customDnaImages, setCustomDnaImages] = useState<string[]>(JSON.parse(localStorage.getItem('kaizen_custom_dna') || '[]'));

  // Generator State
  const [genLocation, setGenLocation] = useState(LOCATIONS[0]);
  const [genCamera, setGenCamera] = useState(CAMERA_DATABASE[0].items[0]);
  const [genOutfit, setGenOutfit] = useState(OUTFITS[1]);
  const [genBrand, setGenBrand] = useState(BRANDS[0]);
  const [genLight, setGenLight] = useState(LIGHTING[2]);
  const [genExpression, setGenExpression] = useState(EXPRESSIONS[0]);
  const [genCelebrity, setGenCelebrity] = useState(CELEBRITIES[0]);
  const [genSize, setGenSize] = useState<ImageSize>('1K');
  const [genAspectRatio, setGenAspectRatio] = useState<AspectRatio>('1:1');
  const [genPrompt, setGenPrompt] = useState('');

  // Editor (Reconstructor) State
  const [edLocation, setEdLocation] = useState(LOCATIONS[0]);
  const [edCamera, setEdCamera] = useState(CAMERA_DATABASE[0].items[0]);
  const [edOutfit, setEdOutfit] = useState(OUTFITS[0]);
  const [edBrand, setEdBrand] = useState(BRANDS[0]);
  const [edLight, setEdLight] = useState(LIGHTING[2]);
  const [edExpression, setEdExpression] = useState(EXPRESSIONS[0]);
  const [edCelebrity, setEdCelebrity] = useState(CELEBRITIES[0]);
  const [edSize, setEdSize] = useState<ImageSize>('1K');
  const [edAspectRatio, setEdAspectRatio] = useState<AspectRatio>('1:1');
  const [editFile, setEditFile] = useState<string | null>(null);
  const [editInstruction, setEditInstruction] = useState('');
  const [reconstructedPrompt, setReconstructedPrompt] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('kaizen_block_key', blockKey);
    localStorage.setItem('kaizen_vault', JSON.stringify(vaultImages));
    localStorage.setItem('kaizen_custom_dna', JSON.stringify(customDnaImages));
  }, [blockKey, vaultImages, customDnaImages]);

  const resizeImage = (file: File, maxWidth: number = 800): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            height = (maxWidth / width) * height;
            width = maxWidth;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleCustomDnaUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const resized = await resizeImage(file, 600); // More aggressive resizing to prevent crashes
      const newDna = [...customDnaImages];
      newDna[index] = resized;
      setCustomDnaImages(newDna.slice(0, 3));
    }
  };

  const handleVaultUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const resizedFiles = await Promise.all(
        (Array.from(files) as File[]).map(f => resizeImage(f, 600))
      );
      setVaultImages(prev => [...prev, ...resizedFiles].slice(-13));
    }
  };

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    alert("Prompt copiado com sucesso!");
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `kaizen_render_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const checkProApiKey = async () => {
    const aistudio = (window as any).aistudio;
    if (aistudio && !(await aistudio.hasSelectedApiKey())) {
      await aistudio.openSelectKey();
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setLoadingMessage("Llama 3.3 construindo prompt limpo...");
    try {
      const brandPart = genBrand.prompt ? `, ${genBrand.prompt}` : '';
      const celebPart = genCelebrity !== 'Nenhum' ? `, posing with ${genCelebrity}` : '';
      const locPart = genLocation !== LOCATIONS[0] ? `Location: ${genLocation}.` : "";
      
      const charInfo = selectedCharacter 
        ? `${selectedCharacter.name}. Hair: ${selectedCharacter.hair}. Eyes: ${selectedCharacter.eyes}.`
        : "Subject from Custom DNA references (Detect gender and adapt clothing).";

      const rawPrompt = `UGC photo of ${charInfo} Wearing: ${genOutfit}${brandPart}. ${locPart} Camera: ${genCamera}. Lighting style: ${genLight}. Expression: ${genExpression}${celebPart}. High quality realistic portrait. GENDER-APPROPRIATE CLOTHING IS MANDATORY.`;
      
      const finalPrompt = await GroqService.refinePrompt(rawPrompt, false, genLight);
      setGenPrompt(finalPrompt);

      await checkProApiKey();
      setLoadingMessage("Renderizando DNA exclusivo...");
      
      let ref = null;
      if (customDnaImages.length > 0) ref = customDnaImages[0];
      else if (vaultImages.length > 0) ref = vaultImages[0];

      const result = await GeminiService.generateKaizenImage(finalPrompt, { size: genSize, aspectRatio: genAspectRatio }, ref);
      if (result) setGeneratedImage(result);
    } catch (err: any) { 
      if (err.message?.includes("Requested entity was not found")) {
        (window as any).aistudio?.openSelectKey();
      }
      console.error(err); 
    }
    finally { setLoading(false); }
  };

  const handleAnalyzeWithLlama = async () => {
    if (!editFile) return;
    setLoading(true);
    setLoadingMessage("Llama analisando referência visual...");
    try {
      const base64 = editFile.split(',')[1];
      const allCameras = CAMERA_DATABASE.flatMap(c => c.items).join(", ");
      
      const analysisRequest = `Analyze gender, lighting, and camera. User wants to change: ${editInstruction}. Note: If the person is male, adapt feminine outfit choices to masculine luxury equivalent.`;
      const analysis = await GeminiService.analyzeImage(base64, analysisRequest);
      
      if (analysis) {
        setLoadingMessage("Llama estruturando prompt final...");
        
        const brandPart = edBrand.name !== 'Nenhuma' ? `Force branding: ${edBrand.name}. ${edBrand.prompt}` : "";
        const outfitPart = edOutfit !== OUTFITS[0] ? `Change outfit to: ${edOutfit}.` : "Keep original clothing style.";
        const celebPart = edCelebrity !== 'Nenhum' ? `Include ${edCelebrity} in scene.` : "";
        const locPart = edLocation !== LOCATIONS[0] ? `Change location to: ${edLocation}.` : "Preserve original background.";

        const context = `
          Visual analysis: ${analysis}
          Instructions: ${editInstruction}
          Style override: ${edLight} lighting, ${edCamera} camera.
          Content override: ${outfitPart}, ${brandPart}, ${celebPart}, ${locPart}
          ADAPTATION: Ensure the outfit is gender-appropriate based on the subject detected in the image.
        `;
        
        const finalPrompt = await GroqService.refinePrompt(context, true, edLight);
        setReconstructedPrompt(finalPrompt);
      }
    } catch (err: any) { 
      if (err.message?.includes("Requested entity was not found")) {
        (window as any).aistudio?.openSelectKey();
      }
      console.error(err); 
    }
    finally { setLoading(false); }
  };

  const handleFinalRender = async () => {
    if (!reconstructedPrompt) return;
    await checkProApiKey();
    setLoading(true);
    setLoadingMessage("Finalizando reconstrução...");
    try {
      const result = await GeminiService.generateKaizenImage(reconstructedPrompt, { size: edSize, aspectRatio: edAspectRatio }, editFile);
      if (result) setGeneratedImage(result);
    } catch (err: any) { 
      if (err.message?.includes("Requested entity was not found")) {
        (window as any).aistudio?.openSelectKey();
      }
      console.error(err); 
    }
    finally { setLoading(false); }
  };

  return (
    <div className="flex flex-col h-screen text-gray-100">
      <header className="bg-[#080808] border-b border-white/5 h-20 flex items-center px-6 sticky top-0 z-50">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg"><i className="fa-solid fa-bolt text-white"></i></div>
           <h1 className="font-black italic tracking-tighter text-xl text-white">KAIZEN <span className="text-purple-500 text-[10px] tracking-widest">v5.7</span></h1>
        </div>
        <nav className="mx-auto flex bg-white/5 p-1 rounded-2xl border border-white/10 overflow-x-auto custom-scrollbar">
          <button onClick={() => { setActiveSection('home'); setGeneratedImage(null); }} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${activeSection === 'home' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}>DNA</button>
          <button onClick={() => { setActiveSection('generator'); setGeneratedImage(null); }} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${activeSection === 'generator' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}>Gerador</button>
          <button onClick={() => { setActiveSection('editor'); setGeneratedImage(null); }} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${activeSection === 'editor' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}>Reconstrutor</button>
          <button onClick={() => { setActiveSection('vault'); setGeneratedImage(null); }} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${activeSection === 'vault' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'}`}>Vault (13)</button>
          <button onClick={() => { setActiveSection('cloud'); setGeneratedImage(null); }} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${activeSection === 'cloud' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}>Cofre</button>
        </nav>
      </header>

      <main className="flex-1 overflow-y-auto bg-[#050505] custom-scrollbar">
        <div className="max-w-7xl mx-auto p-6 lg:p-10">
          
          {activeSection === 'home' && (
            <div className="space-y-12 animate-in fade-in duration-500">
              <div className="bg-[#0a0a0a] p-10 rounded-[3.5rem] border border-white/5 border-dashed hover:border-purple-500/50 transition-all text-center shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 opacity-5"><i className="fa-solid fa-dna text-9xl"></i></div>
                 <h2 className="text-3xl font-black italic uppercase text-purple-400 mb-2 tracking-tighter">Novo DNA Customizado</h2>
                 <p className="text-[10px] uppercase font-bold tracking-[0.3em] opacity-30 mb-8">Suba 3 fotos para travar uma nova identidade (Suporta Homem e Mulher)</p>
                 <div className="flex justify-center gap-6 mb-8">
                    {[0, 1, 2].map((i) => (
                       <div key={i} className="w-28 h-28 bg-white/5 border border-white/10 rounded-3xl overflow-hidden relative group hover:scale-105 transition-all shadow-xl">
                          {customDnaImages[i] ? (
                            <img src={customDnaImages[i]} className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full text-white/10">
                               <i className="fa-solid fa-user-plus text-xl mb-1"></i>
                               <span className="text-[8px] font-black uppercase">Slot {i+1}</span>
                            </div>
                          )}
                          <input type="file" onChange={(e) => handleCustomDnaUpload(e, i)} className="absolute inset-0 opacity-0 cursor-pointer" />
                          {customDnaImages[i] && (
                            <button onClick={() => {
                              const newDna = [...customDnaImages];
                              newDna[i] = "";
                              setCustomDnaImages(newDna);
                            }} className="absolute top-2 right-2 bg-red-500/80 p-1.5 rounded-lg text-[8px] opacity-0 group-hover:opacity-100 transition-all">
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          )}
                       </div>
                    ))}
                 </div>
                 <button onClick={() => { setSelectedCharacter(null); setActiveSection('generator'); }} className="px-12 py-5 bg-purple-600 hover:bg-purple-500 rounded-[2rem] font-black uppercase text-[10px] tracking-widest transition-all shadow-2xl hover:shadow-purple-500/20 text-white">Configurar Gerador com este DNA</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {CHARACTERS.map(char => (
                  <div key={char.id} className={`bg-[#0a0a0a] border border-white/5 p-10 rounded-[3rem] hover:border-purple-500/40 transition-all cursor-pointer group shadow-xl ${selectedCharacter?.id === char.id ? 'border-purple-500/60 ring-2 ring-purple-500/20' : ''}`} onClick={() => { setSelectedCharacter(char); setActiveSection('generator'); }}>
                    <i className="fa-solid fa-dna text-3xl text-purple-500 mb-6 block group-hover:scale-110 transition-transform"></i>
                    <h3 className="text-3xl font-black italic uppercase leading-none mb-2 tracking-tighter text-white">{char.name}</h3>
                    <p className="text-[10px] font-black text-white/20 mb-6 uppercase tracking-widest">{char.country}</p>
                    <p className="text-sm text-white/50 italic mb-8">"{char.desc}"</p>
                    <div className="flex flex-wrap gap-2">
                      {char.rules.map(r => <span key={r} className="text-[9px] font-bold bg-white/5 border border-white/10 px-3 py-1 rounded-lg uppercase text-white/70">{r}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'vault' && (
            <div className="max-w-5xl mx-auto space-y-10 animate-in slide-in-from-bottom-4 duration-500">
               <div className="bg-[#0a0a0a] p-10 rounded-[3.5rem] border border-white/5 shadow-2xl">
                  <h2 className="text-3xl font-black italic uppercase text-green-400 mb-4 tracking-tighter">DNA VAULT</h2>
                  <p className="text-xs text-white/40 mb-8 uppercase font-bold tracking-widest">Suba suas 13 fotos de referência para travar a identidade Kaizen principal.</p>
                  <input type="file" multiple onChange={handleVaultUpload} className="w-full bg-white/5 border-2 border-dashed border-white/10 p-12 rounded-[2.5rem] cursor-pointer hover:border-green-500/50 transition-all" />
                  <div className="grid grid-cols-4 md:grid-cols-7 gap-4 mt-10">
                     {vaultImages.map((img, i) => (
                       <div key={i} className="aspect-square bg-black rounded-2xl overflow-hidden border border-white/10 relative group">
                          <img src={img} className="w-full h-full object-cover" />
                          <button onClick={() => setVaultImages(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 bg-red-500 p-1.5 rounded-lg text-[8px] opacity-0 group-hover:opacity-100 transition-all"><i className="fa-solid fa-trash text-white"></i></button>
                       </div>
                     ))}
                     {Array.from({ length: 13 - vaultImages.length }).map((_, i) => (
                       <div key={`empty-${i}`} className="aspect-square bg-white/5 rounded-2xl border border-white/5 flex items-center justify-center">
                          <i className="fa-solid fa-image opacity-10"></i>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          )}

          {activeSection === 'generator' && (
            <div className="flex flex-col xl:flex-row gap-12 animate-in fade-in duration-500">
              <div className="flex-1 bg-[#0a0a0a] border border-white/5 rounded-[3.5rem] p-10 space-y-10 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/5 pb-8">
                  <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">Llama 3.3 Engine</h2>
                  <div className="flex gap-2">
                    {(customDnaImages.some(i => i) || vaultImages.length > 0) && <span className="bg-green-500/20 text-green-400 text-[8px] font-black px-3 py-1 rounded-full border border-green-500/20 uppercase">DNA Ativo</span>}
                    {selectedCharacter ? <span className="bg-purple-500/20 text-purple-400 text-[8px] font-black px-3 py-1 rounded-full border border-purple-500/20 uppercase">{selectedCharacter.name}</span> : <span className="bg-blue-500/20 text-blue-400 text-[8px] font-black px-3 py-1 rounded-full border border-blue-500/20 uppercase">Custom DNA</span>}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-white/20 uppercase ml-2 tracking-widest">Cenário</label>
                    <select value={genLocation} onChange={(e) => setGenLocation(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-[10px] text-white">
                      {LOCATIONS.map(l => <option key={l} value={l} className="bg-[#0a0a0a]">{l}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-white/20 uppercase ml-2 tracking-widest">Luz</label>
                    <select value={genLight} onChange={(e) => setGenLight(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-[10px] text-white">
                      {LIGHTING.map(lt => <option key={lt} value={lt} className="bg-[#0a0a0a]">{lt.split(':')[0]}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-white/20 uppercase ml-2 tracking-widest">Expressão</label>
                    <select value={genExpression} onChange={(e) => setGenExpression(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-[10px] text-white">
                      {EXPRESSIONS.map(ex => <option key={ex} value={ex} className="bg-[#0a0a0a]">{ex.split(':')[0]}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-white/20 uppercase ml-2 tracking-widest">Marca</label>
                    <select value={genBrand.name} onChange={(e) => setGenBrand(BRANDS.find(b => b.name === e.target.value) || BRANDS[0])} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-[10px] text-white">
                      {BRANDS.map(b => <option key={b.name} value={b.name} className="bg-[#0a0a0a]">{b.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-white/20 uppercase ml-2 tracking-widest">Câmera</label>
                    <select value={genCamera} onChange={(e) => setGenCamera(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-[10px] text-white">
                      {CAMERA_DATABASE.map(cat => (
                        <optgroup label={cat.category} key={cat.category} className="bg-[#0a0a0a] text-purple-500">
                          {cat.items.map(i => <option key={i} value={i} className="bg-[#0a0a0a] text-white">{i}</option>)}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-white/20 uppercase ml-2 tracking-widest">Celebridade</label>
                    <select value={genCelebrity} onChange={(e) => setGenCelebrity(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-[10px] text-white">
                      {CELEBRITIES.map(celeb => <option key={celeb} value={celeb} className="bg-[#0a0a0a]">{celeb}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <label className="text-[9px] font-black text-white/20 uppercase ml-2 tracking-widest">Roupa</label>
                      <select value={genOutfit} onChange={(e) => setGenOutfit(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-[10px] outline-none text-white">
                        {OUTFITS.map(o => <option key={o} value={o} className="bg-[#0a0a0a]">{o}</option>)}
                      </select>
                   </div>
                   <div className="space-y-1">
                      <label className="text-[9px] font-black text-white/20 uppercase ml-2 tracking-widest">Tamanho</label>
                      <select value={genSize} onChange={(e) => setGenSize(e.target.value as any)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-[10px] outline-none text-white">
                         <option value="1K" className="bg-[#0a0a0a]">1K Standard</option>
                         <option value="2K" className="bg-[#0a0a0a]">2K High-Res</option>
                      </select>
                   </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button onClick={handleGenerate} className="flex-1 py-7 bg-purple-600 hover:bg-purple-500 rounded-[2.5rem] font-black text-xl uppercase tracking-widest shadow-2xl transition-all text-white">Renderizar Agora</button>
                  {genPrompt && <button onClick={() => copyToClipboard(genPrompt)} className="bg-white/5 border border-white/10 hover:bg-white/10 p-6 rounded-[2.5rem] transition-all text-white" title="Copiar Prompt"><i className="fa-solid fa-copy"></i></button>}
                </div>

                {genPrompt && (
                  <div className="bg-black/40 rounded-3xl p-6 border border-white/5 text-[10px] font-mono text-white/30 leading-relaxed max-h-40 overflow-y-auto custom-scrollbar">
                    <div className="flex justify-between mb-2">
                       <span className="uppercase tracking-widest opacity-20">Prompt Llama 3.3 Output</span>
                    </div>
                    {genPrompt}
                  </div>
                )}
              </div>

              <div className="w-full xl:w-[480px] shrink-0">
                 <div className="aspect-[3/4] bg-[#0a0a0a] rounded-[3.5rem] border border-white/5 flex items-center justify-center relative overflow-hidden shadow-2xl group">
                    {loading ? (
                      <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full"></div>
                    ) : generatedImage ? (
                      <div className="relative w-full h-full group">
                        <img src={generatedImage} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                           <button onClick={handleDownload} className="bg-white text-black font-black uppercase text-[10px] px-8 py-4 rounded-2xl shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
                             <i className="fa-solid fa-download"></i> Baixar Imagem
                           </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center opacity-10">
                         <i className="fa-solid fa-wand-magic-sparkles text-5xl mb-4"></i>
                         <p className="text-[10px] font-black uppercase tracking-widest">Painel de Visualização</p>
                      </div>
                    )}
                 </div>
              </div>
            </div>
          )}

          {activeSection === 'editor' && (
            <div className="max-w-7xl mx-auto space-y-12 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-6 border-b border-white/5 pb-8">
                   <h2 className="text-4xl font-black italic uppercase leading-none tracking-tighter text-white">Reconstrutor Llama</h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <div className="aspect-video bg-[#0a0a0a] rounded-[3.5rem] border-2 border-dashed border-white/5 flex flex-col items-center justify-center relative overflow-hidden shadow-inner group">
                      {editFile ? (
                        <><img src={editFile} className="w-full h-full object-cover" /><button onClick={() => setEditFile(null)} className="absolute top-6 right-6 bg-red-500/80 p-3 rounded-xl hover:bg-red-600 transition-all"><i className="fa-solid fa-x text-white"></i></button></>
                      ) : (
                        <><input type="file" onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if(file){
                            const resized = await resizeImage(file, 1024);
                            setEditFile(resized);
                          }
                        }} className="absolute inset-0 opacity-0 cursor-pointer" /><i className="fa-solid fa-upload text-3xl opacity-10 mb-4 group-hover:opacity-20 transition-all text-white"></i><p className="text-[10px] font-black opacity-20 uppercase tracking-widest text-white">Clique para Upload de Referência</p></>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-white/20 uppercase ml-2 tracking-widest">Alterar Cenário</label>
                        <select value={edLocation} onChange={(e) => setEdLocation(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-[10px] text-white">
                          {LOCATIONS.map(l => <option key={l} value={l} className="bg-[#0a0a0a]">{l}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-white/20 uppercase ml-2 tracking-widest">Alterar Luz</label>
                        <select value={edLight} onChange={(e) => setEdLight(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-[10px] text-white">
                          {LIGHTING.map(lt => <option key={lt} value={lt} className="bg-[#0a0a0a]">{lt.split(':')[0]}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-white/20 uppercase ml-2 tracking-widest">Alterar Expressão</label>
                        <select value={edExpression} onChange={(e) => setEdExpression(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-[10px] text-white">
                          {EXPRESSIONS.map(ex => <option key={ex} value={ex} className="bg-[#0a0a0a]">{ex.split(':')[0]}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-white/20 uppercase ml-2 tracking-widest">Alterar Marca</label>
                        <select value={edBrand.name} onChange={(e) => setEdBrand(BRANDS.find(b => b.name === e.target.value) || BRANDS[0])} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-[10px] text-white">
                          {BRANDS.map(b => <option key={b.name} value={b.name} className="bg-[#0a0a0a]">{b.name}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-white/20 uppercase ml-2 tracking-widest">Alterar Câmera</label>
                        <select value={edCamera} onChange={(e) => setEdCamera(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-[10px] text-white">
                          {CAMERA_DATABASE.map(cat => (
                            <optgroup label={cat.category} key={cat.category} className="bg-[#0a0a0a] text-purple-500">
                              {cat.items.map(i => <option key={i} value={i} className="bg-[#0a0a0a] text-white">{i}</option>)}
                            </optgroup>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-white/20 uppercase ml-2 tracking-widest">Adicionar Celebridade</label>
                        <select value={edCelebrity} onChange={(e) => setEdCelebrity(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-[10px] text-white">
                          {CELEBRITIES.map(celeb => <option key={celeb} value={celeb} className="bg-[#0a0a0a]">{celeb}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-white/20 uppercase ml-2 tracking-widest">Alterar Roupa (Adaptável)</label>
                      <select value={edOutfit} onChange={(e) => setEdOutfit(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-[10px] outline-none text-white">
                        {OUTFITS.map(o => <option key={o} value={o} className="bg-[#0a0a0a]">{o}</option>)}
                      </select>
                    </div>

                    <textarea value={editInstruction} onChange={(e) => setEditInstruction(e.target.value)} placeholder="Instruções específicas para o Llama processar (ex: mude para roupa social de luxo)..." className="w-full h-32 bg-white/5 border border-white/10 rounded-[2rem] px-8 py-6 outline-none text-xs shadow-inner text-white" />
                    <button onClick={handleAnalyzeWithLlama} disabled={!editFile || loading} className="w-full py-6 bg-blue-600 hover:bg-blue-500 rounded-3xl font-black text-lg uppercase tracking-widest shadow-xl transition-all text-white">Analisar e Criar Prompt Limpo</button>
                  </div>
                  <div className="flex flex-col bg-[#0a0a0a] border border-white/5 rounded-[3.5rem] p-10 space-y-8 shadow-2xl min-h-[600px]">
                    <div className="flex flex-col flex-1 bg-black/40 rounded-[2.5rem] border border-white/5 p-8 relative">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[9px] font-black uppercase opacity-20 tracking-[0.3em]">Prompt Final Adaptado</span>
                        {reconstructedPrompt && <button onClick={() => copyToClipboard(reconstructedPrompt)} className="text-purple-400 hover:text-white transition-all text-[10px] font-black uppercase tracking-tighter"><i className="fa-solid fa-copy mr-2"></i>Copiar Prompt</button>}
                      </div>
                      <textarea value={reconstructedPrompt} onChange={(e) => setReconstructedPrompt(e.target.value)} className="w-full h-full bg-transparent outline-none text-[11px] font-mono text-white/50 leading-relaxed resize-none custom-scrollbar" placeholder="Aguardando análise inteligente..." />
                    </div>
                    <div className="flex flex-col gap-4">
                      <button onClick={handleFinalRender} disabled={!reconstructedPrompt || loading} className="w-full py-7 bg-purple-600 hover:bg-purple-500 rounded-[2.5rem] font-black text-xl uppercase tracking-widest shadow-2xl transition-all text-white">Renderizar Imagem Reconstruída</button>
                    </div>
                    {generatedImage && !loading && (
                      <div className="mt-8 space-y-4 animate-in zoom-in-95 duration-300">
                         <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-white/10 relative group shadow-2xl">
                           <img src={generatedImage} className="w-full h-full object-cover" />
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                              <button onClick={handleDownload} className="bg-white text-black font-black uppercase text-[10px] px-8 py-4 rounded-2xl shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-all">
                                <i className="fa-solid fa-download mr-2 text-black"></i> Baixar Agora
                              </button>
                           </div>
                         </div>
                      </div>
                    )}
                  </div>
                </div>
            </div>
          )}

          {activeSection === 'cloud' && (
            <div className="max-w-2xl mx-auto bg-[#0a0a0a] p-10 rounded-[3.5rem] border border-white/5 shadow-2xl animate-in fade-in duration-500">
               <h2 className="text-2xl font-black uppercase italic mb-8 text-blue-400 tracking-tighter">Groq Master Key</h2>
               <div className="space-y-6">
                  <input type="password" value={blockKey} onChange={(e) => setBlockKey(e.target.value)} placeholder="gsk_..." className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none text-xs font-mono text-blue-400 shadow-inner" />
                  <button onClick={() => { alert('Chave Groq salva com sucesso!'); }} className="w-full py-5 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl text-white">Ativar Llama Pipeline</button>
               </div>
            </div>
          )}
        </div>
      </main>

      {loading && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-[200] flex items-center justify-center">
           <div className="text-center">
              <div className="w-24 h-24 border-8 border-purple-500/10 border-t-purple-600 rounded-full animate-spin mx-auto mb-10"></div>
              <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">KAIZEN ENGINE</h2>
              <p className="text-[11px] text-purple-400 mt-4 uppercase tracking-[0.5em] font-black animate-pulse leading-none">{loadingMessage}</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;
