import { Handle, Position } from '@xyflow/react';
import { Image as ImageIcon, Download, Sparkles, X } from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';

export default function ImageNode({ id, data }: any) {
  const deleteNode = useEditorStore((state) => state.deleteNode);

  const handleDownload = () => {
    if (!data.imageUrl) return;
    const link = document.createElement('a');
    link.href = data.imageUrl;
    link.download = `krea-generation-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#18181b] border border-[#3f3f46] rounded-xl shadow-2xl w-72 overflow-hidden transition-all hover:border-zinc-500 group relative">
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center gap-1">
        {data.imageUrl && !data.isLoading && (
          <button onClick={handleDownload} className="p-1 rounded bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors cursor-pointer" title="Download Image">
            <Download className="w-3 h-3" />
          </button>
        )}
        <button onClick={() => deleteNode(id)} className="p-1 rounded bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors cursor-pointer" title="Delete Node">
          <X className="w-3 h-3" />
        </button>
      </div>

      <Handle 
        type="target" 
        position={Position.Left} 
        className="w-3.5 h-3.5 bg-purple-500 border-2 border-[#18181b]" 
      />
      
      <div className="bg-[#27272a]/80 backdrop-blur-md px-4 py-2.5 flex items-center justify-between border-b border-[#3f3f46]">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-zinc-400" />
          <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Generated Image</span>
        </div>
      </div>
      
      <div className="p-4">
        <div className={`w-full aspect-square bg-[#0e0e0e] rounded-lg border flex flex-col items-center justify-center text-zinc-600 overflow-hidden relative shadow-inner ${data.error ? 'border-red-500/50' : 'border-[#3f3f46]'}`}>
           {data.imageUrl && !data.isLoading ? (
             <img src={data.imageUrl} alt="Generated result" className="w-full h-full object-cover" />
           ) : (
             <div className="flex flex-col items-center gap-3 text-center">
               {data.isLoading ? (
                 <>
                   <div className="w-8 h-8 rounded-full border-4 border-zinc-700 border-t-purple-500 animate-spin" />
                   <span className="text-xs font-medium bg-purple-900/30 px-3 py-1 rounded-full text-purple-400 border border-purple-500/30 animate-pulse">Generating...</span>
                 </>
               ) : data.error ? (
                 <>
                   <X className="w-8 h-8 text-red-500 opacity-80" />
                   <span className="text-xs font-medium bg-red-900/30 px-3 py-1 rounded-full text-red-400 border border-red-500/30">{data.error}</span>
                 </>
               ) : (
                 <>
                   <ImageIcon className="w-8 h-8 opacity-40" />
                   <span className="text-xs font-medium bg-zinc-800/50 px-3 py-1 rounded-full text-zinc-500 border border-zinc-700/50">Waiting for input</span>
                 </>
               )}
             </div>
           )}
        </div>
      </div>
      
      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-3.5 h-3.5 bg-purple-500 border-2 border-[#18181b]" 
      />
    </div>
  );
}
