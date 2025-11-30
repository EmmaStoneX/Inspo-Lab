
import React, { useState, useCallback } from 'react';
import { GenerationStatus, Inspiration } from './types';
import { generateImage } from './services/geminiService';
import Button from './components/Button';
import InspirationGallery from './components/InspirationGallery';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setStatus('loading');
    setError(null);
    setGeneratedImage(null);

    try {
      // 仅传递提示词，不再传递比例
      const imageData = await generateImage(prompt);
      setGeneratedImage(imageData);
      setStatus('success');
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setError(err.message || "生成失败，请稍后重试。");
    }
  };

  const handleInspirationSelect = useCallback((item: Inspiration) => {
    setPrompt(item.prompt);
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `banana2-generated-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-background text-gray-100 font-sans selection:bg-primary/30">
      
      {/* Header */}
      <header className="border-b border-gray-800 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
              B
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Banana2 灵感画室
            </h1>
          </div>
          <div className="text-xs font-mono text-gray-500 hidden sm:block">
            由 Gemini 3 Pro 驱动
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          
          {/* Left Column: Controls */}
          <div className="lg:col-span-5 space-y-8">
            <section className="bg-surface/50 rounded-2xl p-6 border border-gray-800 backdrop-blur-sm">
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
                画面描述 (Prompt)
              </label>
              <div className="relative">
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="描述你想要生成的画面... 
例如：一只穿着宇航服的柴犬在火星上喝咖啡，赛博朋克风格，电影级光效。"
                  className="w-full h-40 bg-gray-900/50 border border-gray-700 rounded-xl p-4 text-gray-100 focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none placeholder:text-gray-600"
                />
                <div className="absolute bottom-4 right-4 text-xs text-gray-500">
                  {prompt.length} 字
                </div>
              </div>

              {/* 移除了画幅比例选择器 */}

              <div className="mt-8">
                <Button 
                  onClick={handleGenerate} 
                  isLoading={status === 'loading'}
                  disabled={!prompt.trim()}
                  className="w-full text-lg"
                >
                  立即生成
                </Button>
                {error && (
                  <div className="mt-4 p-3 bg-red-900/20 border border-red-900/50 rounded-lg text-red-200 text-sm flex items-start gap-2">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}
              </div>
            </section>

            <div className="hidden lg:block">
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-4 border border-white/5">
                <h4 className="text-sm font-medium text-gray-200 mb-2">💡 提示词技巧</h4>
                <ul className="text-xs text-gray-400 space-y-1 list-disc pl-4">
                  <li>细节越丰富越好 (加上 "高清", "电影光效", "8k")。</li>
                  <li>明确具体的艺术风格 (如 "水墨画", "3D渲染", "油画")。</li>
                  <li>Banana2 模型对中文指令理解非常精准，请大胆描述。</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column: Result & Inspiration */}
          <div className="lg:col-span-7 space-y-12">
            
            {/* Result Area */}
            <section className="bg-surface rounded-2xl p-1 border border-gray-800 shadow-2xl relative overflow-hidden min-h-[400px] flex flex-col">
              {status === 'idle' && !generatedImage && (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-12 text-center">
                  <div className="w-20 h-20 mb-4 rounded-full bg-gray-800 flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-lg font-medium">准备就绪</p>
                  <p className="text-sm">在左侧输入提示词，或选择下方的灵感案例开始创作。</p>
                </div>
              )}

              {status === 'loading' && (
                <div className="absolute inset-0 z-10 bg-surface/90 flex flex-col items-center justify-center">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-gray-700 border-t-primary animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-gray-400">AI</div>
                  </div>
                  <p className="mt-4 text-gray-300 animate-pulse">正在绘制你的梦境...</p>
                </div>
              )}

              {generatedImage && (
                <div className="relative group w-full h-full flex flex-col">
                  <div className="relative w-full h-full bg-black/50 flex items-center justify-center p-2">
                     <img 
                      src={generatedImage} 
                      alt="Generated Artwork" 
                      className="max-w-full max-h-[70vh] rounded-lg shadow-2xl object-contain"
                    />
                  </div>
                  
                  <div className="p-4 bg-surface border-t border-gray-800 flex justify-between items-center">
                    <div className="text-sm text-gray-400">
                      <span className="text-primary">完成！</span> Generated with Gemini 3 Pro
                    </div>
                    <Button variant="secondary" onClick={handleDownload} className="py-2 px-4 text-sm">
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      保存图片
                    </Button>
                  </div>
                </div>
              )}
            </section>

            {/* Inspiration Section */}
            <InspirationGallery onSelect={handleInspirationSelect} />

          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-gray-600 text-sm border-t border-gray-800/50 mt-12 bg-gray-900">
        <p>&copy; {new Date().getFullYear()} Banana2 灵感画室. 托管于 Cloudflare Workers</p>
      </footer>
    </div>
  );
};

export default App;
