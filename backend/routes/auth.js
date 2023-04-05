const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require("../middleware/fetchuser");


const JWT_SECRET="harryisagoodb$oy";
router.post(
  "/createuser",
  [
    body("name", "Enter the valid name").isLength({ min: 3 }),
    body("email", "Enter the valid email").isEmail(),
    body("password", "Password must be atleast 5 character ").isLength({
      min: 5
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try{
    let user = await User.findOne({ email: req.body.email });
    console.log(user);
    if (user) {
      return res
        .status(400)
        .json({ error: "Sorry a user with this email already exists" });
    }
    const salt =await  bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);
    user = await User.create({
      name: req.body.name,
      password: secPass,
      email: req.body.email,
    });
    const data={
      user:{
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    res.json(authtoken)
      
  }catch(err){
    console.log(err.message);
    res.status(500).send("Internal server error!!");
  }
});

router.post('/login',[
  body('email','Enter a valid email').isEmail(),
  body('password','Password cannpt br blank').exists(),
],async (req,res)=>{
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {email,password}= req.body;
    try{
      let user = await User.findOne({email});
      if(!user){
        return res.status(400).json({error : "please try to login with coorect credentials"});
      }
      const passwordCompare = await bcrypt.compare(password,user.password);
      if(!passwordCompare){
        return res.status(400).json({ errors: errors.array() });
      }

      const data={
        user:{
          id: user.id
        }
      }
      const authtoken = jwt.sign(data, JWT_SECRET);
      res.json(authtoken)

    }
    catch(err){
      console.log(err.message);
      res.status(500).send("Internal server error!!");
    }
})

// ROUTES 3: GET LOGGEDIN USER DETAILS USING: POST "/api/auth/gestuser". login required
router.post('/getuser',fetchuser,  async (req,res)=>{
try{ 
  userId = req.user.id;
  const user= await User.findById(userId).select("-password");
  res.send(user);
}catch(err){
  console.log(err.message);
  res.status(500).send("Internal server error!!");
}
})
module.exports = router;
