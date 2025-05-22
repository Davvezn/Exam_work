import { Elysia } from "elysia";
import { cors } from '@elysiajs/cors';

import User from "./modules/User";
import Pokemon from "./modules/Pokemon";

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AdmZip from 'adm-zip';
import fs from 'fs';
import path from 'path';


const Database = await mongoose.connect("mongodb+srv://davidliljequist:Dali0508@databas.rwvmadr.mongodb.net/?retryWrites=true&w=majority&appName=databas")
new Elysia()
  .use(cors({ origin: "http://localhost:5173" }))

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

    user.lastLogin = new Date();
    await user.save();

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
  .get("/download-zip", ({ set }) => { //idk what any of this is
    const zip = new AdmZip();

    const addFolderToZip = (zip: AdmZip, folderPath: string, zipPath: string = '') => {
      const items = fs.readdirSync(folderPath);
  
      for (const item of items) {
        const fullPath = path.join(folderPath, item);
        const relPath = path.join(zipPath, item);
        const stats = fs.statSync(fullPath);
  
        if (stats.isDirectory()) {
          addFolderToZip(zip, fullPath, relPath);
        } else {
          const content = fs.readFileSync(fullPath);
          zip.addFile(relPath, content);
        }
      }
    };
  
  
    if (!fs.existsSync('../backend') || !fs.existsSync('../frontend')) {
      set.status = 500;
      return { message: "One or both project folders do not exist" };
    }

    addFolderToZip(zip, '../backend', 'backend');
    addFolderToZip(zip, '../frontend', 'frontend');
    
  
    const buffer = zip.toBuffer();
  
    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename=project_bundle.zip',
      },
    });
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
  .get("/analytics", async ({ query, set}) => {
    const type = query.type;

    if (!type || type === 'users') {
      const users = await User.find({}, "created lastLogin");
      const totalUsers = users.length;

      const loginCounts: Record<string, number> = {};
      users.forEach(user => {
        if(user.lastLogin) {
          const date = new Date(user.lastLogin).toISOString().split("T")[0];
          loginCounts[date] = (loginCounts[date] || 0) + 1;
        }
      });

      const sortedLogins = Object.entries(loginCounts)
        .sort((a,b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
        .map(([date, count]) => ({date,count}));

      return {
        totalUsers,
        loginActivity: sortedLogins,
      };
    }

    if (type === "pokemon") {
      const totalPokemon = await Pokemon.countDocuments();

      const pokemonByType = await Pokemon.aggregate([
        {$unwind: "$type"},
        {$group: {_id: "$type", count: { $sum: 1} } },
        {$sort: {count: -1} }
      ]);

      return {
        totalPokemon,
        byType: pokemonByType,
      };
    }

    // fallback for unkown entry.
    set.status = 400;
    return { error: "invalid analytics type"};
  })


  .listen(3000) 
  console.log("server is running on http://localhost:3000");