/* ========================================= */
/* DELAY PREDICTION MODULE */
/* ========================================= */

function predictDelay(minutes){

    if(minutes > 30){

        return "High Delay Risk";
    }

    else if(minutes > 15){

        return "Medium Delay Risk";
    }

    else{

        return "Low Delay Risk";
    }

}

/* TEST */

console.log(
    predictDelay(40)
);