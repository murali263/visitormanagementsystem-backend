global.__basedir = __dirname;
const app =require('./app')
PORT=process.env.PORT
app.listen(PORT,()=>console.log(`sever is up on ${PORT}`))

