import { Handle, Position } from '@xyflow/react';
import { Type, X } from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';

export default function PromptNode({ id, data }: any) {
  const updateNodeData = useEditorStore((state) => state.updateNodeData);
  const deleteNode = useEditorStore((state) => state.deleteNode);

  return (
    <div className="bg-[#18181b] border border-[#3f3f46] rounded-xl shadow-2xl w-72 overflow-hidden transition-all hover:border-zinc-500 group relative">
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button onClick={() => deleteNode(id)} className="p-1 rounded bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors cursor-pointer">
          <X className="w-3 h-3" />
        </button>
      </div>

      <div className="bg-[#27272a]/80 backdrop-blur-md px-4 py-2.5 flex items-center justify-between border-b border-[#3f3f46]">
        <div className="flex items-center gap-2">
          <Type className="w-4 h-4 text-zinc-400" />
          <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Prompt</span>
        </div>
      </div>
      
      <div className="p-4">
        <textarea 
          className="w-full h-28 bg-[#0e0e0e] text-white text-sm rounded-lg p-3 border border-[#3f3f46] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 resize-none transition-all placeholder:text-zinc-600 shadow-inner"
          placeholder="Describe your image in detail..."
          value={data.prompt || ''}
          onChange={(e) => updateNodeData(id, { prompt: e.target.value })}
        />
      </div>
      
      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-3.5 h-3.5 bg-blue-500 border-2 border-[#18181b]" 
      />
    </div>
  );
}
