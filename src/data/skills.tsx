import { SkillGroupType } from '../app/components/SkillGroup'

const skills: SkillGroupType[] = [
  {
    id: 'languages',
    name: 'Languages',
    list: ['freefempp', 'js', 'matlab', 'php', 'python', 'ts']
  },
  {
    id: 'ai-data',
    name: 'AI & Data',
    list: [
      'airflow',
      'detectron2',
      'dialogflow',
      'huggingface',
      'jupyter',
      'openai',
      'pytorch',
      'scikit-learn',
      'tensorflow',
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
      'wordpress'
    ]
  },
  {
    id: 'backend',
    name: 'Backend',
    list: [
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
      'vertex-ai'
    ]
  },
  {
    id: 'tools-services',
    name: 'Tools & Services',
    list: [
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
      'vscode'
    ]
  }
]

export default skills
