const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const bcrypt=require("bcryptjs")
const {usermodel}=require("./models/Register")
const app=express()
app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://Chandanapk:vishnuchandu1357@cluster0.bemah3y.mongodb.net/busDB?retryWrites=true&w=majority&appName=Cluster0")

const generateHashedPassword=async(password)=>{
    const salt=await bcrypt.genSalt(10)
    return bcrypt.hash(password,salt)

}


app.post('/reg', async(req,res)=>{
    let input=req.body
    let hashedPassword=await generateHashedPassword(input.password)
    console.log(hashedPassword)
    input.password=hashedPassword 
    let user=new usermodel(input)
    user.save()
    res.json({"status":"success"})
})

app.listen(8061,()=>{
    console.log("server started")
})