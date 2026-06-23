// day counter since October 20, 2017 Pacific Time

var countUpDate = new Date("October 20 2017 00:00:00 GMT-0700").getTime(); // Pacific Time

    var x = setInterval(function () {
        var now = new Date();
        var distance = now - countUpDate;
        var days = Math.floor(distance / (1000 * 60 * 60 * 24)); // 1000ms * 60s * 60min * 24hr
        // change class of timer_ to the correct number
        document.getElementById("d1").className = "timer_element timer_" + days.toString().charAt(0);
        document.getElementById("d2").className = "timer_element timer_" + days.toString().charAt(1);
        document.getElementById("d3").className = "timer_element timer_" + days.toString().charAt(2);
        document.getElementById("d4").className = "timer_element timer_" + days.toString().charAt(3);


    }, 1000);