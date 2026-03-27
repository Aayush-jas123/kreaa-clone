import { Sparkles, Image as ImageIcon, Video, ArrowRight, Zap, Diamond, FolderOpen, Clock } from 'lucide-react';
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import ProjectCard from '@/components/ProjectCard';

export default async function Home() {
  const { userId } = await auth();
  
  let projects: any[] = [];
  if (userId) {
    projects = await prisma.project.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      take: 6
    });
  }

  return (
    <div className="w-full h-full p-8 md:p-12">
      {/* Hero Section - Only show if no projects or signed out */}
      {(!userId || projects.length === 0) && (
        <section className="w-full rounded-3xl bg-gradient-to-br from-[#E2Beb7] to-[#D59885] p-16 flex flex-col items-center justify-center relative overflow-hidden group mb-12 shadow-xl shadow-rose-900/10">
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 text-center drop-shadow-md z-10">
            Start by generating a free image
          </h1>
          <div className="flex gap-4 z-10">
            <Link href="/editor" className="bg-white/90 hover:bg-white text-rose-950 px-6 py-3 rounded-full font-medium flex items-center gap-2 transition-transform hover:scale-105 shadow-lg">
              <Sparkles className="w-4 h-4" />
              Generate Image <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      {/* Projects Section - Always visible if signed in */}
      {userId && projects.length > 0 && (
        <section className="mb-12">
           <div className="flex items-center justify-between mb-8">
             <h2 className="text-2xl font-bold text-white flex items-center gap-3">
               <FolderOpen className="w-6 h-6 text-blue-400" />
               Recent Projects
             </h2>
             <Link href="/editor" className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
               Create New +
             </Link>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
             ))}
           </div>
        </section>
      )}

      {/* Ad Banner */}
      <section className="w-full rounded-2xl bg-[#111111] border border-zinc-800/50 p-8 flex items-center justify-between mb-12 shadow-xl">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
             Try <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Max</span>
          </h2>
          <ul className="text-zinc-400 space-y-1 font-medium text-sm mt-4">
            <li>• Upscale images & videos to 22K</li>
            <li>• Lora fine-tuning</li>
            <li>• Access all 150+ models</li>
            <li>• Ultra fast & no throttling</li>
          </ul>
        </div>
        <div className="flex flex-col items-end gap-6">
          <div className="flex space-x-[-12px]">
             <div className="w-14 h-14 rounded-2xl bg-blue-500 shadow-xl border-4 border-[#111111] flex items-center justify-center z-10"><ImageIcon className="text-white w-6 h-6" /></div>
             <div className="w-14 h-14 rounded-2xl bg-purple-500 shadow-xl border-4 border-[#111111] flex items-center justify-center z-20"><Sparkles className="text-white w-6 h-6" /></div>
             <div className="w-14 h-14 rounded-2xl bg-emerald-500 shadow-xl border-4 border-[#111111] flex items-center justify-center z-30"><Zap className="text-white w-6 h-6" /></div>
          </div>
          <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
            View pricing
          </button>
        </div>
      </section>

      {/* Models Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Explore image models <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-zinc-800 text-xs text-zinc-400 ml-2">Q</span></h2>
          <div className="flex gap-2">
            <button className="p-2 rounded-full bg-zinc-900 text-zinc-400 hover:text-white transition-colors border border-zinc-800"><ArrowRight className="w-5 h-5 rotate-180" /></button>
            <button className="p-2 rounded-full bg-zinc-900 text-zinc-400 hover:text-white transition-colors border border-zinc-800"><ArrowRight className="w-5 h-5" /></button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Model cards omitted for brevity, but I will keep a few as placeholders */}
          <div className="group rounded-2xl overflow-hidden bg-[#111111] border border-zinc-800/50 hover:border-zinc-700 transition-colors cursor-pointer shadow-lg">
            <div className="h-48 bg-slate-800 relative overflow-hidden group-hover:scale-105 transition-transform duration-500 origin-bottom">
               <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-black/40 to-transparent z-10" />
               <div className="absolute top-4 left-4 z-20 flex gap-2">
                 <span className="bg-white/90 px-2 py-1 rounded text-[10px] font-bold text-black uppercase tracking-wider flex items-center gap-1"><Diamond className="w-3 h-3"/> Featured</span>
               </div>
               <div className="absolute bottom-4 left-4 z-20">
                 <h3 className="text-xl font-bold text-white mb-1">Nano Banana 2</h3>
                 <p className="text-xs text-zinc-400 line-clamp-2 pr-4 font-medium">Google's latest flash image model optimized for fast generation.</p>
               </div>
            </div>
            <div className="p-4 flex items-center justify-between text-zinc-500">
               <div className="flex items-center gap-1 text-sm font-semibold"><Zap className="w-4 h-4 text-white"/> Fast</div>
               <div className="text-xs font-mono">~5s</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
