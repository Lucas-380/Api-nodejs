import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import { json } from "express";

dotenv.config();

export const usuarios = [{
    user: "aa",
    email: "aa@a.com",
    password: "$2a$05$NHoaB19UmzbY/dJ3voB1ue2dj6kEmX/kJ6t6wBbTnIHCh/RBUWnRW" //a
}]

async function login(req, res){
    console.log(req.body);
    const user = req.body.user;
    const password = req.body.password;
    if(!user || !password){
        return res.status(400).send({status:"Error", message:"Los campos están incompletos"});
    }
    const usuarioARevisar = usuarios.find(usuario => usuario.user === user);
    if(!usuarioARevisar){
        return res.status(400).send({status:"Error", message:"Error al iniciar sesión"});
    }
    const loginCorrecto = await bcryptjs.compare(password, usuarioARevisar.password);
    
    if(!loginCorrecto){
        return res.status(400).send({status:"Error", message:"Error al iniciar sesión"});
    }
    const token = jsonwebtoken.sign({user:usuarioARevisar.user}, process.env.JWT_SECRET, {expiresIn:process.env.JWT_EXPIRATION})

    const cookieOption = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000), //se multiplica para que la variable lo guarde en dias
        path: "/"
    }

    res.cookie("jwt", token, cookieOption);
    res.send({status:"ok", message:"usuario loggeado", redirect:"/admin"})
}

async function register(req, res){
    const user = req.body.user;
    const password = req.body.password;
    const email = req.body.email;
    if(!user || !email || !password){
        return res.status(400).send({status:"Error", message:"Los campos están incompletos"});
    }
    const usuarioARevisar = usuarios.find(usuario => usuario.user == user);
    if(usuarioARevisar){
        return res.status(400).send({status:"Error", message:"Este usuario ya existe"});
    }
    const salt = await bcryptjs.genSalt(5);
    const hashPassword = await bcryptjs.hash(password,salt);
    const nuevoUsuario = {
        user, email, password: hashPassword
    }
    console.log(nuevoUsuario);
    usuarios.push(nuevoUsuario);
    console.log(usuarios);
    return res.status(201).send({status:"ok", message: `Usuario ${nuevoUsuario.user} creado correctamente`, redirect:"/"});
}


export const methods = {
    login,
    register
}