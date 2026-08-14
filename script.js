const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const results = document.getElementById("results");

const albums = [
    {
        name: "After Hours",
        artist: "The Weeknd",
        releaseDate: "2020-03-20",
        image: "https://i.scdn.co/image/ab67616d0000b273ef6c5f6f6f6f6f6f6f6f6f6",
    },
    {
        name: "Starboy",
        artist: "The Weeknd",
        releaseDate: "2016-11-25",
        image: "https://i.scdn.co/image/ab67616d0000b273..."
    },
    {
        name: "Dawn FM",
        artist: "The Weeknd",
        releaseDate: "2022-01-07",
        image: "https://i.scdn.co/image/ab67616d0000b273..."
    }
];

searchBtn.addEventListener("click", function(){

    const query = searchInput.value.toLowerCase();

    const filteredAlbums = albums.filter(function(album){
        return album.name.toLowerCase().includes(query) ||
            album.artist.toLowerCase().includes(query);
    });

    if(filteredAlbums.length == 0){
        results.innerHTML = "<p>No albums found. Try another search.</p>";
        return;
    }
    
    results.innerHTML = filteredAlbums.map(function(album) {
        return `
            <div class="album-card">
                <img src="${album.image}" alt="${album.name}">
                <h2>${album.name}</h2>
                <p>${album.artist}</p>
                <p>${album.releaseDate}</p>
            </div>
        `;
    }).join("");

});