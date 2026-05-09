/* ========================================= */
/* RECOMMENDATION ENGINE */
/* ========================================= */

function getRecommendation(risk){

    if(risk === "HIGH"){

        return `
        Contact Help Desk Immediately
        `;
    }

    else if(risk === "MEDIUM"){

        return `
        Stay Near Carousel Area
        `;
    }

    else{

        return `
        Baggage is Safe
        `;
    }

}

/* TEST */

console.log(
    getRecommendation("HIGH")
);