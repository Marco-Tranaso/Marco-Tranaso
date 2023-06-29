//import Mainpage from "./Mainpage";
import Partita from "./Partita";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import 'react-toastify/dist/ReactToastify.css';
import Login from "./Login";

function App() {

    const [ name, setName ] = useState("");
    const [ socket, setSocket ] = useState(null);
    const [ error, setError ] = useState(false);

    let translations = {"stone" : "sasso", "paper" : "carta", "scissors" : "forbice"};

    useEffect(() => {
        if (!socket) return;
        socket.emit("Data", name);
        listenForEvents();
    }, [socket]);


    function notify(valid){
        if (!valid){
            toast.error('Inserisci un nome valido', {
                position: "bottom-right",
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
                theme: "colored",
            });
        }
    }

    function listenForEvents(){
        socket.on("Error", (args) => {
            toast.error(args.message, {
                position: "bottom-right",
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
                theme: "colored",
            });
            setError(true);
        });

        socket.on("data", (args) => {
            toast.success(args + " è entrato in partita", {
                position: "bottom-right",
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        });

        socket.on("VerSelected", (args) => {
            toast.info(args, {
                position: "bottom-right",
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        });

        socket.on("ClientDisconnected", (args) => {
            toast.error(args, {
                position: "bottom-right",
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
                theme: "colored",
            });
        });

        socket.on("Result", (args) => {
            if (args.result){
                toast.success(args.message + "\n" + "L'avversario ha scelto " + translations[args.adChoice], {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
            } else {
                toast.error(args.message + "\n" + "L'avversario ha scelto " + translations[args.adChoice], {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
            }
        });

        socket.on("Tie", (args) => {
            toast.warn(args.message, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            })
        });
    }

    function checkName(name) {
        if (name === "" || name.length < 5){
            notify(false);
        } else {
            notify(true);
            setSocket(io.connect("192.168.178.77:8080", {cors: {origin: "*"}}));
        }
    }

    return (socket === null) ? (
        <Login checkName={checkName} setName={setName} name={name}/>
    ) : (
        <Partita socket={socket}/>
    );
}

export default App;
