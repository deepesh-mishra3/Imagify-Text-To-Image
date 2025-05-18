// controller functions for user login, user log-out.. etc 
import userModel from "../models/userModel.js";

import bcrypt from 'bcrypt'; // for encrypting the passwords 

import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
    try {
        // 1> take the input from the user 
        const { name, email, password } = req.body;
        // 2> not getting the result according to our needs 
        if (!name && !email && !password) {
            return res.json({ succsess: false, message: 'Missing Details' });
        }
        // 3> hashing the password before saving it to the database 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4> creating the object 
        const userData = {
            name,
            email,
            password: hashedPassword
        }
        // 5> saving it to the database 
        const newUser = new userModel(userData);
        const user = await newUser.save();

        // 6> generating the token => storing the information about the user._id 
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        res.json({ success: true, token, user: { name: user.name } });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const loginUser = async (req, res) => {
    try {
        // login through email and password 
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'User does not exists' })
        }

        const isMatch = await bcrypt.compare(password, user.password); // user.password => ek hashed password tha that`s why 

        if (isMatch) {
            // match kar gaya toh token generate karke bhej do 
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

            res.json({ success: true, token, user: { name: user.name } })
        } else {
            return res.json({ success: false, message: 'Invalid Credentials' });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

export const userCredits = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await userModel.findById(userId);
        res.json({ success: true, credits: user.creditBalance, user: { name: user.name } });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}