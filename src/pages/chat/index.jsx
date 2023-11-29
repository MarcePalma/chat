import Image from "next/image";
import { useState, useEffect } from "react";
import io from "socket.io-client";

let socket;
const urlRegex =
    /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;

export default function ChatPage() {
    const [message, setMessage] = useState("");
    const [username, setUsername] = useState("");
    const [todosLosMensajes, setTodosLosMensajes] = useState([]);

    useEffect(() => {
        iniciarSockets();

        return () => {
            socket.disconnect();
        };
    }, []);

    async function iniciarSockets() {
        await fetch("/api/socket");

        socket = io();

        socket.on("chat:mensaje", (mensajeNuevo) => {
            setTodosLosMensajes((mensajesAnteriores) => [
                ...mensajesAnteriores,
                mensajeNuevo,
            ]);
        });
    }

    function manejarEnvioDeMensaje(evento) {
        evento.preventDefault();

        console.log("Mensaje enviado!");

        socket.emit("chat:mensaje", { username, contenido: message });

        setMessage("");
    }

    return (
        <section>
            <h1>Aplicacion de Chat</h1>

            <form onSubmit={manejarEnvioDeMensaje} action="" className="text-black">
                <input
                    onChange={(evento) => setUsername(evento.target.value)}
                    type="text"
                    name=""
                    id=""
                    placeholder="Username"
                />

                <ul className="text-white">
                    {todosLosMensajes.map((mensaje, index) => (
                        <li key={index}>
                            {mensaje.contenido.match(urlRegex) ? (
                                <>
                                    {mensaje.username}: <br />
                                    <Image
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