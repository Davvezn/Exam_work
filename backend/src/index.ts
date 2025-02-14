import { Elysia } from "elysia";
import User from "./modules/User";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const Database = await mongoose.connect("<API_KEY>")
new Elysia()

  .post("/Register-user", async({body, set}) => {
    const {user_f_name, user_l_name, user_password, user_email} = body as {
      user_f_name: string;
      user_l_name: string;
      user_password: string;
      user_email: string;
    };

    const user = new User({user_f_name, user_l_name, user_password, user_email});
    
    if (!user_f_name || !user_l_name || !user_password || !user_email) {
      set.status = 400;
      return {message: "one must fill all files before granted entry upon our domain"};
    }


    try {
      const existing_user = await User.findOne({ user_email });
      if (existing_user) {
        set.status = 409;
        return { message: "user already exists, try another email"}
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user_password, salt);

      const new_user = new User({
        user_f_name,
        user_l_name,
        user_email,
        user_password: hashedPassword,
      });

      await new_user.save();
      return { message: "new user has been registered", data: new_user};
    } catch (error) {
      set.status = 422;
      return{message: "failed to create user.", error}
    }
  })
  .post("/log-in", async({ body, set }) => {
    const { user_email, user_password} = body as {user_email: string; user_password: string};

    const user = await User.findOne({ user_email });
    if (!user) {
      set.status = 404;
      return {message: "user not found"};
    }

    const isMatch = await bcrypt.compare(user_password, user.user_password);
    if (!isMatch) {
      set.status = 401; 
      return {message: "password incorrect, try again"};
    }

    const token = jwt.sign({ id: user._id}, "your_secret_key", {expiresIn : "1hr"});

    return {message: "log in succesful good job", token};
  })
  .get("/all_users", async() => {
    const all_users = await User.find()
    return(all_users)
  })
  .get("/:user/all-data", async() => { 
    try {
      // check for active tokens (dunno how I'll do that but manually for now.)
      const user_data = await User.findOne()
    } catch (error) {
      
    }
  })
  .post("/income-calc", async({ body, set }) => {
    const {user_income} = body as {user_income: number};
    if (!user_income || user_income <= 0) {
      set.status = 400;
      return {message: "Please provide proper income amount (not to be rude if economy is shite)."};
    }
    // future update (spring 4 MAYBE) might add added detail such as Limit for certain costs aka food
    // and then have a people calculator that adds maximum amount of money to be spent on ... and multiply with x amount of people
    const inc_tax = user_income * 0.33; // could make a value for money left AFTER tax. 
    const housing_costs = user_income * 0.25;
    const food_costs = user_income * 0.10;
    const fun_costs = user_income * 0.05;
    const other_expenses = user_income * 0.07;
    
    const total_costs = inc_tax + housing_costs + food_costs + fun_costs + other_expenses;
    const remaining_money = user_income - total_costs; 


    return {
      original_income: user_income,
      tax: inc_tax.toLocaleString("sv-SE"),
      housing: housing_costs.toLocaleString("sv-SE"),
      food: food_costs.toLocaleString("sv-SE"),
      fun: fun_costs.toLocaleString("sv-SE"),
      other: other_expenses.toLocaleString("sv-SE"),
      total_costs: total_costs.toLocaleString("sv-SE"),
      remaining_money: remaining_money.toLocaleString("sv-SE"),
    };
  })


  .listen(3000)
  console.log("server is running on http://localhost:3000");