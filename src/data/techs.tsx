import EleventyIcon from '@/public/about/techs/11ty.svg'
import AirflowIcon from '@/public/about/techs/airflow.svg'
import AngularIcon from '@/public/about/techs/angular.svg'
import BashIcon from '@/public/about/techs/bash.svg'
import BootstrapIcon from '@/public/about/techs/bootstrap.svg'
import ChromeIcon from '@/public/about/techs/chrome.svg'
import Detectron2Icon from '@/public/about/techs/detectron2.png'
import DialogflowIcon from '@/public/about/techs/dialogflow.svg'
import DockerIcon from '@/public/about/techs/docker.svg'
import FreefemIcon from '@/public/about/techs/ff.svg'
import FirebaseIcon from '@/public/about/techs/firebase.svg'
import FoursquareIcon from '@/public/about/techs/foursquare.svg'
import GatsbyIcon from '@/public/about/techs/gatsby.svg'
import GCPIcon from '@/public/about/techs/gcp.svg'
import GitIcon from '@/public/about/techs/git.svg'
import GitkrakenIcon from '@/public/about/techs/gitkraken.svg'
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
import MongoIcon from '@/public/about/techs/mongodb.svg'
import MysqlIcon from '@/public/about/techs/mysql.svg'
import NestjsIcon from '@/public/about/techs/nestjs.svg'
import NextJSIcon from '@/public/about/techs/nextjs.svg'
import NodejsIcon from '@/public/about/techs/node.svg'
import NotionIcon from '@/public/about/techs/notion.svg'
import NunjucksIcon from '@/public/about/techs/nunjucks.svg'
import OpenAIIcon from '@/public/about/techs/openai.svg'
import PhpIcon from '@/public/about/techs/php.svg'
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
import TailwindIcon from '@/public/about/techs/tailwindcss.svg'
import TensorflowIcon from '@/public/about/techs/tf.svg'
import TypescriptIcon from '@/public/about/techs/ts.svg'
import VertexAIIcon from '@/public/about/techs/vertex.png'
import ViteIcon from '@/public/about/techs/vite.svg'
import VscodeIcon from '@/public/about/techs/vscode.svg'
import WordpressIcon from '@/public/about/techs/wordpress.svg'
import { StaticImageData } from 'next/image'

export type TechItem = {
  id: string
  name: string
  icon: StaticImageData
  url: string
  imgClass?: string
}

const techs: TechItem[] = [
  {
    id: 'airflow',
    name: 'Airflow',
    icon: AirflowIcon,
    url: 'https://airflow.apache.org/'
  },
  {
    id: 'angular',
    name: 'Angular',
    icon: AngularIcon,
    url: 'https://angular.io/'
  },
  {
    id: 'bash',
    name: 'GNU Bash',
    icon: BashIcon,
    url: 'https://www.gnu.org/software/bash/'
  },
  {
    id: 'bootstrap',
    name: 'Bootstrap',
    icon: BootstrapIcon,
    url: 'https://getbootstrap.com/'
  },
  {
    id: 'chrome-extension',
    name: 'Chrome Extension API',
    icon: ChromeIcon,
    url: 'https://developer.chrome.com/'
  },
  {
    id: 'detectron2',
    name: 'Detectron2',
    icon: Detectron2Icon,
    url: 'https://github.com/facebookresearch/detectron2'
  },
  {
    id: 'dialogflow',
    name: 'Dialogflow',
    icon: DialogflowIcon,
    url: '/google-dialogflow-api/'
  },
  {
    id: 'docker',
    name: 'Docker',
    icon: DockerIcon,
    url: 'https://www.docker.com/'
  },
  {
    id: 'eleventy',
    name: 'Eleventy',
    icon: EleventyIcon,
    url: 'https://www.11ty.dev/'
  },
  {
    id: 'firebase',
    name: 'Firebase',
    icon: FirebaseIcon,
    url: 'https://firebase.google.com/'
  },
  {
    id: 'foursquare-api',
    name: 'Foursquare API',
    icon: FoursquareIcon,
    url: 'https://developer.foursquare.com/'
  },
  {
    id: 'freefempp',
    name: 'FreeFEM++',
    icon: FreefemIcon,
    url: 'http://www3.freefem.org/'
  },
  {
    id: 'gatsby',
    name: 'GatsbyJS',
    icon: GatsbyIcon,
    url: 'https://www.gatsbyjs.com/'
  },
  {
    id: 'git',
    name: 'Git',
    icon: GitIcon,
    url: 'https://git-scm.com/'
  },
  {
    id: 'gitkraken',
    name: 'GitKraken',
    icon: GitkrakenIcon,
    url: 'https://www.gitkraken.com/'
  },
  {
    id: 'gcp',
    name: 'GCP',
    icon: GCPIcon,
    url: '/tags/google/'
  },
  {
    id: 'google-nodejs-api',
    name: 'NodeJS API',
    icon: GooglenodejsIcon,
    url: 'https://github.com/googleapis/google-api-nodejs-client'
  },
  {
    id: 'graphql',
    name: 'GraphQL',
    icon: GraphqlIcon,
    url: 'https://graphql.org/'
  },
  {
    id: 'grpc',
    name: 'gRPC',
    icon: GrpcIcon,
    url: 'https://grpc.io/'
  },
  {
    id: 'heroku',
    name: 'Heroku',
    icon: HerokuIcon,
    url: 'https://www.heroku.com/'
  },
  {
    id: 'html5',
    name: 'HTML5',
    icon: HtmlIcon,
    url: 'https://html.com/html5/'
  },
  {
    id: 'huggingface',
    name: 'Hugging Face',
    icon: HuggingFaceIcon,
    url: 'https://huggingface.co/'
  },
  {
    id: 'imgur',
    name: 'Imgur API',
    icon: ImgurIcon,
    url: 'https://apidocs.imgur.com/'
  },
  {
    id: 'jekyll',
    name: 'Jekyll',
    icon: JekyllIcon,
    url: 'https://jekyllrb.com/'
  },
  {
    id: 'jestjs',
    name: 'JestJS',
    icon: JestIcon,
    url: 'https://jestjs.io/'
  },
  {
    id: 'js',
    name: 'JavaScript',
    icon: JsIcon,
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript'
  },
  {
    id: 'jupyter',
    name: 'Jupyter',
    icon: JupyterIcon,
    url: 'https://jupyter.org/'
  },
  {
    id: 'latex',
    name: 'LaTeX',
    icon: LatexIcon,
    url: 'https://www.latex-project.org/'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn API',
    icon: LinkedinIcon,
    url: 'https://developer.linkedin.com/'
  },
  {
    id: 'linux',
    name: 'Linux',
    icon: LinuxIcon,
    url: 'https://www.linux.org/'
  },
  {
    id: 'liquid',
    name: 'Liquid',
    icon: LiquidIcon,
    url: 'https://shopify.github.io/liquid/'
  },
  {
    id: 'matlab',
    name: 'Matlab',
    icon: MatlabIcon,
    url: 'https://www.mathworks.com/discovery/what-is-matlab.html'
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    icon: MongoIcon,
    url: 'https://www.mongodb.com/'
  },
  {
    id: 'mysql',
    name: 'MySQL',
    icon: MysqlIcon,
    url: 'https://www.mysql.com/'
  },
  {
    id: 'nestjs',
    name: 'NestJS',
    icon: NestjsIcon,
    url: 'https://nestjs.com/'
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    icon: NextJSIcon,
    url: 'https://nextjs.org/'
  },
  {
    id: 'nodejs',
    name: 'NodeJS',
    icon: NodejsIcon,
    url: 'https://nodejs.org/'
  },
  {
    id: 'notion',
    name: 'Notion API',
    icon: NotionIcon,
    url: 'https://developers.notion.com/'
  },
  {
    id: 'nunjucks',
    name: 'Nunjucks',
    icon: NunjucksIcon,
    url: 'https://mozilla.github.io/nunjucks/'
  },
  {
    id: 'openai',
    name: 'OpenAI API',
    icon: OpenAIIcon,
    url: 'https://platform.openai.com/docs/api-reference/'
  },
  {
    id: 'php',
    name: 'PHP',
    icon: PhpIcon,
    url: 'https://www.php.net/'
  },
  {
    id: 'postman',
    name: 'Postman',
    icon: PostmanIcon,
    url: 'https://www.getpostman.com/'
  },
  {
    id: 'python',
    name: 'Python',
    icon: PythonIcon,
    url: 'https://www.python.org/'
  },
  {
    id: 'pytorch',
    name: 'PyTorch',
    icon: PytorchIcon,
    url: 'https://pytorch.org/'
  },
  {
    id: 'r-lang',
    name: 'R Lang',
    icon: RIcon,
    url: 'https://www.r-project.org/'
  },
  {
    id: 'react',
    name: 'React',
    icon: ReactIcon,
    url: 'https://reactjs.org/'
  },
  {
    id: 'ruby',
    name: 'Ruby',
    icon: RubyIcon,
    url: 'https://www.ruby-lang.org/'
  },
  {
    id: 'rxjs',
    name: 'RxJS',
    icon: RxjsIcon,
    url: 'https://rxjs.dev/'
  },
  {
    id: 'scikit-learn',
    name: 'Scikit-learn',
    icon: ScikitlearnIcon,
    url: 'https://scikit-learn.org/'
  },
  {
    id: 'scss',
    name: 'SCSS',
    icon: ScssIcon,
    url: 'https://sass-lang.com/'
  },
  {
    id: 'sphinx',
    name: 'Sphinx Doc',
    icon: SphinxIcon,
    url: 'https://www.sphinx-doc.org/'
  },
  {
    id: 'tensorflow',
    name: 'TensorFlow',
    icon: TensorflowIcon,
    url: 'https://www.tensorflow.org/'
  },
  {
    id: 'ts',
    name: 'TypeScript',
    icon: TypescriptIcon,
    url: 'https://www.typescriptlang.org/'
  },
  {
    id: 'tailwindcss',
    name: 'Tailwind',
    icon: TailwindIcon,
    url: 'https://tailwindcss.com/'
  },
  {
    id: 'vertex-ai',
    name: 'Vertex AI',
    icon: VertexAIIcon,
    url: '/google-vertex-ai/'
  },
  {
    id: 'vite',
    name: 'Vite',
    icon: ViteIcon,
    url: 'https://vitejs.dev/'
  },
  {
    id: 'vscode',
    name: 'VS Code',
    icon: VscodeIcon,
    url: 'https://code.visualstudio.com/'
  },
  {
    id: 'wordpress',
    name: 'Wordpress',
    icon: WordpressIcon,
    url: 'https://wordpress.org/'
  }
]

export default techs
