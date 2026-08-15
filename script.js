const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const results = document.getElementById("results");
const showFavoritesBtn = document.getElementById("showFavoritesBtn");
const sortSelect = document.getElementById("sortSelect");

let favorites = [];
let currentAlbums = [];

const savedFavorites = localStorage.getItem("favorites");

if(savedFavorites){
    favorites = JSON.parse(savedFavorites);
}

function displayAlbums(albums){
    
    results.innerHTML = `
        <p class="result-count">
            Found ${albums.length} album${albums.length !==1 ? "s" : ""}
        </p>

        ${albums.map(function(album){

            const date = new Date(album.releaseDate);

            const formattedDate = date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
            
            return `
                <div class="album-card">
                    <img src="${album.artworkUrl100}" alt="${album.collectionName}">

                    <h2>${album.collectionName}</h2>

                    <p>${album.artistName}</p>

                    <p>${album.trackCount} ${albums.trackCount === 1 ? "track" : "tracks"}</p>

                    <p>${formattedDate}</p>

                    <a href="${album.collectionViewUrl}" target="_blank">
                        View in iTuens
                    </a>

                    <button class="favorite-btn">
                        ♡ Favorite
                    </button>
                </div>
            `;
        }).join("")}
    `;
}

function searchAlbums() {

    const query = searchInput.value.trim();

    const encodedQuery = encodeURIComponent(query);

    if(query === ""){
        results.innerHTML = `
            <p class="message">
                Please enter an album or artist name.
            </p>
        `;
        return;
    }

    results.innerHTML = `
        <p class="message">
            Searching for albums... 🎵
        </p>
    `;

    fetch(`https://itunes.apple.com/search?term=${encodedQuery}&entity=album&limit=5`)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {

            if(data.results.length === 0){
                results.innerHTML = `
                    <p class="message error">
                        No albums found. Try another search.
                    </p>
                `;
                return;
            }

            currentAlbums = data.results;

            const resultCount = data.results.length;

            displayAlbums(currentAlbums);

            const favoriteButtons = document.querySelectorAll(".favorite-btn");

            favoriteButtons.forEach(function(button , index){
                button.addEventListener("click" , function(){

                    const album = data.results[index];

                    const alreadyFavorite = favorites.some(function(favorite){
                        return favorite.collectionId === album.collectionId;
                    });
                    if(alreadyFavorite){
                        return;
                    }

                    favorites.push(album);
                    localStorage.setItem("favorites", JSON.stringify(favorites));
                    button.innerHTML =  "❤️ Favorited";
                    console.log(favorites);
                });
            });

        })
        .catch(function(error){
            console.log(error);
            results.innerHTML = `
                <p class="message error">
                    Something went wrong. Please try again.
                </p>
            `;
        });
};

searchBtn.addEventListener("click", searchAlbums);

searchInput.addEventListener("keydown", function(event){
    if(event.key === "Enter"){
        searchAlbums();
    }
})

showFavoritesBtn.addEventListener("click", function(){

    if(favorites.length === 0){
        results.innerHTML = `
            <p class="message">
                You haven't added any favorites yet.
            </p>
        `;
        return;
    }

    results.innerHTML = favorites.map(function(album){

        const date = new Date(album.releaseDate);

        const formattedDate = date.toLocaleDateString("en-US",{
            year: "numeric",
            month: "long",
            day: "numeric"
        });

        return `
            <div class="album-card">
                <img src="${album.artworkUrl100}" alt="${album.collectionName}">
                <h2>${album.collectionName}</h2>
                <div class="album-info">
                    <p>${album.artistName}</p>
                    <p>${album.trackCount} ${album.trackCount === 1 ? "track" : "tracks"}</p>
                    <p>${formattedDate}</p>
                </div>

                <a herf="${album.collectionViewUrl}" target="_blank">
                    View in iTunes
                </a>

                <button class="remove-favorite-btn" data-id="${album.collectionId}">
                    Remove Favorite
                </button>

            </div>
        `;
    }).join("");

    results.addEventListener("click", function(event){

        if(event.target.classList.contains("remove-favorite-btn")){

            const albumId = Number(event.target.dataset.id);

            favorites = favorites.filter(function(album){
                return album.collectionId !== albumId;
            });

            localStorage.setItem("favorites" , JSON.stringify(favorites));

            showFavoritesBtn.click();
        }
    }) 
}) 

sortSelect.addEventListener("change", function(){

    const sortValue = sortSelect.value;

    if(sortValue === "az"){
        currentAlbums.sort(function(a,b){
            return a.collectionName.localeCompare(b.collectionName);
        });
    }

    if(sortValue === "za"){
        currentAlbums.sort(function(a , b){
            return b.collectionName.localeCompare(a.collectionName);
        });
    }

    if(sortValue === "newest"){
        currentAlbums.sort(function(a,b){
            return new Date(b.releaseDate) - new Date(a.releaseDate);
        });
    }

    if(sortValue === "oldest"){
        currentAlbums.sort(function(a,b){
            return new Date(a.releaseDate) - new Date(b.releaseDate);
        });
    }

    displayAlbums(currentAlbums);
});