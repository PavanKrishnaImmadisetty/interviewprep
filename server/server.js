import express from 'express'
import connectdb from './config/db.js'

import cors from 'cors'




import authRouter from './routes/user.routes.js'
import postRouter from './routes/post.routes.js'
import uploadRouter from './routes/uploads.router.js'
import commentRouter from './routes/comment.routes.js'
import feedbackRouter from './routes/feedback.routes.js' 
import adminRouter from './routes/admin.routes.js'


const app = express()


app.use(express.json())
app.use(cors())

connectdb()

app.use('/api/auth',authRouter)
app.use('/api/',postRouter)
app.use('/api/upload',uploadRouter)
app.use('/api/comments',commentRouter)
app.use('/api/feedback',feedbackRouter)
app.use('/api/admin',adminRouter)

const port = process.env.Port
app.listen(port,()=>console.log('server is running at 5000...'))

app.get('/',(req,res)=>{
    res.send('Hlo pavan')
})