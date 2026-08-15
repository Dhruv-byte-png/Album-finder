const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const results = document.getElementById("results");

function searchAlbums() {

    const query = searchInput.value.trim();

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

    fetch(`https://itunes.apple.com/search?term=${query}&entity=album&limit=5`)
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

            results.innerHTML = data.results.map(function(album) {

                const date = new Date(album.releaseDate);
                const formattedDate = date.toLocaleDateString("en-US" , {
                    year : "numeric",
                    month: "long",
                    day: "numeric",
                });

                return `
                    <div class="album-card">
                        <img src="${album.artworkUrl100}" alt="${album.collectionName}">
                        <h2>${album.collectionName}</h2>
                        <p>${album.artistName}</p>
                        <p>${formattedDate}</p>

                        <a href="${album.collectionViewUrl}" target="_blank">
                            View in iTunes
                        </a>
                    </div>
                `;
            }).join("");

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



