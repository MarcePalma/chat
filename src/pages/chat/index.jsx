import { useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import { UserContext } from "@/Context/userContex";

let socket;

const urlRegex =
    /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;

export default function ChatPage() {
    const { user } = useContext(UserContext);
    const [message, setMessage] = useState("");
    const [todosLosMensajes, setTodosLosMensajes] = useState([]);
    const [usuariosEnLinea, setUsuariosEnLinea] = useState([]);

    useEffect(() => {
        iniciarSockets();

        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, []);

    async function iniciarSockets() {
        try {
            await fetch("/api/socket");
            socket = io();

            // Emitir evento "user:connect" al conectar el usuario
            if (socket && user.name) {
                socket.emit("user:connect", user.name);
            }

            socket.on("users:update", (users) => {
                // Actualizar la lista de usuarios en línea
                setUsuariosEnLinea(users);
            });

            socket.on("chat:mensaje", (mensajeNuevo) => {
                setTodosLosMensajes((mensajesAnteriores) => [
                    ...mensajesAnteriores,
                    mensajeNuevo,
                ]);
            });
        } catch (error) {
            console.error("Error al iniciar sockets:", error);
        }
    }

    function manejarEnvioDeMensaje(evento) {
        evento.preventDefault();

        console.log("Mensaje enviado!");

        if (socket) {
            socket.emit("chat:mensaje", { username: user.name, contenido: message });
        }

        setMessage("");
    }

    return (
        <section>
            <h1>Aplicacion de Chat</h1>

            <div>
                <p>Usuarios en línea:</p>
                <ul>
                    {usuariosEnLinea.map((usuario) => (
                        <li key={usuario.id}>{usuario.username}</li>
                    ))}
                </ul>
            </div>

            <ul className="text-white">
                {todosLosMensajes.map((mensaje, index) => (
                    <li key={index}>
                        {mensaje.contenido.match(urlRegex) ? (
                            <>
                                {mensaje.username}: <br />
                                <img
                                    src={mensaje.contenido}
                                    alt=""
                                    width={700}
                                    height={700}
                                />
                            </>
                        ) : (
                            <span>
                                {mensaje.username}: {mensaje.contenido}
                            </span>
                        )}
                    </li>
                ))}
            </ul>

            <form onSubmit={manejarEnvioDeMensaje} action="" className="text-black">
                <input
                    onChange={(evento) => setMessage(evento.target.value)}
                    value={message}
                    type="text"
                    name=""
                    id=""
                    placeholder="Mensaje"
                />
                <input type="submit" className="text-white" value="Enviar mensaje" />
            </form>
        </section>
    );
}