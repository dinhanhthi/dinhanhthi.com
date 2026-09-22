import EleventyIcon from '@/public/about/techs/11ty.svg'
import AirflowIcon from '@/public/about/techs/airflow.svg'
import AngularIcon from '@/public/about/techs/angular.svg'
import AWSIcon from '@/public/about/techs/aws.svg'
import AzureIcon from '@/public/about/techs/azure.svg'
import BashIcon from '@/public/about/techs/bash.svg'
import BootstrapIcon from '@/public/about/techs/bootstrap.svg'
import ChromeIcon from '@/public/about/techs/chrome.svg'
import ClaudeIcon from '@/public/about/techs/claude.svg'
import CursorIcon from '@/public/about/techs/cursor.svg'
import DialogflowIcon from '@/public/about/techs/dialogflow.svg'
import DockerIcon from '@/public/about/techs/docker.svg'
import FaceFusionIcon from '@/public/about/techs/facefusion.png'
import FreefemIcon from '@/public/about/techs/ff.svg'
import FirebaseIcon from '@/public/about/techs/firebase.svg'
import FoursquareIcon from '@/public/about/techs/foursquare.svg'
import GatsbyIcon from '@/public/about/techs/gatsby.svg'
import GCPIcon from '@/public/about/techs/gcp.svg'
import GeminiIcon from '@/public/about/techs/gemini.svg'
import GitIcon from '@/public/about/techs/git.svg'
import GithubIcon from '@/public/about/techs/github.svg'
import GitkrakenIcon from '@/public/about/techs/gitkraken.svg'
import GitlabIcon from '@/public/about/techs/gitlab.svg'
import GooglenodejsIcon from '@/public/about/techs/google-nodejs-api.svg'
import GraphqlIcon from '@/public/about/techs/graphql.svg'
import GrpcIcon from '@/public/about/techs/grpc.svg'
import HerokuIcon from '@/public/about/techs/heroku.svg'
import HtmlIcon from '@/public/about/techs/html.svg'
import HuggingFaceIcon from '@/public/about/techs/huggingface.svg'
import ImgurIcon from '@/public/about/techs/imgur.svg'
import JekyllIcon from '@/public/about/techs/jekyll.svg'
import JestIcon from '@/public/about/techs/jestjs.svg'
import JsIcon from '@/public/about/techs/js.svg'
import JupyterIcon from '@/public/about/techs/jupyter.svg'
import LatexIcon from '@/public/about/techs/latex.svg'
import LinkedinIcon from '@/public/about/techs/linkedin.svg'
import LinuxIcon from '@/public/about/techs/linux.svg'
import LiquidIcon from '@/public/about/techs/liquid.svg'
import MatlabIcon from '@/public/about/techs/matlab.svg'
import MistralIcon from '@/public/about/techs/mistral.svg'
import MongoIcon from '@/public/about/techs/mongodb.svg'
import MysqlIcon from '@/public/about/techs/mysql.svg'
import NestjsIcon from '@/public/about/techs/nestjs.svg'
import NextJSIcon from '@/public/about/techs/nextjs.svg'
import NodejsIcon from '@/public/about/techs/node.svg'
import NotionIcon from '@/public/about/techs/notion.svg'
import NunjucksIcon from '@/public/about/techs/nunjucks.svg'
import OneSignalIcon from '@/public/about/techs/onesignal.svg'
import OpenAIIcon from '@/public/about/techs/openai.svg'
import PhpIcon from '@/public/about/techs/php.svg'
import PostgreIcon from '@/public/about/techs/postgresql.svg'
import PostmanIcon from '@/public/about/techs/postman.svg'
import PythonIcon from '@/public/about/techs/python.svg'
import PytorchIcon from '@/public/about/techs/pytorch.svg'
import RIcon from '@/public/about/techs/r.svg'
import ReactIcon from '@/public/about/techs/react.svg'
import RubyIcon from '@/public/about/techs/ruby.svg'
import RxjsIcon from '@/public/about/techs/rxjs.svg'
import ScssIcon from '@/public/about/techs/sass.svg'
import ScikitlearnIcon from '@/public/about/techs/scikit-learn.svg'
import SphinxIcon from '@/public/about/techs/sphinx.svg'
import SqlIcon from '@/public/about/techs/sql.svg'
import SupabaseIcon from '@/public/about/techs/supabase.svg'
import TailwindIcon from '@/public/about/techs/tailwindcss.svg'
import TerraformIcon from '@/public/about/techs/terraform.svg'
import TensorflowIcon from '@/public/about/techs/tf.svg'
import TypescriptIcon from '@/public/about/techs/ts.svg'
import VastAIIcon from '@/public/about/techs/vastai.png'
import VercelIcon from '@/public/about/techs/vercel.svg'
import VertexAIIcon from '@/public/about/techs/vertex.png'
import ViteIcon from '@/public/about/techs/vite.svg'
import VscodeIcon from '@/public/about/techs/vscode.svg'
import WordpressIcon from '@/public/about/techs/wordpress.svg'
import XAIIcon from '@/public/about/techs/xai.svg'
import { ImageType } from '../lib/types'

export type TechCategory =
  | 'ai'
  | 'language'
  | 'frontend'
  | 'backend'
  | 'database'
  | 'cloud'
  | 'devops'
  | 'data'
  | 'science'
  | 'tools'

export type TechItem = {
  id: string
  name: string
  icon: ImageType
  url: string
  imgClass?: string
  category: TechCategory
}

const techs: TechItem[] = [
  {
    id: 'airflow',
    name: 'Airflow',
    icon: AirflowIcon,
    url: 'https://airflow.apache.org/',
    category: 'data'
  },
  {
    id: 'angular',
    name: 'Angular',
    icon: AngularIcon,
    url: 'https://angular.io/',
    category: 'frontend'
  },
  {
    id: 'aws',
    name: 'AWS',
    icon: AWSIcon,
    url: 'https://aws.amazon.com/',
    category: 'cloud'
  },
  {
    id: 'azure',
    name: 'Azure',
    icon: AzureIcon,
    url: 'https://azure.microsoft.com/',
    category: 'cloud'
  },
  {
    id: 'bash',
    name: 'GNU Bash',
    icon: BashIcon,
    url: 'https://www.gnu.org/software/bash/',
    category: 'language'
  },
  {
    id: 'bootstrap',
    name: 'Bootstrap',
    icon: BootstrapIcon,
    url: 'https://getbootstrap.com/',
    category: 'frontend'
  },
  {
    id: 'chrome-extension',
    name: 'Chrome Extension API',
    icon: ChromeIcon,
    url: 'https://developer.chrome.com/',
    category: 'tools'
  },
  {
    id: 'cursor',
    name: 'Cursor',
    icon: CursorIcon,
    url: 'https://www.cursor.com/',
    imgClass: 'dark:invert',
    category: 'ai'
  },
  {
    id: 'claude',
    name: 'Claude',
    icon: ClaudeIcon,
    url: 'https://www.anthropic.com/',
    category: 'ai'
  },
  {
    id: 'dialogflow',
    name: 'Dialogflow',
    icon: DialogflowIcon,
    url: '/google-dialogflow-api/',
    category: 'ai'
  },
  {
    id: 'docker',
    name: 'Docker',
    icon: DockerIcon,
    url: 'https://www.docker.com/',
    category: 'devops'
  },
  {
    id: 'eleventy',
    name: 'Eleventy',
    icon: EleventyIcon,
    url: 'https://www.11ty.dev/',
    imgClass: 'dark:invert',
    category: 'frontend'
  },
  {
    id: 'facefusion',
    name: 'FaceFusion',
    icon: FaceFusionIcon,
    url: 'https://facefusion.io/',
    imgClass: 'dark:invert',
    category: 'ai'
  },
  {
    id: 'firebase',
    name: 'Firebase',
    icon: FirebaseIcon,
    url: 'https://firebase.google.com/',
    category: 'cloud'
  },
  {
    id: 'foursquare-api',
    name: 'Foursquare API',
    icon: FoursquareIcon,
    url: 'https://developer.foursquare.com/',
    category: 'tools'
  },
  {
    id: 'freefempp',
    name: 'FreeFEM++',
    icon: FreefemIcon,
    url: 'http://www3.freefem.org/',
    category: 'science'
  },
  {
    id: 'gatsby',
    name: 'GatsbyJS',
    icon: GatsbyIcon,
    url: 'https://www.gatsbyjs.com/',
    category: 'frontend'
  },
  {
    id: 'git',
    name: 'Git',
    icon: GitIcon,
    url: 'https://git-scm.com/',
    category: 'devops'
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: GithubIcon,
    url: 'https://github.com/',
    category: 'devops'
  },
  {
    id: 'gitlab',
    name: 'GitLab',
    icon: GitlabIcon,
    url: 'https://gitlab.com/',
    category: 'devops'
  },
  {
    id: 'gitkraken',
    name: 'GitKraken',
    icon: GitkrakenIcon,
    url: 'https://www.gitkraken.com/',
    category: 'tools'
  },
  {
    id: 'gemini',
    name: 'Gemini',
    icon: GeminiIcon,
    url: 'https://gemini.google.com/',
    category: 'ai'
  },
  {
    id: 'gcp',
    name: 'Google Cloud Platform',
    icon: GCPIcon,
    url: '/tags/google/',
    category: 'cloud'
  },
  {
    id: 'google-nodejs-api',
    name: 'Google NodeJS API',
    icon: GooglenodejsIcon,
    url: 'https://github.com/googleapis/google-api-nodejs-client',
    category: 'tools'
  },
  {
    id: 'graphql',
    name: 'GraphQL',
    icon: GraphqlIcon,
    url: 'https://graphql.org/',
    category: 'backend'
  },
  {
    id: 'grpc',
    name: 'gRPC',
    icon: GrpcIcon,
    url: 'https://grpc.io/',
    category: 'backend'
  },
  {
    id: 'heroku',
    name: 'Heroku',
    icon: HerokuIcon,
    url: 'https://www.heroku.com/',
    category: 'cloud'
  },
  {
    id: 'html5',
    name: 'HTML5',
    icon: HtmlIcon,
    url: 'https://html.com/html5/',
    category: 'frontend'
  },
  {
    id: 'huggingface',
    name: 'Hugging Face',
    icon: HuggingFaceIcon,
    url: 'https://huggingface.co/',
    category: 'ai'
  },
  {
    id: 'imgur',
    name: 'Imgur API',
    icon: ImgurIcon,
    url: 'https://apidocs.imgur.com/',
    category: 'tools'
  },
  {
    id: 'jekyll',
    name: 'Jekyll',
    icon: JekyllIcon,
    url: 'https://jekyllrb.com/',
    category: 'frontend'
  },
  {
    id: 'jestjs',
    name: 'JestJS',
    icon: JestIcon,
    url: 'https://jestjs.io/',
    category: 'tools'
  },
  {
    id: 'js',
    name: 'JavaScript',
    icon: JsIcon,
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    category: 'language'
  },
  {
    id: 'jupyter',
    name: 'Jupyter',
    icon: JupyterIcon,
    url: 'https://jupyter.org/',
    category: 'data'
  },
  {
    id: 'latex',
    name: 'LaTeX',
    icon: LatexIcon,
    url: 'https://www.latex-project.org/',
    imgClass: 'dark:invert',
    category: 'science'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn API',
    icon: LinkedinIcon,
    url: 'https://developer.linkedin.com/',
    category: 'tools'
  },
  {
    id: 'linux',
    name: 'Linux',
    icon: LinuxIcon,
    url: 'https://www.linux.org/',
    category: 'devops'
  },
  {
    id: 'liquid',
    name: 'Liquid',
    icon: LiquidIcon,
    url: 'https://shopify.github.io/liquid/',
    category: 'frontend'
  },
  {
    id: 'matlab',
    name: 'Matlab',
    icon: MatlabIcon,
    url: 'https://www.mathworks.com/discovery/what-is-matlab.html',
    category: 'science'
  },
  {
    id: 'mistral',
    name: 'Mistral',
    icon: MistralIcon,
    url: 'https://mistral.ai/',
    category: 'ai'
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    icon: MongoIcon,
    url: 'https://www.mongodb.com/',
    category: 'database'
  },
  {
    id: 'mysql',
    name: 'MySQL',
    icon: MysqlIcon,
    url: 'https://www.mysql.com/',
    category: 'database'
  },
  {
    id: 'nestjs',
    name: 'NestJS',
    icon: NestjsIcon,
    url: 'https://nestjs.com/',
    category: 'backend'
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    icon: NextJSIcon,
    url: 'https://nextjs.org/',
    imgClass: 'dark:invert',
    category: 'frontend'
  },
  {
    id: 'nodejs',
    name: 'NodeJS',
    icon: NodejsIcon,
    url: 'https://nodejs.org/',
    category: 'backend'
  },
  {
    id: 'notion',
    name: 'Notion API',
    icon: NotionIcon,
    url: 'https://developers.notion.com/',
    category: 'tools'
  },
  {
    id: 'nunjucks',
    name: 'Nunjucks',
    icon: NunjucksIcon,
    url: 'https://mozilla.github.io/nunjucks/',
    category: 'frontend'
  },
  {
    id: 'onesignal',
    name: 'OneSignal',
    icon: OneSignalIcon,
    url: 'https://onesignal.com/',
    category: 'tools'
  },
  {
    id: 'openai',
    name: 'OpenAI API',
    icon: OpenAIIcon,
    url: 'https://platform.openai.com/docs/api-reference/',
    imgClass: 'dark:invert',
    category: 'ai'
  },
  {
    id: 'php',
    name: 'PHP',
    icon: PhpIcon,
    url: 'https://www.php.net/',
    category: 'language'
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    icon: PostgreIcon,
    url: 'https://www.postgresql.org/',
    category: 'database'
  },
  {
    id: 'postman',
    name: 'Postman',
    icon: PostmanIcon,
    url: 'https://www.getpostman.com/',
    category: 'tools'
  },
  {
    id: 'python',
    name: 'Python',
    icon: PythonIcon,
    url: 'https://www.python.org/',
    category: 'language'
  },
  {
    id: 'pytorch',
    name: 'PyTorch',
    icon: PytorchIcon,
    url: 'https://pytorch.org/',
    category: 'ai'
  },
  {
    id: 'r-lang',
    name: 'R Lang',
    icon: RIcon,
    url: 'https://www.r-project.org/',
    category: 'language'
  },
  {
    id: 'react',
    name: 'React',
    icon: ReactIcon,
    url: 'https://reactjs.org/',
    category: 'frontend'
  },
  {
    id: 'ruby',
    name: 'Ruby',
    icon: RubyIcon,
    url: 'https://www.ruby-lang.org/',
    category: 'language'
  },
  {
    id: 'rxjs',
    name: 'RxJS',
    icon: RxjsIcon,
    url: 'https://rxjs.dev/',
    category: 'frontend'
  },
  {
    id: 'scikit-learn',
    name: 'Scikit-learn',
    icon: ScikitlearnIcon,
    url: 'https://scikit-learn.org/',
    category: 'ai'
  },
  {
    id: 'scss',
    name: 'SCSS',
    icon: ScssIcon,
    url: 'https://sass-lang.com/',
    category: 'frontend'
  },
  {
    id: 'sphinx',
    name: 'Sphinx Doc',
    icon: SphinxIcon,
    url: 'https://www.sphinx-doc.org/',
    category: 'tools'
  },
  {
    id: 'sql',
    name: 'SQL',
    icon: SqlIcon,
    url: 'https://en.wikipedia.org/wiki/SQL',
    category: 'language'
  },
  {
    id: 'supabase',
    name: 'Supabase',
    icon: SupabaseIcon,
    url: 'https://supabase.com/',
    category: 'database'
  },
  {
    id: 'tensorflow',
    name: 'TensorFlow',
    icon: TensorflowIcon,
    url: 'https://www.tensorflow.org/',
    category: 'ai'
  },
  {
    id: 'ts',
    name: 'TypeScript',
    icon: TypescriptIcon,
    url: 'https://www.typescriptlang.org/',
    category: 'language'
  },
  {
    id: 'tailwindcss',
    name: 'Tailwind',
    icon: TailwindIcon,
    url: 'https://tailwindcss.com/',
    category: 'frontend'
  },
  {
    id: 'terraform',
    name: 'Terraform',
    icon: TerraformIcon,
    url: 'https://terraform.io/',
    category: 'devops'
  },
  {
    id: 'vastai',
    name: 'VastAI',
    icon: VastAIIcon,
    url: 'https://vast.ai/',
    imgClass: 'dark:invert',
    category: 'ai'
  },
  {
    id: 'vercel',
    name: 'Vercel',
    icon: VercelIcon,
    url: 'https://vercel.com/',
    imgClass: 'dark:invert',
    category: 'cloud'
  },
  {
    id: 'vertex-ai',
    name: 'Vertex AI',
    icon: VertexAIIcon,
    url: '/google-vertex-ai/',
    category: 'ai'
  },
  {
    id: 'vite',
    name: 'Vite',
    icon: ViteIcon,
    url: 'https://vitejs.dev/',
    category: 'frontend'
  },
  {
    id: 'vscode',
    name: 'VS Code',
    icon: VscodeIcon,
    url: 'https://code.visualstudio.com/',
    category: 'tools'
  },
  {
    id: 'wordpress',
    name: 'Wordpress',
    icon: WordpressIcon,
    url: 'https://wordpress.org/',
    category: 'frontend'
  },
  {
    id: 'xai',
    name: 'XAI',
    icon: XAIIcon,
    url: 'https://xai.com/',
    imgClass: 'dark:invert',
    category: 'ai'
  }
]

export default techs
