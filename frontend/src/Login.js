function Login(props){
    return (
        <div className="bg-dark min-vh-100 min-vw-100">
            <div className="container min-vh-100 d-flex justify-content-center align-items-center">
                <form>
                    <div className="form-group">
                        <input type="text" className="form-control border border-primary" placeholder="Nome utente" onChange={(event) => props.setName(event.target.value)}/>
                    </div>
                    <button type="button" className="btn btn-success w-100 mt-3 border border-primary" onClick={() => props.checkName(props.name)}><strong>Connettiti alla partita</strong></button>
                </form>
            </div>
        </div>
    )
}

export default Login;