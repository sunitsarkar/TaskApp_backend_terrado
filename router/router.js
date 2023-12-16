const express = require('express');
const router = express.Router();
const UserModel = require('../model/user')
const TaskModel = require('../model/task')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
require('dotenv').config();
const privateKey = process.env.JWT_SECRET;
const auth=require('./../middleware/authentication')

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ status: true, message: 'Please fill in all the input fields' });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ status: true, message: 'Please enter a valid email' });
    }

    if (password.length < 8 || password.length > 15) {
      return res.status(400).json({ status: true, message: 'Password should contain 8-15 characters' });
    }

    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({ status: true, message: 'Password should contain at least one uppercase letter' });
    }

    if (!/[^a-zA-Z0-9]/.test(password)) {
      return res.status(400).json({ status: true, message: 'Password should contain at least one special character' });
    }

    const user = await UserModel.findOne({ email: email });
    if (user) {
      return res.status(400).json({ status: true, message: 'Email ID already registered' });
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10);
    const userData = {
      name: name ? name.trim() : '',
      email: email ? email.trim() : '',
      password: hashedPassword,
    };
    const newUser = await UserModel.create(userData);
    return res.status(201).send({ status: true, message: "Registered successfully", data: newUser });
  } catch (error) {
    return res.status(500).send({ status: false, message: 'Server error' });
  }
});



router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).send({ message: 'Please fill all the input' })
    }

    let userExist = await UserModel.findOne({ email: email })
    if (!userExist) {
      return res.status(400).send({ message: 'user does not exist' })
    }

    let comparePassword = await bcrypt.compare(password, userExist.password);
    if (!comparePassword) {
      return res.status(400).send({ message: 'Wrong Password' })
    }

    let token = jwt.sign({user_id:userExist._id},privateKey,{expiresIn:"8h"});

    return res.status(200).send({ message: 'login successfully', data: token, email: userExist.email })
  } catch (error) {
    return res.status(500).send({ message: 'server error' })
  }
})


router.post('/addtask', async (req, res) => {
  const { task, user } = req.body;
  try {
    let taskData = await TaskModel.create({ task: task, user: user })
    if (taskData) {
      return res.status(200).send({ message: 'New Task Added' })
    }
  } catch (error) {
    return res.status(500).send({ message: 'server error' })
  }
})

router.get('/gettask',auth, async (req, res) => {
   const user=req.query.user;

  try {
    let allTask = await TaskModel.find({user:user});
    return res.status(200).send({ data: allTask })
  } catch (error) {
    return res.status(500).send({ error: error })
  }
})

router.delete('/deletetask', async (req, res) => {
  const id = req.query.id;
  try {
    let taskData = await TaskModel.deleteOne({ _id: id })
    if (taskData) {
      return res.status(200).send({ message: `task at ${id} deleted` })
    }
  } catch (error) {
    return res.status(500).send({ message: 'server error' })
  }
})

router.put('/updatetask', async (req, res) => {
  const { task, user,id } = req.body;

  try {
    let taskData = await TaskModel.findByIdAndUpdate(id, { task, user }, { new: true })
    if (taskData) {
      return res.status(200).send({ message: `task at ${id} updated` })
    }
  } catch (error) {
    return res.status(500).send({ message: 'server error' })
  }
})



module.exports = router;