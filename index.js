
let forecast = [];

getForecast = function(query) {
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
            console.log(data);
            data.list.forEach(function(item) {
                forecast.push(item);
            })
        },
        type: 'GET'
    });    
};

var checkQuery = function(q) {
    return (q && q.replace(/[^a-zA-Z]/, "").length > 0) ? true : false;
};
    

var resetQueryField = function() {
    $("#query").val('');
};


$("#searchButton").click(function() {
    let query = $("#query").val();
    console.log(checkQuery(query));

    resetQueryField();
});



