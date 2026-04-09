import express from "express"
import { PrismaClient } from "./generated/prisma/client"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcrypt"
import "dotenv/config"
import jwt from "jsonwebtoken"

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({adapter})
const app = express()
const PORT = 3000;

app.use(express.json())

app.get("/", (req, res) => {
  res.send("Server Running")
})

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany()
  res.json(users)
})

app.post("/users", async (req, res) => {
  try{
  const { username, password, cpf } = req.body
  const userNameRegex = /^[a-zA-Z0-9]{3,30}$/
  const usernameFormat = username.trim();

  if(typeof username !=="string" || username.trim().length === 0 || !userNameRegex.test(username)){
    return res.status(400).json({error: "Invalid username"})
  }

  if(!username||!password||!cpf){
    return res.status(400).json({error: "Required data missing"})
  }

  if(username)
  if(password.length<6){
    return res.status(400).json({error: "Password too short"})
  }

  if(cpf.length>14){
    return res.status(400).json({error: "Cpf too large"})
  }

  const userExists = await prisma.user.findUnique({
    where: {username},
  })

  if(userExists){
    return res.status(400).json({error: "Username already exists"})
  }
  
  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
  data: {
    usernameFormat,
    password: hashedPassword,
    cpf,
  },
})
  res.status(201).json({message: "User created sucessfully"})

  res.json(user)
}catch(err){
  res.status(500).json({error:"Internal error"})
}
})

app.listen(PORT, () => {
  console.log(`Server on http://localhost:${PORT}`)
})