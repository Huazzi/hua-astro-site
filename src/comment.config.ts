import { theme } from './site.config'

type CommentConfig = {
  provider: 'waline' | 'twikoo' | 'none'
  twikoo: {
    enable: boolean
    envId: string
    cdn: string
    lang: string
  }
}

export const comment: CommentConfig = {
  provider: 'twikoo',
  twikoo: {
    enable: true,
    envId: 'https://blog-comments-twikoo.netlify.app/.netlify/functions/twikoo',
    cdn: `${theme.npmCDN}/twikoo/dist/twikoo.min.js`,
    lang: 'zh-CN'
  }
}
