/* ========================================= */
/* ALERT SYSTEM */
/* ========================================= */

function showAlert(message){

    const alertBox =
    document.createElement("div");

    alertBox.classList.add("alert-box");

    alertBox.innerHTML = `

        <h3>⚠ Alert</h3>
        <p>${message}</p>

    `;

    document.body.appendChild(alertBox);

    gsap.from(alertBox,{
        x:300,
        opacity:0,
        duration:0.7
    });

    setTimeout(()=>{

        alertBox.remove();

    },4000);

}

/* TEST */

setTimeout(()=>{

    showAlert(
        "Possible delay detected."
    );

},3000);