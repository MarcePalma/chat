"use client"

import { useContext, useRef, FormEvent } from "react";
import { UserContext } from "@/Context/userContex";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function FormularioDeLogin() {
    const router = useRouter();
    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const { setUser } = useContext(UserContext);

    async function mandarDatosDeLogin(evento: FormEvent) {
        evento.preventDefault();

        const datosAEnviar = {
            //@ts-ignore
            email: emailRef.current?.value,
            //@ts-ignore
            password: passwordRef.current?.value,
        };

        console.log(datosAEnviar);

        const respuesta = await fetch("http://localhost:3000/api/usuarios/login/route", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(datosAEnviar),
        });

        if (respuesta.status !== 200) {
            const error = await respuesta.text();
            alert(error);
            return;
        }

        const { token, nombre, mensajesDelChat } = await respuesta.json();

        // Guardar el token y otros datos en el contexto del usuario
        setUser({ token, nombre, mensajesDelChat });

        // Redirigir a la página principal
        router.push("/");
    }

    return (

        <section className="bg-gray-50 dark:bg-gray-900">
            <article className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <Link href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                    <Image width={700} height={700} className="w-8 h-8 mr-2" src="/images/Logo.webp" alt="logo" />
                    Seeyy Chat
                </Link>
                <section className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-900 dark:border-gray-700">
                    <section className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Inicia sesión!
                        </h1>
                        <form onSubmit={mandarDatosDeLogin} className="space-y-4 md:space-y-6" action="#">
                            <section>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Email
                                </label>
                                <input
                                    ref={emailRef}
                                    type="email"
                                    name="email"
                                    id="email"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="ejemplo@hotmail.com"
                                />
                            </section>
                            <section>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Contraseña
                                </label>
                                <input
                                    ref={passwordRef}
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="••••••••"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                />
                            </section>
                            <button
                                type="submit"
                                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                            >
                                Iniciar Sesión
                            </button>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                ¿No tienes una cuenta?{" "}
                                <Link href="/auth/registrarse" className="font-medium text-primary-600 hover:underline dark:text-primary-500">
                                    Regístrate!
                                </Link>
                            </p>
                        </form>
                    </section>
                </section>
            </article>
        </section>
    );
}
