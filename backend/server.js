const server=require('./app');

server.listen(process.env.PORT,'0.0.0.0',()=>{
    console.log("server is listen");
})
