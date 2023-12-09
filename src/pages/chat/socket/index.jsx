import { Server } from "socket.io";

export default function ManejadorDeSockets(req, res) {
    const io = new Server(res.socket.server);

    const usuariosConectados = new Map();

    io.on("connection", (socket) => {
        console.log(`Usuario conectado en el socket: ${socket.id}`);
    
        socket.on("user:connect", async (username) => {
            if (usuariosConectados.has(username)) {
                socket.emit("user:error", "El nombre de usuario ya está en uso");
                socket.disconnect(true);
            } else {
                socket.username = username;
                usuariosConectados.set(username, socket.id);
    
                // Marcar al usuario como conectado
                await prisma.usuario.update({
                    where: { name: username },
                    data: { connected: true },
                });
    
                io.emit("users:update", obtenerUsuariosConectados());
            }
        });
    
        socket.on("disconnect", async () => {
            const username = socket.username;
            usuariosConectados.delete(username);
    
            // Marcar al usuario como desconectado
            await prisma.usuario.update({
                where: { name: username },
                data: { connected: false },
            });
    
            io.emit("users:update", obtenerUsuariosConectados());
        });
    
        socket.on("chat:mensaje", (mensaje) => {
            io.emit("chat:mensaje", mensaje);
        });
    });

    const obtenerUsuariosConectados = () => {
        const usuarios = Array.from(usuariosConectados.keys()).map((username) => ({
            id: usuariosConectados.get(username),
            username: username,
        }));
        return usuarios;
    };

    res.end();
}