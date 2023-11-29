import { emailRegex, passwordRegex } from "@/utils/regex";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";

const prisma = new PrismaClient()

export async function POST(req: Request) {
    const usuario = await req.json()

    if (!usuario.email.match(emailRegex))
        return new Response("Email Invalido!", { status: 400 });

    if (!usuario.password.match(passwordRegex))
        return new Response("Contrasena invalida!", { status: 400 });

    const usuarioenDB = await prisma.usuario.findUnique({
        where: {
            email: usuario.email,
        }
    });

    if (!usuarioenDB) return new Response("Cuenta no existe!", { status: 403 });

    const contrasenaValida = await compare(
        usuario.password,
        usuarioenDB.password
    )

    if (!contrasenaValida) return new Response("Contrasena no valida!", { status: 401 });

    const token = sign(usuarioenDB, process.env.TOKEN_SECRET as string, {
        expiresIn: "30d"
    })

    return new Response(token, { status: 200 })
}