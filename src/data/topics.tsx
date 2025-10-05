import EleventyIcon from '@/public/topics/11ty.svg'
import AlgorithmsIcon from '@/public/topics/algo.svg'
import AngularIcon from '@/public/topics/angular.webp'
import APIServiceIcon from '@/public/topics/api.webp'
import AWSIcon from '@/public/topics/aws.svg'
import BackendIcon from '@/public/topics/backend.svg'
import CMSIcon from '@/public/topics/cms.svg'
import CollectionIcon from '@/public/topics/collection.svg'
import DLAIIcon from '@/public/topics/deeplearning-ai.png'
import DLIcon from '@/public/topics/dl.webp'
import DockerIcon from '@/public/topics/docker.svg'
import DSIcon from '@/public/topics/ds.webp'
import FreshInstallIcon from '@/public/topics/fresh-install.svg'
import GatsbyIcon from '@/public/topics/gatsby.svg'
import GitIcon from '@/public/topics/git.svg'
import GoogleIcon from '@/public/topics/google.svg'
import JSIcon from '@/public/topics/js.webp'
import LinuxIcon from '@/public/topics/linux.svg'
import AppleIcon from '@/public/topics/macos.webp'
import MathsIcon from '@/public/topics/math.webp'
import MLIcon from '@/public/topics/ml.webp'
import MLOpsIcon from '@/public/topics/mlops.webp'
import MOOCIcon from '@/public/topics/mooc.webp'
import NextJSIcon from '@/public/topics/nextjs.svg'
import NLPIcon from '@/public/topics/nlp.webp'
import OthersIcon from '@/public/topics/others.svg'
import PythonIcon from '@/public/topics/python.webp'
import SkillsIcon from '@/public/topics/skills.webp'
import SSGIcon from '@/public/topics/ssg.svg'
import TimeSeriesIcon from '@/public/topics/time-series.png'
import ToolsIcon from '@/public/topics/tools.webp'
import WebDevIcon from '@/public/topics/web-dev.svg'
import WindowsIcon from '@/public/topics/windows.svg'
import WordpressIcon from '@/public/topics/wordpress.svg'
import { Tag } from '@/src/lib/notion/interface'

const topics: Tag[] = [
  {
    name: '11ty',
    icon: EleventyIcon,
    className: 'invert'
  },
  {
    name: 'AWS',
    icon: AWSIcon
  },
  {
    name: 'Algorithms',
    icon: AlgorithmsIcon,
    pinned: true
  },
  {
    name: 'Angular',
    icon: AngularIcon,
    pinned: true
  },
  {
    name: 'API & Services',
    icon: APIServiceIcon,
    pinned: true
  },
  {
    name: 'Backend',
    icon: BackendIcon
  },
  {
    name: 'CMS',
    icon: CMSIcon,
    description: 'Content Management System'
  },
  {
    name: 'Collection',
    icon: CollectionIcon,
    description: 'Collection of resources, apps, tools, etc.'
  },
  {
    name: 'Data Science',
    icon: DSIcon,
    pinned: true
  },
  {
    name: 'Deep Learning',
    icon: DLIcon,
    pinned: true
  },
  {
    name: 'DeepLearning.AI',
    icon: DLAIIcon
  },
  {
    name: 'Docker',
    icon: DockerIcon
  },
  {
    name: 'Fresh Installation',
    description: 'What you need to do after a fresh installation of a new OS.',
    icon: FreshInstallIcon
  },
  {
    name: 'Gatsby',
    icon: GatsbyIcon
  },
  {
    name: 'Git',
    icon: GitIcon
  },
  {
    name: 'Google',
    icon: GoogleIcon
  },
  {
    name: 'JavaScript',
    icon: JSIcon,
    pinned: true
  },
  {
    name: 'Linux',
    icon: LinuxIcon
  },
  {
    name: 'Machine Learning',
    icon: MLIcon,
    pinned: true
  },
  {
    name: 'MacOS',
    icon: AppleIcon
  },
  {
    name: 'Maths',
    icon: MathsIcon,
    pinned: true
  },
  {
    name: 'MLOps',
    icon: MLOpsIcon,
    pinned: true
  },
  {
    name: 'MOOC',
    icon: MOOCIcon,
    pinned: true
  },
  {
    name: 'Next.js',
    icon: NextJSIcon,
    className: 'invert'
  },
  {
    name: 'NLP',
    icon: NLPIcon,
    description: 'Natural Language Processing',
    pinned: true
  },
  {
    name: 'Others',
    icon: OthersIcon,
    pinned: true
  },
  {
    name: 'Python',
    icon: PythonIcon,
    pinned: true
  },
  {
    name: 'Skills',
    icon: SkillsIcon,
    pinned: true
  },
  {
    name: 'SSG',
    icon: SSGIcon,
    description: 'Static Site Generator'
  },
  {
    name: 'Tools',
    icon: ToolsIcon,
    pinned: true
  },
  {
    name: 'Time Series',
    icon: TimeSeriesIcon
  },
  {
    name: 'Web Dev',
    icon: WebDevIcon,
    pinned: true
  },
  {
    name: 'Windows',
    icon: WindowsIcon
  },
  {
    name: 'Wordpress',
    icon: WordpressIcon
  }
]

export default topics
