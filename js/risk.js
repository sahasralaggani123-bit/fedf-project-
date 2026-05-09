/* ========================================= */
/* RISK ANALYSIS MODULE */
/* ========================================= */

function calculateRisk(delay, transfers){

    let risk = delay + transfers;

    if(risk >= 10){

        return "HIGH";
    }

    else if(risk >= 5){

        return "MEDIUM";
    }

    else{

        return "LOW";
    }

}

/* TEST */

console.log(
    calculateRisk(7,4)
);