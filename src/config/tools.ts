import { Image as ImageIcon, Video, Wand2, LucideIcon } from 'lucide-react';

export type ToolItem = {
  id: string;
  name: string;
  icon: LucideIcon;
  type: 'image' | 'video' | 'enhancer';
  description: string;
};

export const TOOL_CATALOG: ToolItem[] = [
  {
    id: 'tool-image',
    name: 'Image',
    icon: ImageIcon,
    type: 'image',
    description: 'Generate an image from a text prompt',
  },
  {
    id: 'tool-video',
    name: 'Video',
    icon: Video,
    type: 'video',
    description: 'Create video animations from images or prompts',
  },
  {
    id: 'tool-enhancer',
    name: 'Enhancer',
    icon: Wand2,
    type: 'enhancer',
    description: 'Upscale and enhance image quality',
  },
];
