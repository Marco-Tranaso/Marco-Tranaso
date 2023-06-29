import { useState } from "react";
import "./Card.css";

function Card(props){

    const [ hover, setHover ] = useState(false);

    return (
        <div className="col-sm-4">
            <div className={hover ? "card card-custom mx-2 mb-3 slide-top" : "card card-custom mx-2 mb-3 slide-down"} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onClick={(event) => props.select(event.target)}>
                <div id={props.id} className="card-body">
                    <img id={props.id} className="card-img" src={props.img}></img>
                </div>
            </div>
        </div>
    );
}

export default Card;