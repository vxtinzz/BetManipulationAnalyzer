import express from "express"
import userRoutes from "./routes/user.routes"
import authRoutes from "./routes/auth.routes"
import adminRoutes from "./routes/admin.routes"

const app = express()
const PORT = 3000;

app.use(express.json({limit : "10kb"}))
app.use("/user", userRoutes)
app.use("/", authRoutes)
app.use("/admin", adminRoutes)

app.use((req, res) => {
    res.status(404)
})

app.listen(PORT, () => {
  console.log(`Server on http://localhost:${PORT}`)
})
