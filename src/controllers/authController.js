const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userDb = require('../config/database').userDb;

const signup = async(req,res)=>{
    const {username,password} = req.body;
    const hashedPassword = await bcrypt.hash(password,10);
    const user = {
        username,
        password:hashedPassword
    }
    const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1h'}); // accessToken expires for every 1 hour
    userDb.run('INSERT INTO users (username,password) VALUES (?,?)',[user.username,user.password],function(err){
        if(err){
            console.error('Database error:',err);
            return res.status(500).send('Error saving to database');
        }
        res.status(200).json({
            message:'User created successfully',
            userId:this.lastID,
            accessToken : accessToken
        });
    });
    res.json({accessToken});
}

const login = async(req,res)=>{
    const {username,password} = req.body;
    userDb.get('SELECT * FROM users WHERE username = ?',[username],async(err,row)=>{
        if(err){
            console.error('Database error:',err);
            return res.status(500).send('Error querying database');
        }
        if(!row){
            return res.status(400).send('Cannot find user');
        }
        if(await bcrypt.compare(password,row.password)){
            const accessToken = jwt.sign(row,process.env.ACCESS_TOKEN_SECRET);
            return res.status(200).json({accessToken});
        }
        res.status(400).send('Invalid password');
    });
}