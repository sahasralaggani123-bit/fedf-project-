/* ========================================= */
/* PARTICLES BACKGROUND */
/* ========================================= */

particlesJS("particles-js", {

    particles: {

        number: {
            value: 90,
            density: {
                enable:true,
                value_area:800
            }
        },

        color: {
            value:"#00e1ff"
        },

        shape: {
            type:"circle"
        },

        opacity: {
            value:0.5
        },

        size: {
            value:3
        },

        line_linked: {
            enable:true,
            distance:150,
            color:"#00e1ff",
            opacity:0.3,
            width:1
        },

        move: {
            enable:true,
            speed:2
        }

    },

    interactivity: {

        detect_on:"canvas",

        events: {

            onhover:{
                enable:true,
                mode:"repulse"
            },

            onclick:{
                enable:true,
                mode:"push"
            }

        }

    },

    retina_detect:true

});