import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import { methods as auth } from './controllers/auth.controller.js';
import {methods as authorization } from './middlewares/authorization.js'

const app = express();

//servidor
app.listen(3000, ()=> {
    console.log('server listening');
});

//configuracion
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(cookieParser())

//rutas
app.get("/",authorization.soloPublico, (req,res) => res.sendFile(__dirname + "/pages/login.html"))
app.get("/register",authorization.soloPublico, (req,res) => res.sendFile(__dirname + "/pages/register.html"))
app.get("/admin",authorization.soloAdmin, (req,res) => res.sendFile(__dirname + "/pages/admin/admin.html"))
app.post("/api/register", auth.register);
app.post("/api/login", auth.login);