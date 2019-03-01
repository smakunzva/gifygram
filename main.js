// window.$ = require('jquery')
// Giphy API object
var giphy = {
    url: 'https://api.giphy.com/v1/gifs/trending',
    query: {
        api_key: '54452c59b31e4d14aca213ec76014baa',
        limit: 12
    }
};

// Update trending giphys
function update() {

    // Toggle refresh state
   $('#update .icon').toggleClass('d-none');

    // Call Giphy API
    $.get( giphy.url, giphy.query)

        // Success
        .done( function (res) {

            // Empty Element
            $('#giphys').empty();

            //Store gify
            let gify = [];

            // Loop Giphys
            $.each( res.data, function (i, giphy) {

                // Add Giphy HTML
                $('#giphys').prepend(
                    '<div class="col-sm-6 col-md-4 col-lg-3 p-1">' +
                        '<img class="w-100 img-fluid" src="' + giphy.images.downsized_large.url + '">' +
                    '</div>'
                );

                // Push gify urls into array
                gify.push(giphy.images.downsized_large.url);
            });
 
            notifyServiceWorker(gify);
        })

        // Failure
        .fail(function(){
            
            $('.alert').slideDown();
            setTimeout( function() { $('.alert').slideUp() }, 2000);
        })

        // Complete
        .always(function() {

            // Re-Toggle refresh state
            $('#update .icon').toggleClass('d-none');
        });

    // Prevent submission if originates from click
    return false;
}

// Manual refresh
$('#update a').click(update);


if(navigator.serviceWorker) {

    //register service worker
    navigator.serviceWorker.register('/sw.js').then((registration)=> {
    });
}

function notifyServiceWorker(gifys) {
    if(navigator.serviceWorker){
        //Get service worker registration
        navigator.serviceWorker.getRegistration().then((reg)=> {
            if(reg.active) {
                reg.active.postMessage({action: 'clearGify', gifys: gifys})
            }
        })
        
    }
}

// Update trending giphys on load
update();
