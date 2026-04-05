'use client';

import React, { useState } from 'react';
import { Search, Download, Github, Code, Settings2, Sparkles, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function TrophyGenerator() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [svgUrl, setSvgUrl] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [copied, setCopied] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;

    setLoading(true);
    setError('');
    try {
      // Just to verify user exists before showing SVG
      const res = await fetch(`https://api.github.com/users/${username}`);
      if (!res.ok) throw new Error('User not found');
      
      // Construct the URL for our API
      const url = `/api/trophy?username=${username}&theme=${theme}&t=${Date.now()}`;
      setSvgUrl(url);
    } catch (err) {
      setError('User not found. Please check the username.');
      setSvgUrl(null);
    } finally {
      setLoading(false);
    }
  };

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    if (svgUrl && username) {
      setSvgUrl(`/api/trophy?username=${username}&theme=${newTheme}&t=${Date.now()}`);
    }
  };

  const copyWorkflow = () => {
    const workflow = `name: Update GitHub Trophies
on:
  schedule:
    - cron: '0 0 * * *' # Every day at midnight
  push:
    branches:
      - main
jobs:
  update-trophies:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Download Trophy SVG
        run: curl -o trophy.svg "https://\${{ secrets.APP_DOMAIN }}/api/trophy?username=${username || 'your-username'}&theme=${theme}"
        
      - name: Commit & Push
        run: |
          git config user.name github-actions
          git config user.email github-actions@github.com
          git add trophy.svg
          git commit -m "Update GitHub Trophies" || exit 0
          git push`;
    
    navigator.clipboard.writeText(workflow);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyMarkdown = () => {
    // We use a placeholder domain for the snippet, or window.location.origin if available
    const domain = typeof window !== 'undefined' ? window.location.origin : 'https://your-app.com';
    const md = `[![GitHub Trophies](${domain}/api/trophy?username=${username || 'your-username'}&theme=${theme})](https://github.com/${username || 'your-username'})`;
    navigator.clipboard.writeText(md);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const downloadSvg = async () => {
    if (!svgUrl) return;
    try {
      const response = await fetch(svgUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${username}-trophies.svg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Failed to download SVG', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-primary/30">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-20 pb-12 px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-blue-600/20 blur-[120px] rounded-full -z-10" />
        
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-blue-400"
          >
            <Sparkles size={14} className="text-yellow-400" />
            <span>New: Interactive SVG Trophies</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50"
          >
            Showcase Your <br /> GitHub Achievements
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-400 max-w-2xl mx-auto"
          >
            Generate professional trophies for your GitHub profile README. 
            Track commits, stars, and PRs with beautiful, animated visualizations.
          </motion.p>

          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleGenerate}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto pt-4"
          >
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500">
                <Github size={20} />
              </div>
              <input 
                type="text" 
                placeholder="Enter GitHub username..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-600"
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <Search size={20} />
                  Generate
                </>
              )}
            </button>
          </motion.form>
          
          {error && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-sm font-medium"
            >
              {error}
            </motion.p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 pb-24">
        <AnimatePresence mode="wait">
          {svgUrl ? (
            <motion.div
              key="stats"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-12"
            >
              {/* Preview Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <Sparkles className="text-yellow-400" />
                    Live Preview
                  </h3>
                  <div className="flex items-center gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
                    <button 
                      onClick={() => handleThemeChange('light')}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${theme === 'light' ? 'bg-white text-black' : 'hover:bg-white/5'}`}
                    >
                      Light
                    </button>
                    <button 
                      onClick={() => handleThemeChange('dark')}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${theme === 'dark' ? 'bg-white text-black' : 'hover:bg-white/5'}`}
                    >
                      Dark
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-center overflow-x-auto p-4 bg-white/5 border border-white/10 rounded-2xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={svgUrl} alt="GitHub Trophies" className="max-w-full h-auto shadow-2xl rounded-xl" />
                </div>

                <div className="flex flex-wrap justify-center gap-4 pt-4">
                  <button onClick={downloadSvg} className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all flex items-center gap-2 font-bold">
                    <Download size={18} />
                    Download SVG
                  </button>
                  <button onClick={copyMarkdown} className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2 font-bold">
                    {copiedMd ? <Check size={18} /> : <Code size={18} />}
                    {copiedMd ? 'Copied!' : 'Copy Markdown'}
                  </button>
                </div>
              </div>

              {/* GitHub Actions Section */}
              <div className="grid md:grid-cols-2 gap-8 pt-12 border-t border-white/5">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400">
                    <Settings2 size={24} />
                  </div>
                  <h3 className="text-2xl font-bold">Setup GitHub Actions</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Keep your trophies updated automatically every day. 
                    Copy this workflow to your repository to automate the process.
                  </p>
                  <ul className="space-y-3 text-sm text-slate-300">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      Create <code className="bg-white/10 px-1.5 py-0.5 rounded">.github/workflows/trophy.yml</code>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      Paste the workflow code
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      Add <code className="bg-white/10 px-1.5 py-0.5 rounded">APP_DOMAIN</code> to secrets (e.g., your-app.com)
                    </li>
                  </ul>
                </div>
                
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                  <div className="relative bg-[#0d1117] rounded-2xl border border-white/10 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
                      <span className="text-xs font-mono text-slate-400">trophy.yml</span>
                      <button 
                        onClick={copyWorkflow}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400"
                      >
                        {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                      </button>
                    </div>
                    <pre className="p-6 text-xs font-mono text-slate-300 overflow-x-auto">
                      <code>{`name: Update GitHub Trophies
on:
  schedule:
    - cron: '0 0 * * *'
  push:
    branches:
      - main
jobs:
  update-trophies:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Download Trophy SVG
        run: curl -o trophy.svg "https://\${{ secrets.APP_DOMAIN }}/api/trophy?username=${username || 'your-username'}&theme=${theme}"
        
      - name: Commit & Push
        run: |
          git config user.name github-actions
          git config user.email github-actions@github.com
          git add trophy.svg
          git commit -m "Update GitHub Trophies" || exit 0
          git push`}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12"
            >
              {[
                {
                  title: 'Real-time Stats',
                  desc: 'Fetch your latest commits, stars, and PRs directly from GitHub.',
                  icon: <Github className="text-blue-400" />
                },
                {
                  title: 'Dynamic Levels',
                  desc: 'Level up your trophies as you contribute more to open source.',
                  icon: <Sparkles className="text-purple-400" />
                },
                {
                  title: 'SVG Export',
                  desc: 'High-quality SVG files that look great on any screen size.',
                  icon: <Code className="text-green-400" />
                }
              ].map((feature, i) => (
                <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4 hover:bg-white/[0.07] transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <h4 className="text-xl font-bold">{feature.title}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Sparkles className="text-blue-500" />
            <span>TrophyGen</span>
          </div>
          <div className="flex items-center gap-8 text-sm text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
          </div>
          <p className="text-xs text-slate-600">
            © 2026 TrophyGen. Built for developers.
          </p>
        </div>
      </footer>
    </div>
  );
}
