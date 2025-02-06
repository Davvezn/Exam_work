import { Elysia } from "elysia";
import User from "./modules/User";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const Database = await mongoose.connect("mongodb+srv://davidliljequist:Dali0508@databas.rwvmadr.mongodb.net/?retryWrites=true&w=majority&appName=databas")
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
    
  })

  .listen(3000)
  console.log("server is running on http://localhost:3000");