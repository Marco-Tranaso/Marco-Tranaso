import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function Mainpage(){

    const { register, getValues } = useForm();
    const navigate = useNavigate();


   

    return (

        <p>ciao</p>
    );
}

export default Mainpage;