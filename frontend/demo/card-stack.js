document.addEventListener('DOMContentLoaded', function () {

    var long, lat;

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(storePosition);
        } else { 
            x.innerHTML = "Geolocation is not supported by this browser.";
        }
    }
    
    function storePosition(position) {
        lat = position.coords.latitude;
        long = position.coords.longitude;
        console.log(lat, long);
    }

    getLocation();

    var stack;

    stack = window.swing.Stack();

    // create one card for each li element in the ul.stack
    let url = "http://localhost:8000/activity/random"
    $.ajax({
        url: url,
        method: "get",
        success: function(result) {
            console.log(result);
            let data = JSON.parse(result);
            $('.stack').append("<li><p><strong>" + data.categoryTitle + "</strong></p>" + 
                                "<p>#" + data.parentTitle + "</p>" +
                                "<p>#" + data.type + "</p>" +
                                "<p class='hidden'>" + data.categoryAlias + "</p></li>");
            [].forEach.call(document.querySelectorAll('.stack li'), function (targetElement) {
                stack.createCard(targetElement);
        
                targetElement.classList.add('in-deck');
            });
        }
    })

    stack.on('throwoutleft', function (e) {
        console.log(e.target.innerText || e.target.textContent, 'has been thrown out of the stack to the', e.throwDirection, 'direction.');
        e.target.classList.remove('in-deck');
        let url = "http://localhost:8000/activity/random"
        $.ajax({
            url: url,
            method: "get",
            success: function(result) {
                console.log(result);
                let data = JSON.parse(result);
                $('.stack').append("<li><p><strong>" + data.categoryTitle + "</strong></p>" + 
                                    "<p>#" + data.parentTitle + "</p>" +
                                    "<p>#" + data.type + "</p>" +
                                    "<p class='hidden'>" + data.categoryAlias + "</p></li>");
                [].forEach.call(document.querySelectorAll('.stack li'), function (targetElement) {
                    stack.createCard(targetElement);
            
                    targetElement.classList.add('in-deck');
                });
            }
        })
    });

    stack.on('throwoutright', function (e) {
        console.log(e.target.innerText || e.target.textContent, 'has been thrown into the stack from the', e.throwDirection, 'direction.');
        e.target.classList.add('in-deck');
        let type = e.target.children[2].innerText;
        if (type == "#indoor") {
            let query = e.target.children[0].innerText;
            search(query);
            let url = "http://localhost:8000/activity/random"
            $.ajax({
                url: url,
                method: "get",
                success: function(result) {
                    console.log(result);
                    let data = JSON.parse(result);
                    $('.stack').append("<li><p><strong>" + data.categoryTitle + "</strong></p>" + 
                                        "<p>#" + data.parentTitle + "</p>" +
                                        "<p>#" + data.type + "</p>" +
                                        "<p class='hidden'>" + data.categoryAlias + "</p></li>");
                    [].forEach.call(document.querySelectorAll('.stack li'), function (targetElement) {
                        stack.createCard(targetElement);
                        targetElement.classList.add('in-deck');
                    });
                }
            })
        } else {
            let alias = e.target.children[3].innerText || e.target.children[3].textContent;
            console.log('alias: ' + alias);
            let url = "http://localhost:8000/business/search"
            let queryString = "radius=5000"
                            + "&latitude=" + lat
                            + "&longitude=" + long
                            + "&categories=" + alias;
            $.ajax({
                url: url + "?" + queryString,
                method: "get",
                success: function(result) {
                    data = JSON.parse(result);
                    let businesses;
                    if (data.businesses.length > 6) {
                        businesses = data.businesses.slice(0, 6);
                    } else {
                        if (data.businesses.length % 2 == 1)
                            businesses = data.businesses.slice(0, data.businesses.length - 1);
                        else businesses = data.businesses;
                    }
                    if (businesses.length == 0) {
                        $("#modal-container").append("<p>Aw Snap! Nothing to show here :-(</p>");
                    } else {
                        for (let i = 0; i < businesses.length; i += 2) {

                            $("#modal-container").append(
                    
                                "<div class='row'>" + 
                                    "<div class='card col-md-6' style='width: 18rem;'>" +
                                    "<img width='300' height='200' src='" + businesses[i].image_url + "'class='card-img-top mt-1'>" +
                                        "<div class='card-body'>" +
                                            "<h5 class='card-title'>" + businesses[i].name + "</h5>" +
                                            "<p class='card-text'>" + businesses[i].rating +"<i class='fas fa-star'></i></p>" +
                                        "</div>" +
                                    "</div>" +
                                    "<div class='card col-md-6' style='width: 18rem;'>" +
                                    "<img width='300' height='200' src='" + businesses[i + 1].image_url + "'class='card-img-top mt-1'>" +
                                        "<div class='card-body'>" +
                                            "<h5 class='card-title'>" + businesses[i + 1].name + "</h5>" +
                                            "<p class='card-text'>" + businesses[i + 1].rating +"<i class='fas fa-star'></i></p>" +
                                        "</div>" +
                                    "</div>" +
                                "</div>"
                            )
                            
                        }
                    }
                    
                    $("#modal-btn").click();
                }

            });
        }
        
    });

    $(".close").click(e => {
        console.log("Clearing");
        $("#modal-container").empty();
        // create one card for each li element in the ul.stack
        let url = "http://localhost:8000/activity/random"
        $.ajax({
            url: url,
            method: "get",
            success: function(result) {
                console.log(result);
                let data = JSON.parse(result);
                $('.stack').append("<li><p><strong>" + data.categoryTitle + "</strong></p>" + 
                                    "<p>#" + data.parentTitle + "</p>" +
                                    "<p>#" + data.type + "</p>" +
                                    "<p class='hidden'>" + data.categoryAlias + "</p></li>");
                [].forEach.call(document.querySelectorAll('.stack li'), function (targetElement) {
                    stack.createCard(targetElement);
            
                    targetElement.classList.add('in-deck');
                });
            }
        })
    });

    function search(query)
    {
        url ='http://www.google.com/search?q=' + query;
        window.open(url,'_blank');
    }

});
