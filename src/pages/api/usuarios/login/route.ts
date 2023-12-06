import { emailRegex, passwordRegex } from "@/utils/regex";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    const usuario = await req.json();

    if (!usuario.email.match(emailRegex))
        return new Response(JSON.stringify({ error: "Email inválido" }), { status: 400 });

    if (!usuario.password.match(passwordRegex))
        return new Response(JSON.stringify({ error: "Contraseña inválida" }), { status: 400 });

    const usuarioEnDB = await prisma.usuario.findUnique({
        where: {
            email: usuario.email,
        },
    });

    if (!usuarioEnDB)
        return new Response(JSON.stringify({ error: "Cuenta no existe" }), { status: 403 });

    const contrasenaValida = await compare(
        usuario.password,
        usuarioEnDB.password
    );

    if (!contrasenaValida)
        return new Response(JSON.stringify({ error: "Contraseña inválida" }), { status: 401 });

    try {
        const token = sign(usuarioEnDB, process.env.TOKEN_SECRET as string, {
            expiresIn: "7d",
        });

        return new Response(JSON.stringify({ token, nombre: usuarioEnDB.name }), { status: 200 });
    } catch (error) {
        console.error("Error al firmar el token:", error);
        return new Response(JSON.stringify({ error: "Error interno del servidor" }), { status: 500 });
    }
}
