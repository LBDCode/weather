
// temps are returned in kelvin - convert to F
var convertKelToFar = function(tempKelvin) {    
    const tempF = (Number(tempKelvin) - 273.15) * 9/5 + 32;
    return Math.round(tempF);
}

// check to make sure query is valid (no numbers, length > 0)
var checkQuery = function(q) {
    q = q.replace(/[^a-zA-Z]/ig, "");
    return q.length > 0 ? true : false;
};

// for current weather, build the url, hit the API, build the current weather object
getCurrent = function(query) {
    let current = [];
    let apiURL = "https://api.openweathermap.org/data/2.5/weather?";
    let apiQuery = "q=" + query + ",us";
    let apiKey = "&APPID=79f81dfe4be4cf22b4649c28fedb9bb3";

    $.ajax({
        url: apiURL + apiQuery + apiKey,
        data: {
        format: 'json'
        },
        error: function(error) {
            console.log("error: ")
        },
        success: function(data) {
            const cur = {
                search: query[0].toUpperCase() + query.substr(1), // format the search query
                temp: convertKelToFar(data.main.temp_max), //convert the max temp to F
                conditions: data.weather[0].main // get main condition
            }
            current.push(cur);
        },
        type: 'GET'
    }).then(() => renderCurrentWeather(current));
};

// for current weather, build the url, hit the API, build the current weather object
getForecast = function(query) {
    let forecast = [];
    let apiURL = "https://api.openweathermap.org/data/2.5/forecast?";
    let apiQuery = "q=" + query + ",us";
    let apiKey = "&APPID=79f81dfe4be4cf22b4649c28fedb9bb3";

    $.ajax({
        url: apiURL + apiQuery + apiKey,
        data: {
        format: 'json'
        },
        error: function(error) {
            console.log("error: ")
        },
        success: function(data) {
            data.list.forEach(function(item) {
                // get one result per day out of the 8 choices (chose arbitrary timestamp of 12:00:00)
                if (item.dt_txt.split(" ")[1] === "12:00:00") {
                    const forecastObj = {
                        day: moment(item.dt_txt).format('dddd'),
                        temp: convertKelToFar(item.main.temp_max), // convert max temp to F
                        conditions: item.weather[0].main, // get main condition for each day
                        icon: `http://openweathermap.org/img/w/${item.weather[0].icon}.png` // get icon url
                    };
                    forecast.push(forecastObj);
                }
            })
        },
        type: 'GET'
    }).then(() => renderForecast(forecast));
};

// render current conditions into current container w/ handlebars
const renderCurrentWeather = function(cur){
    const $currentDiv = $('.currentContainer').empty();
    const template = Handlebars.compile($('#current').html());
    
    $currentDiv.append(template(cur[0]));
};

// render forecast into current container w/ handlebars
const renderForecast = function(fCast){
    const $forecastDiv = $('.forecastContainer').empty();
    const template = Handlebars.compile($('#forecast').html());

    fCast.forEach(item => {
        $forecastDiv.append(template(item));
    });

};    

var resetQueryField = function() {
    $("#query").val('');
};

$("#searchButton").click(function() {
    let $query = $("#query").val();
    if (checkQuery($query)) {
        getForecast($query);
        getCurrent($query);
    } else {
        console.log("invalid"); //yeah, this sucks - add a message div to actually handle/communicate errors
    }
    resetQueryField();
});



