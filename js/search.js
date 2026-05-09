/* ========================================= */
/* SEARCH MODULE */
/* ========================================= */

const baggageData = {

    BG1024:{
        flight:"AI-202",
        status:"In Transit",
        location:"Dubai Transfer Hub",
        arrival:"12:45 PM"
    },

    BG2048:{
        flight:"EK-404",
        status:"Loaded",
        location:"Hyderabad Airport",
        arrival:"03:10 PM"
    },

    BG4096:{
        flight:"QR-778",
        status:"Delayed",
        location:"Security Check",
        arrival:"05:20 PM"
    }

};

/* ========================================= */
/* SEARCH FUNCTION */
/* ========================================= */

trackBtn.addEventListener("click",()=>{

    const bagInput =
    document.getElementById("bagInput")
    .value
    .toUpperCase();

    const resultCard =
    document.getElementById("resultCard");

    if(bagInput===""){

        alert("Please Enter Baggage ID");
        return;
    }

    if(baggageData[bagInput]){

        const bag = baggageData[bagInput];

        resultCard.innerHTML = `

            <div class="status-header">

                <span class="status-dot"></span>

                <h3>${bag.status}</h3>

            </div>

            <div class="status-details">

                <p>
                    <span>Bag ID:</span>
                    ${bagInput}
                </p>

                <p>
                    <span>Flight:</span>
                    ${bag.flight}
                </p>

                <p>
                    <span>Location:</span>
                    ${bag.location}
                </p>

                <p>
                    <span>Estimated Arrival:</span>
                    ${bag.arrival}
                </p>

            </div>

        `;

        gsap.from(resultCard,{
            opacity:0,
            y:40,
            duration:1,
            ease:"power4.out"
        });

    }

    else{

        resultCard.innerHTML = `

            <div class="status-header">

                <span class="status-dot"></span>

                <h3>Baggage Not Found</h3>

            </div>

        `;

    }

});