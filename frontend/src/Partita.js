import "./Partita.css";
import stone from "./img/stone.png";
import paper from "./img/paper.png";
import scissors from "./img/scissors.png";
import { useState } from "react";
import Card from "./Card";
import { toast } from "react-toastify";

function Partita(props){

    let translations = {"stone" : "sasso", "paper" : "carta", "scissors" : "forbice"};
    let socket = props.socket;
    
    function changeSelected(target){
        toast.success('Hai selezionato ' + translations[target.id], {
            position: "bottom-right",
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
        
        socket.emit("Selected", { id: socket.id, message: target.id });
    }


    return (
        <div className="bg-dark min-vh-100 d-flex justify-content-center align-items-center">
            <div className="container d-flex gx-5 fit-content">
                <div className="row justify-content-center align-items-center mt-5 pt-500">
                    <Card id="stone" img={stone} select={changeSelected}/>
                    <Card id="paper" img={paper} select={changeSelected}/>
                    <Card id="scissors" img={scissors} select={changeSelected}/>
                </div>
            </div>
        </div>
    )
}

export default Partita;