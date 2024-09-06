const mensajeError = document.getElementsByClassName("error")[0];

document.getElementById("login-form").addEventListener("submit", async (e)=>{
    e.preventDefault();
    const user = e.target.children.user.value;
    const password = e.target.children.password.value;
    const respuesta = await fetch("http://localhost:3000/api/login",{
        method:"POST",
        headers:{
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            user, password
        })
    });

    if(!respuesta.ok) return mensajeError.classList.toggle("escondido", false);
    const resJson = await respuesta.json();
    if(resJson.redirect){
        window.location.href = resJson.redirect;
    }
})