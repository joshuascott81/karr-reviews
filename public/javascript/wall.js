// var getOmdbDetails = (movieID, i, fName) => {
//   let key = '6d82971b';
//   let omdb = 'http://www.omdbapi.com/?apikey=' + key + '&i=';

//   $.ajax({
//     type: 'GET',
//     url: omdb + movieID,
//     success: function(data) {
//       fName(data, i);
//     },
//     data: null
//   });
// };

var getReview = (option, limit, fName) => {
  $.ajax({
    type: 'GET',
    async: true,
    url: '/getReview',
    success: function(data) {
      fName(data);
    },
    data: {
      reviewSearchOption: option,
      reviewSearchLimit: limit
    }
  });
};

// build html element and input to id
var buildWall = reviews => {
  posterWall = '';

  posterWall += `<div class="row mb-3" id="ck-review-wall">`;
  reviews.forEach((review, i) => {
    var getDate = new Date(review.date);
    var reviewDate = getDate.toLocaleDateString('en-US');

    posterWall += `<div class="col-lg-3 col-md-4 col-sm-6 mt-2 mb-1">
                      <a href="/reviews/${review._id}">
                        <div class="shadow-sm">
                            <img class="w-100 shadow-bottom" src="${
                              JSON.parse(review.omdbInfo).Poster
                            }" id='poster-url-${i}'>

                        <div class="opacity-50 w-100 rounded-bottom p-2" id="poster-info-${i}">
                            <span class="wall-text-md">${
                              JSON.parse(review.omdbInfo).Title
                            }</span>
                            <span class="wall-text-md">${
                              review.rating
                            }/10</span>
                            <div class="wall-text-sm">${reviewDate} - ${
      review.author.username
    }</div>
                        </div>
                        
                        </div>
                        <a>
                    </div>`;
  });
  posterWall += `</div>`;

  $('#wallDynamic').html(posterWall);

  // reviews.forEach((review, i) => {
  //   getOmdbDetails(review.imdbID, i, addOmdbInfo);
  // });
};

// <div class="caption">
//     <h4>${review.title}</h4>
// </div>
// <div class="caption" id="poster-year-${i}">
//     <h4>Year</h4>
// </div>
// <p><a href='/reviews/${review._id}' class='btn btn-primary'>Read Review</a></p>

var buildFeatured = review => {
  let featuredHtml = `<div class="p-3 shadow-sm mb-3" id="ck-featured-text">
  <img class="w-20 float-left mr-4" src="${
    JSON.parse(review[0].omdbInfo).Poster
  }">
  ${review[0].reviewText}
</div>`;
  $('#ck-featured-text').html(featuredHtml);
};

var buildRecentReviewList = reviews => {
  var reviewListHtml =
    '<li class="list-group-item text-uppercase font-weight-bold">Recent Reviews</li>';
  reviews.forEach(review => {
    reviewListHtml += `<li class="list-group-item"><span class="opacity-80">
    <span class="font-italic wall-text-md">${review.rating}/10</span> - ${
      JSON.parse(review.omdbInfo).Title
    }</span></li>`;
  });
  $('#ck-recent-reviews-list-item').html(reviewListHtml);
};

var addOmdbInfo = (omdbInfo, i) => {
  $(`#poster-year-${i}`).html(omdbInfo.Year);
  $(`#poster-url-${i}`).attr('src', omdbInfo.Poster);
};

// Event Listeners
$('#sort-az').click(() => getReview('az', 8, buildWall));

$('#sort-za').click(() => getReview('za', 8, buildWall));

$('#sort-most-recent').click(() => getReview('sort-most-recent', 8, buildWall));

// Initialize DOM
$(document).ready(() => {
  // query database for reviews: param1 = query, param2 - function to run after query complete
  getReview('sort-most-recent', 8, buildWall);
  getReview('sort-most-recent', 1, buildFeatured);
  getReview('sort-most-recent', 8, buildRecentReviewList);
});
