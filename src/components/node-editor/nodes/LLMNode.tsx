"use client";

import { Handle, Position } from '@xyflow/react';
import { Bot, X, Send, Loader2 } from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';
import { useState } from 'react';

export default function LLMNode({ id, data }: any) {
  const deleteNode = useEditorStore((state) => state.deleteNode);
  const updateNodeData = useEditorStore((state) => state.updateNodeData);
  const [isLoading, setIsLoading] = useState(false);

  const prompt = data.prompt || '';
  const systemPrompt = data.systemPrompt || 'You are a helpful creative AI assistant.';
  const output = data.output || '';
  const error = data.error || '';

  const handleRun = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    updateNodeData(id, { output: '', error: '' });

    try {
      const res = await fetch('/api/llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, systemPrompt }),
      });
      const result = await res.json();
      if (result.success) {
        updateNodeData(id, { output: result.text, error: '' });
      } else {
        updateNodeData(id, { error: result.error, output: '' });
      }
    } catch (e: any) {
      updateNodeData(id, { error: 'Network error', output: '' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#18181b] border border-[#3f3f46] rounded-xl shadow-2xl w-80 overflow-hidden transition-all hover:border-zinc-500 group relative">
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button onClick={() => deleteNode(id)} className="p-1 rounded bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors cursor-pointer">
          <X className="w-3 h-3" />
        </button>
      </div>

      <div className="bg-[#27272a]/80 backdrop-blur-md px-4 py-2.5 flex items-center border-b border-[#3f3f46]">
        <Bot className="w-4 h-4 text-blue-400 mr-2" />
        <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Gemini LLM</span>
      </div>

      <div className="p-4 space-y-3">
        {/* System Prompt */}
        <div>
          <label className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1 block">System Prompt</label>
          <textarea
            rows={2}
            value={systemPrompt}
            onChange={(e) => updateNodeData(id, { systemPrompt: e.target.value })}
            placeholder="You are a helpful AI..."
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-300 placeholder-zinc-600 resize-none focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* User Prompt */}
        <div>
          <label className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1 block">Prompt</label>
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => updateNodeData(id, { prompt: e.target.value })}
            placeholder="Ask Gemini something..."
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-300 placeholder-zinc-600 resize-none focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Run button */}
        <button
          onClick={handleRun}
          disabled={isLoading || !prompt.trim()}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white py-2 rounded-lg text-xs font-semibold transition-colors"
        >
          {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
          {isLoading ? 'Generating...' : 'Ask Gemini'}
        </button>

        {/* Output */}
        {output && (
          <div className="bg-zinc-900/80 border border-zinc-700 rounded-lg p-3">
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Response</p>
            <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap max-h-32 overflow-y-auto">{output}</p>
          </div>
        )}
        {error && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
            <p className="text-xs text-red-400">{error}</p>
          </div>
        )}
      </div>

      <Handle type="target" position={Position.Left} className="w-3.5 h-3.5 bg-blue-500 border-2 border-[#18181b]" />
      <Handle type="source" position={Position.Right} className="w-3.5 h-3.5 bg-blue-500 border-2 border-[#18181b]" />
    </div>
  );
}
