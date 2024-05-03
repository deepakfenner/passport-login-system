require('dotenv').config()
const express=require('express')
const jwt=require('jsonwebtoken')
const app=express()
app.use(express.json())
const posts=[{
    username:'deepak',
    title:'post 1'
},{
    username:'dev',
    title:'post 2'
}]
let refreshTokens=[]
app.delete('/logout',(req,res)=>{
    refreshTokens=refreshTokens.filter(token=>token!==req.body.token)
    res.sendStatus(204)
})
app.post('/login',(req,res)=>{
    const username=req.body.username
    const user={name:username}
    const accessToken=getAccessToken(user)
    const refreshToken=jwt.sign(user,process.env.REFRESH_TOKEN_SECRET)
    refreshTokens.push(refreshToken)
    res.json({accessToken:accessToken,refreshToken:refreshToken})
})
app.post('/token',(req,res)=>{
    const token=req.body.token
    if(token==null)
    {
        return res.sendStatus(401)
    }
    if(!(refreshTokens.includes(token)))
    {
        return res.sendStatus(403)
    }
    jwt.verify(token,process.env.REFRESH_TOKEN_SECRET,(err,user)=>{
        if(err)
        {
            return res.sendStatus(403)
        }
        const accessToken=getAccessToken({name:user.name})
        res.json({accessToken:accessToken})
    })
})

function getAccessToken(user)
{
    return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'15s'})
}
app.listen(4000)
