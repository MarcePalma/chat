"use client";
import { FormEvent, useRef } from "react";
import { useContext } from "react";
import { UserContext } from "@/Context/userContex";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

export default function FormularioDeRegistro() {
    const nombreRef = useRef(null);
    const edadRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const recordarmeRef = useRef(null);

    const { user, setUser } = useContext(UserContext);

    async function mandarDatosDeRegistro(evento: FormEvent) {
        evento.preventDefault();

        const datosAEnviar = {
            //@ts-ignore
            nombre: nombreRef.current?.value,
            //@ts-ignore
            edad: Number(edadRef.current?.value),
            //@ts-ignore
            email: emailRef.current?.value,
            //@ts-ignore
            password: passwordRef.current?.value,
        };

        console.log(datosAEnviar);

        const respuesta = await fetch(
            "http://localhost:3000/api/usuarios/register/route",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(datosAEnviar),
            }
        );

        if (respuesta.status !== 201) {
            const error = await respuesta.json();
            alert(error.msg);
        }

        const { token } = await respuesta.json();

        setUser({ ...datosAEnviar, token });
        const router = useRouter();
        router.push('/chat');

        //@ts-ignore
        if (recordarmeRef.current?.value) {
            localStorage.setItem("usuario", JSON.stringify(datosAEnviar));
        }

        console.log(user);
    }

    return (
        <>
            <form onSubmit={mandarDatosDeRegistro} className="text-black">
                <input ref={nombreRef} type="text" placeholder="Nombre completo" />
                <input
                    ref={edadRef}
                    type="number"
                    inputMode="numeric"
                    placeholder="Edad"
                />
                <input ref={emailRef} type="email" placeholder="Email" />
                <input ref={passwordRef} type="password" placeholder="Contraseña" />
                <input type="checkbox" ref={recordarmeRef} /> Recordarme
                <input type="submit" className="text-white" value="Registrarse" />
            </form>

            <button onClick={() => console.log(user)}>Click</button>

            <Link href="/perfil">Ir al perfil</Link>
        </>
    );
}



//<section className="bg-gray-50 dark:bg-gray-900">
//<article className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
//    <Link href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
//        <Image width={700} height={700} className="w-8 h-8 mr-2" src="/images/LOGO.webp" alt="logo" />
//        Seeyy Chat
//    </Link>
//    <section className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
//        <section className="p-6 space-y-4 md:space-y-6 sm:p-8">
//            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
//                Crea tu cuenta!
//            </h1>
//            <form onSubmit={mandarDatosDeRegistro} className="space-y-4 md:space-y-6" action="#">
//                <section>
//                    <label htmlFor="nombre" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre</label>
//                    <input ref={nombreRef} type="nombre" name="nombre" id="nombre" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Nombre" />
//                </section>
//                <section>
//                    <label htmlFor="edad" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Edad</label>
//                    <input ref={edadRef} type="numeric" name="edad" id="edad" placeholder="18" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
//                </section>
//                <section>
//                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
//                    <input ref={emailRef} type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="ejemplo@hotmail.com" />
//                </section>
//                <section>
//                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contraseña</label>
//                    <input ref={passwordRef} type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
//                </section>
//
//                <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Crear Cuenta</button>
//                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
//                    Ya tienes una cuenta? <Link href="#" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Inicia Sesion!</Link>
//                </p>
//            </form>
//        </section>
//    </section>
//</article>
//</section>