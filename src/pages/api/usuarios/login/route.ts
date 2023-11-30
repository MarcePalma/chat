import { emailRegex, passwordRegex } from "@/utils/regex";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from 'next';


const prisma = new PrismaClient()

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
    try {
        const usuario = req.body;

        if (!usuario.email.match(emailRegex))
            return new Response("Email Invalido!", { status: 400 });

        if (!usuario.password.match(passwordRegex))
            return new Response("Contrasena invalida!", { status: 400 });

        const usuarioenDB = await prisma.usuario.findUnique({
            where: {
                email: usuario.email,
            }
        });

        if (!usuarioenDB) return res.status(404).json({ msg: "Cuenta no existe!" });


        const contrasenaValida = await compare(
            usuario.password,
            usuarioenDB.password
        )

        if (!contrasenaValida) return res.status(401).json({ msg: "Contrasena no valida!" });

        const token = sign(usuarioenDB, process.env.TOKEN_SECRET as string, {
            expiresIn: "30d"
        })

        return res.status(201).json({ token });

    } catch (error) {
        console.error("Error al Logear usuario:", error);
        return res.status(500).json({ msg: "Error interno del servidor" });
    }
}