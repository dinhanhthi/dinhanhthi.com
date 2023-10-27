import DataswatiLogo from '@/public/about/cv/dataswati.png'
import DHSPLogo from '@/public/about/cv/dhsp.png'
import IdetaLogo from '@/public/about/cv/ideta-single.png'
import Math2ITLogo from '@/public/about/cv/math2it.png'
import P13Logo from '@/public/about/cv/p13.png'
import SelfLearnLogo from '@/public/about/cv/self-learn.webp'
import ToursLogo from '@/public/about/cv/tours.png'

import { CVGroupType } from '../app/components/CVGroup'

const cv: CVGroupType[] = [
  {
    id: 'experiences',
    name: 'Experiences',
    list: [
      {
        id: 'ideta',
        where: 'Ideta',
        bgWhite: false,
        logo: IdetaLogo,
        url: 'https://www.ideta.io',
        title: 'Data Scientist & Fullstack Developer',
        date: '2021 — ongoing',
        activity: [
          'Ideta is a solution that allows companies to very easily create conversational assistants for many communication channels like Messenger, SMS, Slack, Wechat, Skype Business, ... but also for voice like Google Home. The solution makes the creation of chatbots accessible to everyone.',
          'My job is to understand how things work both on the backend and on the frontend, and then integrate some Natural Language Processing services into the main platform.'
        ],
        tech: [
          'angular',
          'bash',
          'chrome-extension',
          'detectron2',
          'dialogflow',
          'docker',
          'firebase',
          'gcp',
          'git',
          'gitkraken',
          'google-nodejs-api',
          'js',
          'jestjs',
          'jupyter',
          'linkedin',
          'linux',
          'mongodb',
          'nestjs',
          'nodejs',
          'openai',
          'postman',
          'python',
          'pytorch',
          'rxjs',
          'scikit-learn',
          'tensorflow',
          'ts',
          'vertex-ai',
          'vite'
        ]
      },
      {
        id: 'dataswati',
        where: 'Dataswati',
        logo: DataswatiLogo,
        url: 'https://www.dataswati.com/',
        title: 'Data Scientist',
        date: '2020',
        activity: [
          'Dataswati is a company that uses artificial intelligence technologies to optimize industrial processes.',
          "I was one of the main people responsible for maintaining POPAI, Dataswati's AI library. I worked on 4 main projects/customers with different subjects in Machine Learning and Data Science."
        ],
        tech: [
          'airflow',
          'docker',
          'bash',
          'git',
          'gitkraken',
          'grpc',
          'jupyter',
          'linux',
          'mongodb',
          'mysql',
          'pytorch',
          'python',
          'r-lang',
          'scikit-learn',
          'sphinx',
          'tensorflow'
        ]
      },
      {
        id: 'math2it',
        where: 'Math2IT',
        logo: Math2ITLogo,
        url: 'https://math2it.com',
        title: 'Founder & Fullstack Developer & Writer',
        date: '2013 — current',
        activity: [
          'Math2IT is a Vietnamese math, education, and technology community. We write about intuitive math and technology that help Vietnamese learn these subjects easily.',
          "I write about math and technology in an intuitive way. I am also an administrator of <a href='https://www.facebook.com/groups/math2it' target='_blank'>a community</a> about mathematics and technology on Facebook."
        ],
        tech: [
          'bootstrap',
          'docker',
          'eleventy',
          'gatsby',
          'git',
          'gitkraken',
          'graphql',
          'html5',
          'imgur',
          'js',
          'jekyll',
          'linux',
          'mysql',
          'notion',
          'php',
          'react',
          'ruby',
          'scss',
          'wordpress'
        ]
      },
      {
        id: 'u-sorbonne-paris-nord',
        where: 'U. Sorbonne Paris Nord',
        logo: P13Logo,
        bgWhite: true,
        url: 'https://www.math.univ-paris13.fr/laga/index.php/en/',
        title: 'Researcher in Applied Maths & Coder',
        date: '2013 — 2018',
        activity: [
          "I have studied the growth of biofilms using the Finite Element Method, a numerical method of analysis. The title of <a href='https://www.theses.fr/2018USPCD083' target='_blank'>the dissertation</a> is \"<i>Finite Element Methods for Nonlinear Interface Problems. Application to a bioﬁlmic growth model</i>\". For the implementation I used FreeFem++ and a self-made NXFEM toolbox written in Matlab."
        ],
        tech: ['freefempp', 'bash', 'git', 'linux', 'matlab', 'python']
      }
    ]
  },
  {
    id: 'educations',
    name: 'Education',
    list: [
      {
        id: 'self-learning-ds',
        where: 'Self-learning',
        logo: SelfLearnLogo,
        title: 'Data Science',
        date: '2019 — current',
        activity: [
          "I've been learning myself Data Science using online courses (Coursera, deeplearning.ai, Dataquest, Fastai, Oxford) and real projects."
        ]
      },
      {
        id: 'self-learning-web-dev',
        where: 'Self-learning',
        logo: SelfLearnLogo,
        title: 'Web Development',
        date: '2013 — current',
        activity: [
          "I've been learning myself Web Development by making applications, websites and real projects."
        ]
      },
      {
        id: 'self-learning-cs',
        where: 'Self-learning',
        logo: SelfLearnLogo,
        title: 'Computer Science',
        date: '2008 — current',
        activity: [
          "I've been learning myself CS by watching online video courses, reading books, and practicing programming on sites like Hackerrank."
        ]
      },
      {
        id: 'u-sorbonne-paris-nord-doctor',
        where: 'U. Sorbonne Paris Nord',
        logo: P13Logo,
        bgWhite: true,
        url: 'https://www.math.univ-paris13.fr/laga/index.php/en/',
        title: 'Doctor in Applied Maths',
        date: '2013 — 2018',
        activity: [
          "I have studied the growth of biofilms using the Finite Element Method, a numerical method of analysis. The title of <a href='https://www.theses.fr/2018USPCD083' target='_blank'>the dissertation</a> is \"<i>Finite Element Methods for Nonlinear Interface Problems. Application to a bioﬁlmic growth model</i>\". For the implementation I used FreeFem++ and a self-made NXFEM toolbox written in Matlab."
        ]
      },
      {
        id: 'u-tours',
        where: 'U. of Tours',
        logo: ToursLogo,
        bgWhite: true,
        url: 'https://www.univ-tours.fr/',
        title: 'Master in Applied Maths',
        date: '2012 — 2013',
        activity: [
          "My Master's degree was registered at this university, but I spent most of my time studying in Vietnam and completing an internship at Paris 13 University."
        ]
      },
      {
        id: 'dhsp',
        where: 'Ho Chi Minh City Pedagogical U.',
        logo: DHSPLogo,
        url: 'https://hcmue.edu.vn/en/',
        title: 'Bachelor in Pedagogy & Maths',
        date: '2008 — 2012',
        activity: [
          'I was taught to become a math teacher. I studied a lot in mathematics and teaching methods.'
        ]
      }
    ]
  }
]

export default cv
