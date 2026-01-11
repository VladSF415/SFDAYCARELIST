/**
 * Unique descriptions for guide categories
 * Used to differentiate guides on the blog hub page
 */

export const guideDescriptions: Record<string, string> = {
  'llms': 'Compare GPT-4, Claude, Gemini, and emerging models. Deep-dive into context windows, pricing, and real-world performance benchmarks for developers and businesses.',

  'code-ai': 'GitHub Copilot vs Cursor vs Codeium - which AI coding assistant delivers the best autocomplete, codebase understanding, and productivity gains for professional developers?',

  'image-generation': 'From Midjourney\'s artistic prowess to DALL-E\'s prompt accuracy and Stable Diffusion\'s customization - find the right text-to-image AI for your creative workflow.',

  'generative-ai': 'Explore platforms spanning video generation, content creation, and multi-modal AI. Runway, Jasper, Synthesia, and tools transforming creative production at scale.',

  'computer-vision': 'Enterprise-grade vision APIs from Google, AWS, and specialized platforms like Roboflow. Object detection, facial recognition, OCR, and custom model training compared.',

  'nlp': 'Natural language processing tools for sentiment analysis, entity extraction, text classification, and language understanding - from APIs to self-hosted solutions.',

  'agent-platforms': 'Build autonomous AI agents with platforms like LangChain, AutoGPT, and emerging workflow automation tools. Multi-step reasoning, tool use, and orchestration frameworks.',

  'ml-frameworks': 'TensorFlow, PyTorch, JAX, and ML infrastructure platforms. Training pipelines, model serving, MLOps, and the frameworks powering production AI systems.',

  'analytics-bi': 'AI-powered analytics platforms that automatically generate insights, build visualizations, and answer business questions in natural language - from startups to enterprises.',

  'video-ai': 'Automated video editing, subtitle generation, scene detection, and enhancement tools. Compare Descript, Runway, and platforms revolutionizing video production.',

  'video-generation': 'Create professional videos from text prompts or images. Pika, HeyGen, Luma, and platforms generating AI avatars, presentations, and marketing content.',

  'search-ai': 'Perplexity, You.com, and AI-powered search engines that provide cited answers, research capabilities, and real-time web access beyond traditional search.',

  'audio-ai': 'Voice cloning with ElevenLabs, music generation with Suno, podcast production, and audio enhancement tools transforming sound creation and editing.',

  'legal-ai': 'Legal research, contract analysis, document review, and compliance tools purpose-built for law firms, legal teams, and regulatory professionals.',

  'healthcare-ai': 'HIPAA-compliant diagnostic imaging, patient data analysis, clinical decision support, and medical AI platforms transforming healthcare delivery.',

  'workflow-automation': 'No-code AI automation platforms connecting tools, processing documents, and executing multi-step workflows - Zapier meets GPT-4.',

  'data-ai': 'Data labeling, synthetic data generation, model training infrastructure, and platforms powering the AI data flywheel from raw information to deployed models.',

  'enterprise-ai-platforms': 'Enterprise-grade AI platforms with SOC 2 compliance, on-premise deployment, custom models, and governance features for regulated industries.',

  'chatbots': 'Customer service bots, website chat, conversational AI platforms, and chatbot builders from simple FAQ bots to advanced multi-turn dialogue systems.',

  'fintech-ai': 'Fraud detection, risk assessment, algorithmic trading, credit scoring, and financial AI tools meeting strict regulatory and security requirements.'
};

/**
 * Get description for a guide category, with fallback
 */
export function getGuideDescription(categorySlug: string): string {
  // Try exact match
  if (guideDescriptions[categorySlug]) {
    return guideDescriptions[categorySlug];
  }

  // Try extracting category from slug pattern like "ultimate-guide-code-ai-ai-tools-2025"
  const categoryMatch = categorySlug.match(/(?:ultimate-guide-|guide-)([\w-]+?)(?:-ai)?(?:-tools)?(?:-\d{4})?$/);
  if (categoryMatch && guideDescriptions[categoryMatch[1]]) {
    return guideDescriptions[categoryMatch[1]];
  }

  // Fallback
  return 'Comprehensive guide covering the top tools, key features, pricing comparisons, and expert recommendations to help you choose the right platform.';
}
