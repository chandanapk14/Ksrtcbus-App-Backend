const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
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

app.post('/login',(req,res)=>{
    let input=req.body
    //we passed emailid to find
    usermodel.find({"email":req.body.email}).then(
        (response)=>{
            if(response.length>0){
                let dbPassword=response[0].password
                console.log(dbPassword)
                bcrypt.compare(input.password,dbPassword,(error,isMatch)=>{
                    if (isMatch) {
                        jwt.sign({email:input.email},"userapp",{expiresIn:"1d"},(error,token)=>
                        {
                            if(error){
                                res.json({"status":"Unable to create Token"})
                            }else{
                                res.json({"status":"success",userId:response[0]._id,"token":token})
                            }
                        }
                    )
                    } else {
                        res.json({"status":"Incorrect Password"})
                    }
                })
            }
           else{
            res.json({"status":"User Not Found"})
           } 
        }
    ).catch()
 })     

app.listen(8061,()=>{
    console.log("server started")
})

