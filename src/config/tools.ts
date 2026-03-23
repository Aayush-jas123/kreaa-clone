import { Image as ImageIcon, Video, Wand2, ImagePlus, SlidersHorizontal, LucideIcon } from 'lucide-react';

export type ToolItem = {
  id: string;
  name: string;
  icon: LucideIcon;
  type: 'image' | 'video' | 'enhancer' | 'image_input' | 'settings';
  description: string;
};

export const TOOL_CATALOG: ToolItem[] = [
  {
    id: 'tool-image-input',
    name: 'Add Image',
    icon: ImagePlus,
    type: 'image_input',
    description: 'Provide an initial image for manipulation',
  },
  {
    id: 'tool-image',
    name: 'Generation',
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
  {
    id: 'tool-settings',
    name: 'Settings',
    icon: SlidersHorizontal,
    type: 'settings',
    description: 'Adjust guidance scale, steps, and aspect ratio',
  },
];
