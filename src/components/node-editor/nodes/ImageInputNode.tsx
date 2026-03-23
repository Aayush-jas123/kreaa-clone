import { Handle, Position } from '@xyflow/react';
import { ImagePlus, X } from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';
import { useRef } from 'react';

export default function ImageInputNode({ id, data }: any) {
  const deleteNode = useEditorStore((state) => state.deleteNode);
  const updateNodeData = useEditorStore((state) => state.updateNodeData);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      updateNodeData(id, { baseImageUrl: event.target?.result });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-[#18181b] border border-[#3f3f46] rounded-xl shadow-2xl w-72 overflow-hidden transition-all hover:border-zinc-500 group relative">
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button onClick={() => deleteNode(id)} className="p-1 rounded bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors cursor-pointer" title="Delete Node">
          <X className="w-3 h-3" />
        </button>
      </div>
      
      <div className="bg-[#27272a]/80 backdrop-blur-md px-4 py-2.5 flex items-center justify-between border-b border-[#3f3f46]">
        <div className="flex items-center gap-2">
          <ImagePlus className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Image Input</span>
        </div>
      </div>
      
      <div className="p-4">
        {data.baseImageUrl ? (
          <div className="w-full aspect-square bg-[#0e0e0e] rounded-lg border border-[#3f3f46] overflow-hidden relative group/img cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <img src={data.baseImageUrl} alt="Uploaded base" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
              <span className="text-xs text-white font-medium">Click to replace</span>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full aspect-square bg-zinc-900 border-2 border-dashed border-zinc-700 hover:border-emerald-500/50 hover:bg-zinc-800 rounded-lg flex flex-col items-center justify-center text-zinc-400 gap-3 transition-colors"
          >
            <ImagePlus className="w-8 h-8 opacity-50" />
            <span className="text-sm font-medium">Click to upload image</span>
          </button>
        )}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleImageUpload} 
          accept="image/*" 
          className="hidden" 
        />
      </div>
      
      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-3.5 h-3.5 bg-emerald-500 border-2 border-[#18181b]" 
      />
    </div>
  );
}
