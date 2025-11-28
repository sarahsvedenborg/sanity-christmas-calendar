import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  app: {
    organizationId: 'o7nOtoiLa',
    entry: './src/App.tsx',
  },
   deployment: {
    appId: 'sanity-christmas-calendar',
  },
})
