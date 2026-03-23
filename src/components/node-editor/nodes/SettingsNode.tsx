"use client";

import { Handle, Position } from '@xyflow/react';
import { SlidersHorizontal, X } from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';

const SETTINGS_DEFAULTS = {
  guidance_scale: 7.5,
  steps: 30,
  width: 1024,
  height: 1024,
};

export default function SettingsNode({ id, data }: any) {
  const deleteNode = useEditorStore((state) => state.deleteNode);
  const updateNodeData = useEditorStore((state) => state.updateNodeData);

  const settings = { ...SETTINGS_DEFAULTS, ...data };

  const handleChange = (key: string, value: number) => {
    updateNodeData(id, { [key]: value });
  };

  return (
    <div className="bg-[#18181b] border border-[#3f3f46] rounded-xl shadow-2xl w-72 overflow-hidden transition-all hover:border-zinc-500 group relative">
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button onClick={() => deleteNode(id)} className="p-1 rounded bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors cursor-pointer" title="Delete Node">
          <X className="w-3 h-3" />
        </button>
      </div>

      <div className="bg-[#27272a]/80 backdrop-blur-md px-4 py-2.5 flex items-center border-b border-[#3f3f46]">
        <SlidersHorizontal className="w-4 h-4 text-amber-400 mr-2" />
        <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Settings</span>
      </div>

      <div className="p-4 space-y-4">
        {/* Guidance Scale */}
        <div>
          <div className="flex justify-between mb-1.5">
            <label className="text-xs font-medium text-zinc-400">Guidance Scale</label>
            <span className="text-xs font-bold text-amber-400">{settings.guidance_scale}</span>
          </div>
          <input
            type="range" min="1" max="20" step="0.5"
            value={settings.guidance_scale}
            onChange={(e) => handleChange('guidance_scale', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-zinc-700 rounded-full appearance-none cursor-pointer accent-amber-400"
          />
          <div className="flex justify-between text-[10px] text-zinc-600 mt-1">
            <span>1</span><span>20</span>
          </div>
        </div>

        {/* Steps */}
        <div>
          <div className="flex justify-between mb-1.5">
            <label className="text-xs font-medium text-zinc-400">Steps</label>
            <span className="text-xs font-bold text-amber-400">{settings.steps}</span>
          </div>
          <input
            type="range" min="10" max="100" step="5"
            value={settings.steps}
            onChange={(e) => handleChange('steps', parseInt(e.target.value))}
            className="w-full h-1.5 bg-zinc-700 rounded-full appearance-none cursor-pointer accent-amber-400"
          />
          <div className="flex justify-between text-[10px] text-zinc-600 mt-1">
            <span>10</span><span>100</span>
          </div>
        </div>

        {/* Aspect Ratio quick-select */}
        <div>
          <label className="text-xs font-medium text-zinc-400 block mb-2">Aspect Ratio</label>
          <div className="grid grid-cols-3 gap-1.5">
            {[['1:1', 1024, 1024], ['16:9', 1024, 576], ['9:16', 576, 1024]].map(([label, w, h]) => (
              <button
                key={label as string}
                onClick={() => updateNodeData(id, { width: w, height: h })}
                className={`py-1 rounded text-xs font-medium transition-colors ${settings.width === w && settings.height === h ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
              >
                {label as string}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Right} className="w-3.5 h-3.5 bg-amber-500 border-2 border-[#18181b]" />
    </div>
  );
}
