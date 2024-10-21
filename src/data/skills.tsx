import { SkillGroupType } from '../app/components/SkillGroup'

const skills: SkillGroupType[] = [
  {
    id: 'languages',
    name: 'Languages',
    list: ['freefempp', 'js', 'matlab', 'php', 'python', 'sql', 'ts']
  },
  {
    id: 'ai-data',
    name: 'AI & Data',
    list: [
      'airflow',
      'aws',
      // 'detectron2',
      'dialogflow',
      'huggingface',
      'jupyter',
      'openai',
      'pytorch',
      'scikit-learn',
      'tensorflow',
      'terraform',
      'vertex-ai'
    ]
  },
  {
    id: 'frontend',
    name: 'Frontend',
    list: [
      'angular',
      'bootstrap',
      'eleventy',
      'gatsby',
      'html5',
      'jekyll',
      'liquid',
      'nextjs',
      'nunjucks',
      'react',
      'rxjs',
      'scss',
      'tailwindcss',
      'vite',
      'wordpress',
      'vercel'
    ]
  },
  {
    id: 'backend',
    name: 'Backend',
    list: [
      'aws',
      'azure',
      'airflow',
      'docker',
      'firebase',
      'graphql',
      'grpc',
      'google-nodejs-api',
      'jestjs',
      'mongodb',
      'mysql',
      'nestjs',
      'nodejs',
      'postgresql',
      'supabase',
      'vercel',
      'vertex-ai'
    ]
  },
  {
    id: 'tools-services',
    name: 'Tools & Services',
    list: [
      'aws',
      'azure',
      'bash',
      'chrome-extension',
      'dialogflow',
      'imgur',
      'gcp',
      'git',
      'gitkraken',
      'huggingface',
      'latex',
      'linkedin',
      'linux',
      'notion',
      'openai',
      'postman',
      'sphinx',
      'supabase',
      'terraform',
      'vercel',
      'vscode'
    ]
  }
]

export default skills
