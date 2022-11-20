import env from './env'

import { mongoHelper } from '../databases/mongodb/mongoHelper'

mongoHelper.connect(env.dbUser!, env.dbPass!)
  .then( async () => {
    const { setupApp } = await import('./app')

    const app = await setupApp()
    app.listen(env.port, () => console.log(`server running port: ${env.port}`))
  }).catch(console.error)