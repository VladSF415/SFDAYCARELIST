interface ComparisonPlatform {
  name: string;
  features: Record<string, string | boolean>;
  pricing: string;
  bestFor: string;
}

interface CategoryComparison {
  title: string;
  description: string;
  platforms: ComparisonPlatform[];
  features: string[];
}

export const categoryComparisons: Record<string, CategoryComparison> = {
  'llms': {
    title: 'Top Large Language Models Compared',
    description: 'Side-by-side comparison of the most popular LLMs for developers, businesses, and researchers.',
    features: [
      'Context Window',
      'Vision Capabilities',
      'Code Generation',
      'API Access',
      'Real-time Data',
      'File Upload Support'
    ],
    platforms: [
      {
        name: 'ChatGPT',
        features: {
          'Context Window': '128K tokens',
          'Vision Capabilities': true,
          'Code Generation': true,
          'API Access': true,
          'Real-time Data': 'GPT-4 only',
          'File Upload Support': true
        },
        pricing: 'Free / $20/mo Pro',
        bestFor: 'General-purpose tasks & conversational AI'
      },
      {
        name: 'Claude',
        features: {
          'Context Window': '200K tokens',
          'Vision Capabilities': true,
          'Code Generation': true,
          'API Access': true,
          'Real-time Data': false,
          'File Upload Support': true
        },
        pricing: 'Free / $20/mo Pro',
        bestFor: 'Long documents, coding, & analysis'
      },
      {
        name: 'Gemini',
        features: {
          'Context Window': '1M tokens',
          'Vision Capabilities': true,
          'Code Generation': true,
          'API Access': true,
          'Real-time Data': true,
          'File Upload Support': true
        },
        pricing: 'Free / $20/mo Advanced',
        bestFor: 'Massive context & Google integration'
      },
      {
        name: 'GPT-4',
        features: {
          'Context Window': '128K tokens',
          'Vision Capabilities': true,
          'Code Generation': true,
          'API Access': true,
          'Real-time Data': true,
          'File Upload Support': true
        },
        pricing: 'API only - pay per use',
        bestFor: 'Enterprise apps & API integration'
      }
    ]
  },

  'code-ai': {
    title: 'Best AI Coding Assistants Compared',
    description: 'Compare the top AI code completion tools for developers and development teams.',
    features: [
      'IDE Support',
      'Multi-language Support',
      'Chat Interface',
      'Codebase Context',
      'Terminal Integration',
      'Team Features'
    ],
    platforms: [
      {
        name: 'GitHub Copilot',
        features: {
          'IDE Support': 'VS Code, JetBrains, Vim',
          'Multi-language Support': true,
          'Chat Interface': true,
          'Codebase Context': 'Limited',
          'Terminal Integration': true,
          'Team Features': true
        },
        pricing: '$10/mo Individual, $19/mo Business',
        bestFor: 'GitHub users & Microsoft ecosystem'
      },
      {
        name: 'Cursor',
        features: {
          'IDE Support': 'Standalone IDE',
          'Multi-language Support': true,
          'Chat Interface': true,
          'Codebase Context': 'Full codebase',
          'Terminal Integration': true,
          'Team Features': false
        },
        pricing: 'Free / $20/mo Pro',
        bestFor: 'Full codebase awareness & fast edits'
      },
      {
        name: 'Codeium',
        features: {
          'IDE Support': 'VS Code, JetBrains, 40+ IDEs',
          'Multi-language Support': true,
          'Chat Interface': true,
          'Codebase Context': 'Partial',
          'Terminal Integration': false,
          'Team Features': true
        },
        pricing: 'Free / Enterprise pricing',
        bestFor: 'Free unlimited autocomplete'
      },
      {
        name: 'Tabnine',
        features: {
          'IDE Support': 'VS Code, JetBrains, Vim',
          'Multi-language Support': true,
          'Chat Interface': false,
          'Codebase Context': 'Team-based',
          'Terminal Integration': false,
          'Team Features': true
        },
        pricing: 'Free / $12/mo Pro',
        bestFor: 'Privacy-focused teams'
      }
    ]
  },

  'image-generation': {
    title: 'AI Image Generators Compared',
    description: 'Compare the leading text-to-image AI tools for artists, designers, and content creators.',
    features: [
      'Image Quality',
      'Style Variety',
      'Inpainting/Editing',
      'Commercial Use',
      'API Access',
      'Training Speed'
    ],
    platforms: [
      {
        name: 'Midjourney',
        features: {
          'Image Quality': 'Excellent',
          'Style Variety': 'Artistic/Creative',
          'Inpainting/Editing': true,
          'Commercial Use': 'Paid plans only',
          'API Access': false,
          'Training Speed': 'Fast (60s avg)'
        },
        pricing: '$10-$120/mo',
        bestFor: 'Artistic images & creative work'
      },
      {
        name: 'DALL-E 3',
        features: {
          'Image Quality': 'Excellent',
          'Style Variety': 'Versatile',
          'Inpainting/Editing': true,
          'Commercial Use': true,
          'API Access': true,
          'Training Speed': 'Medium (30-60s)'
        },
        pricing: '$20/mo (ChatGPT Plus) or API',
        bestFor: 'Prompt accuracy & integration'
      },
      {
        name: 'Stable Diffusion',
        features: {
          'Image Quality': 'Very Good',
          'Style Variety': 'Highly Customizable',
          'Inpainting/Editing': true,
          'Commercial Use': true,
          'API Access': true,
          'Training Speed': 'Variable'
        },
        pricing: 'Free (open-source)',
        bestFor: 'Full control & customization'
      },
      {
        name: 'Leonardo AI',
        features: {
          'Image Quality': 'Excellent',
          'Style Variety': 'Game/Design focused',
          'Inpainting/Editing': true,
          'Commercial Use': true,
          'API Access': true,
          'Training Speed': 'Fast (20-40s)'
        },
        pricing: 'Free / $12-$48/mo',
        bestFor: 'Game assets & design work'
      }
    ]
  },

  'generative-ai': {
    title: 'Best Generative AI Platforms Compared',
    description: 'Compare leading generative AI platforms for content creation across text, images, video, and audio.',
    features: [
      'Content Types',
      'Output Quality',
      'Ease of Use',
      'API Integration',
      'Customization',
      'Collaboration'
    ],
    platforms: [
      {
        name: 'Runway',
        features: {
          'Content Types': 'Video, Image, Audio',
          'Output Quality': 'Excellent',
          'Ease of Use': 'User-friendly',
          'API Integration': true,
          'Customization': 'High',
          'Collaboration': true
        },
        pricing: 'Free / $12-$76/mo',
        bestFor: 'Video generation & creative workflows'
      },
      {
        name: 'Jasper',
        features: {
          'Content Types': 'Text, Images',
          'Output Quality': 'Very Good',
          'Ease of Use': 'Very Easy',
          'API Integration': true,
          'Customization': 'Medium',
          'Collaboration': true
        },
        pricing: '$49-$125/mo',
        bestFor: 'Marketing copy & brand content'
      },
      {
        name: 'Synthesia',
        features: {
          'Content Types': 'Video (AI avatars)',
          'Output Quality': 'Excellent',
          'Ease of Use': 'Easy',
          'API Integration': true,
          'Customization': 'Medium',
          'Collaboration': true
        },
        pricing: '$29-$67/mo',
        bestFor: 'Professional video presentations'
      },
      {
        name: 'Copy.ai',
        features: {
          'Content Types': 'Text',
          'Output Quality': 'Good',
          'Ease of Use': 'Very Easy',
          'API Integration': false,
          'Customization': 'Low',
          'Collaboration': true
        },
        pricing: 'Free / $49/mo',
        bestFor: 'Quick copywriting & marketing'
      }
    ]
  },

  'computer-vision': {
    title: 'Computer Vision AI Tools Compared',
    description: 'Compare top computer vision platforms for object detection, image recognition, and visual AI applications.',
    features: [
      'Object Detection',
      'Facial Recognition',
      'OCR Capabilities',
      'Real-time Processing',
      'Custom Model Training',
      'Edge Deployment'
    ],
    platforms: [
      {
        name: 'Google Cloud Vision',
        features: {
          'Object Detection': true,
          'Facial Recognition': true,
          'OCR Capabilities': true,
          'Real-time Processing': true,
          'Custom Model Training': true,
          'Edge Deployment': true
        },
        pricing: 'Pay-per-use (starts free)',
        bestFor: 'Enterprise-grade vision APIs'
      },
      {
        name: 'Amazon Rekognition',
        features: {
          'Object Detection': true,
          'Facial Recognition': true,
          'OCR Capabilities': true,
          'Real-time Processing': true,
          'Custom Model Training': true,
          'Edge Deployment': false
        },
        pricing: 'Pay-per-use',
        bestFor: 'AWS ecosystem integration'
      },
      {
        name: 'Roboflow',
        features: {
          'Object Detection': true,
          'Facial Recognition': false,
          'OCR Capabilities': false,
          'Real-time Processing': true,
          'Custom Model Training': true,
          'Edge Deployment': true
        },
        pricing: 'Free / $49-$249/mo',
        bestFor: 'Custom model training & deployment'
      },
      {
        name: 'Clarifai',
        features: {
          'Object Detection': true,
          'Facial Recognition': true,
          'OCR Capabilities': true,
          'Real-time Processing': true,
          'Custom Model Training': true,
          'Edge Deployment': true
        },
        pricing: 'Free / $30-$300/mo',
        bestFor: 'Multi-modal AI applications'
      }
    ]
  }
};
