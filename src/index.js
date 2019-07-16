import { app } from './app'

app.listen(port, () => {
  console.log(`App running on port ${process.env.PORT}`)
})