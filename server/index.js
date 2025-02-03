import express from 'express'
const app = express();
const PORT  = process.evv.PORT || 8000;

app.listen(PORT, ()=>{
    console.log(`server is Listening at PORT ${PORT}`);
})

