import { emailRegex, passwordRegex } from "@/utils/regex";
import { encriptarPassword } from "@/utils/crypto";
import { PrismaClient } from "@prisma/client";
import { sign } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
    try {
        const usuario = req.body;

        if (Object.values(usuario).includes(undefined)) {
            return res.status(400).json({ msg: "Error! Faltan datos" });
        }

        if (!usuario.email.match(emailRegex)) {
            return res.status(400).json({ msg: "Email invalido!" });
        }

        if (!usuario.password.match(passwordRegex)) {
            return res.status(400).json({ msg: "Contraseña invalida!" });
        }

        const hash = await encriptarPassword(usuario.password);

        const usuarioAGuardar = { ...usuario, password: hash };

        const usuarioSubido = await prisma.usuario.create({ data: usuarioAGuardar });

        if (!usuarioSubido) {
            return res.status(500).json({ msg: "No se pudo subir el usuario!" });
        }

        console.log("Usuario registrado con éxito:", usuarioSubido);

        const token = sign(usuarioAGuardar, process.env.TOKEN_SECRET as string);

        console.log("Token generado:", token);

        return res.status(201).json({ token });
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        return res.status(500).json({ msg: "Error interno del servidor" });
    }
}