import { Server } from "socket.io"

export default function ManejadorDeSockets(req, res) {
    if (res.socket.server.io) {
        console.log("Conexion ya configurada!")
        res.end()
        return
    }

    const io = new Server(res.socket.server)
    res.socket.server.io = io

    io.on("connection", (socket) => {
        console.log(`Usuario conectado en el socket: ${socket.id}`)

        socket.on("chat:mensaje", (mensaje) => {
            io.emit("chat:mensaje", mensaje)
        })
    })

    console.log("Configurando socket!")
    res.end()
}