import('./db/mongoose')
import express from 'express'

import userRouter from './routers/user'
import taskRouter from './routers/task'

const app = express()
const port = process.env.PORT || 3000

// Auto parse incoming JSON
app.use(express.json())

app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
  console.log(`App running on port ${port}`)
})