import { emailRegex, passwordRegex } from "@/utils/regex";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
    const usuario = req.body;

    if (!usuario.email.match(emailRegex))
        return res.status(400).json({ error: "Email inválido" });

    if (!usuario.password.match(passwordRegex))
        return res.status(400).json({ error: "Contraseña inválida" });

    const usuarioEnDB = await prisma.usuario.findUnique({
        where: {
            email: usuario.email,
        },
    });

    if (!usuarioEnDB)
        return res.status(403).json({ error: "Cuenta no existe" });

    const contrasenaValida = await compare(
        usuario.password,
        usuarioEnDB.password
    );

    if (!contrasenaValida)
        return res.status(401).json({ error: "Contraseña inválida" });

    try {
        const { id, name, email, edad } = usuarioEnDB;
        const token = sign(usuarioEnDB, process.env.TOKEN_SECRET as string, {
            expiresIn: "7d",
        });

        await prisma.usuario.update({
            where: { id: usuarioEnDB.id },
            data: { connected: true },
        });

        const mensajesDelChat = await prisma.mensaje.findMany({
            where: {
                OR: [
                    { enviadoPorId: usuarioEnDB.id },
                    { enviadoAId: usuarioEnDB.id },
                ],
            },
            orderBy: {
                creadoEn: 'asc',
            },
        });

        return res.status(200).json({ token, user: { id, name, email, edad }, mensajesDelChat });

    } catch (error) {
        console.error("Error al firmar el token:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}
