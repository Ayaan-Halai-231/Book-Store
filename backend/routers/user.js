const router = require('express').Router();
const User = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('./userAuth');
// const { response } = require('express');


app.get('/', (req, res) => {
    res.send('Hello World!')
})
//sign up
router.post('/sign-up', async (req, res) => {
    try {
        const { username, email, password, address } = req.body;

        //check the username more than 3
        if (username.length < 4) {
            return res
                .status(400)
                .json({ message: 'username shoud be greater than 3' });
        }

        //check username already exits?
        const existingUsername = await User.findOne({ username: username })
        if (existingUsername) {
            return res.status(400).json({ massage: 'username already exits' })
        }

        //check email address already exits
        const emailAddress = await User.findOne({ email: email })
        if (emailAddress) {
            return res.status(400).json({ massage: 'email address already exits' })
        }

        //check password length
        if (password.length <= 5) {
            return res.status(400).json({ message: 'password length shoud be greather than 5' })
        }

        const hashPass = await bcrypt.hash(password, 10);

        const newUser = new User({
            username: username,
            email: email,
            password: hashPass,
            address: address
        })
        await newUser.save();
        return res.status(200).json({ message: 'sign-up successfully' })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "internal error" })
    }
})

//sign in
router.post('/sign-in', async (req, res) => {
    try {
        const { username, password } = req.body;

        const exitsUser = await User.findOne({ username });
        if (!exitsUser) {
            return res.status(400).json({ message: "invaild credentials" })
        }
        await bcrypt.compare(password, exitsUser.password, (err, data) => {
            if (data) {
                const authclaims = [
                    {name:exitsUser.username},
                    {role:exitsUser.role}, 
                ]
                const token = jwt.sign({authclaims},"bookStore123",{
                    expiresIn:"30d",
                });
                return res.status(200).json({
                    id:exitsUser._id,
                    role:exitsUser.role,
                    token:token,
                })
            }else{
                return res.status(400).json({message:"invaild credentials"})
            }
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "internal error" })
    }
})

//get-userinformation
router.get('/get-user-information',authenticateToken,async(req,res)=>{
    try {
        const {id} = req.headers;
        const data = await User.findById(id).select('-password');
        return res.status(200).json(data)
    } catch (error) {
        res.status(500).json({message:"internal server error"})
    }
})

//update address
router.put('/update-address',authenticateToken, async(req,res)=>{
    try {
        const {id} = req.headers;
        const {address} = req.body;
        await User.findByIdAndUpdate(id,{address:address});
        return res.status(200).json({message:"Address updated successfully"})  

    } catch (error) {
        res.status(500).json({message:"internal server error"})
    }
})


module.exports = router;