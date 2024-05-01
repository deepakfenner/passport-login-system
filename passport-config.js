const localStrategy=require('passport-local').Strategy
const bcrypt=require('bcrypt')
function initialize(passport,getEmailById,getUserById)
{
        const authenticateUser=async(email,password,done) =>{
        const user=getEmailById(email)
        if(user==null)
        {
            return done(null,false,{message:"the email doesnot exist"})
        }
        try{
            if(await bcrypt.compare(password,user.password))
            {
                return done(null,user)
            }
            else
            {
                return done(null,false,{message:"incorrect password"})
            }

        }
        catch(e){
            return done(e)
        }
    }
    passport.use(new localStrategy({usernameField:'email'},authenticateUser))
    passport.serializeUser((user,done)=>done(null,user.id))
    passport.deserializeUser((id,done)=>{ return done(null,getUserById(id))})
}
module.exports=initialize