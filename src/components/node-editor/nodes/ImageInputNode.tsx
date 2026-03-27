import { useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import { ImagePlus, X, Loader2 } from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';

import Uppy from '@uppy/core';
import Transloadit from '@uppy/transloadit';
import { DashboardModal } from '@uppy/react';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';

export default function ImageInputNode({ id, data }: any) {
  const deleteNode = useEditorStore((state) => state.deleteNode);
  const updateNodeData = useEditorStore((state) => state.updateNodeData);

  const [uppy] = useState(() => new Uppy({
      restrictions: {
        maxNumberOfFiles: 1,
        allowedFileTypes: ['image/*']
      }
    })
    .use(Transloadit, {
      waitForEncoding: true,
      params: {
        auth: { key: process.env.NEXT_PUBLIC_TRANSLOADIT_AUTH_KEY || '' },
      },
    })
  );

  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    uppy.on('upload', () => setIsUploading(true));

    uppy.on('transloadit:complete', (assembly) => {
      let finalUrl = '';
      if (assembly.results && Object.keys(assembly.results).length > 0) {
         const stepName = Object.keys(assembly.results)[0];
         finalUrl = assembly.results[stepName][0].ssl_url;
      } else if (assembly.uploads && assembly.uploads.length > 0) {
         finalUrl = assembly.uploads[0].ssl_url;
      }
      
      if (finalUrl) {
         updateNodeData(id, { baseImageUrl: finalUrl });
      }
      setIsUploading(false);
      setIsOpen(false);
      uppy.cancelAll();
    });

    uppy.on('error', (error) => {
      console.error('Uppy error:', error);
      setIsUploading(false);
    });

    return () => uppy.destroy();
  }, [uppy, id, updateNodeData]);

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
      
      <div className="p-4 relative">
        {data.baseImageUrl ? (
          <div className="w-full aspect-square bg-[#0e0e0e] rounded-lg border border-[#3f3f46] overflow-hidden relative group/img cursor-pointer" onClick={() => setIsOpen(true)}>
            <img src={data.baseImageUrl} alt="Uploaded base" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
              <span className="text-xs text-white font-medium">Click to replace</span>
            </div>
            {isUploading && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center">
                 <Loader2 className="w-6 h-6 animate-spin text-emerald-400 mb-2" />
                 <span className="text-xs text-emerald-400">Uploading...</span>
              </div>
            )}
          </div>
        ) : (
          <button 
            onClick={() => setIsOpen(true)}
            className="w-full aspect-square bg-zinc-900 border-2 border-dashed border-zinc-700 hover:border-emerald-500/50 hover:bg-zinc-800 rounded-lg flex flex-col items-center justify-center text-zinc-400 gap-3 transition-colors relative"
          >
            {isUploading ? (
              <>
                 <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
                 <span className="text-sm font-medium text-emerald-400">Uploading...</span>
              </>
            ) : (
              <>
                <ImagePlus className="w-8 h-8 opacity-50" />
                <span className="text-sm font-medium">Click to upload image</span>
              </>
            )}
          </button>
        )}
      </div>
      
      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-3.5 h-3.5 bg-emerald-500 border-2 border-[#18181b]" 
      />

      <DashboardModal
        uppy={uppy}
        open={isOpen}
        onRequestClose={() => setIsOpen(false)}
        closeModalOnClickOutside
        proudlyDisplayPoweredByUppy={false}
      />
    </div>
  );
}
