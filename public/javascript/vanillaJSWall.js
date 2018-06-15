function process(sortOption) {
    var movieWall = new XMLHttpRequest();
    movieWall.open("post", '/wall');
    movieWall.setRequestHeader('title', sortOption);
    movieWall.send();
    movieWall.onreadystatechange = handleServerResponse;
    
}

function handleServerResponse (error) {
    if (this.readyState == 4 && this.status == 200) {
        var reviews = JSON.parse(this.responseText);
        posterWall = "";
        posterWall += `<div class="row">`;
        reviews.forEach(review => {
            posterWall += `<div class='col-md-3'>
                                <div class='thumbnail'>
                                    <img src="${review.posterURL}">
                                    <div class="caption">
                                        <h4>${review.title}</h4>
                                    </div>
                                    <p><a href='/reviews/${review._id}' class='btn btn-primary'>Read Review</a></p>
                                </div>                
                            </div>`;
        });
        posterWall += `</div>`;
        document.getElementById('wallDynamic').innerHTML = posterWall;
    };
};

document.getElementById('sortaz').addEventListener('click', () => {
    process('az');
});

document.getElementById('sortza').addEventListener('click', () => {
    process('za');
});

document.getElementById('sortMostRecent').addEventListener('click', () => {
    process('mostRecent');
});


function test() {
    console.log('test')
};

// document.getElementById('sortWall').addEventListener("click", (number) => {
//     console.log(number);
// })

