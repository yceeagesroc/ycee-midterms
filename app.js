// Function to fetch data from iTunes Search API (returns JSON)
async function fetchBTS() {
    const query = document.getElementById('searchInput').value || 'BTS';
    const resultsContainer = document.getElementById('results');
    const status = document.getElementById('status');
    
    status.innerText = "Loading the magic...";
    resultsContainer.innerHTML = '';

    try {
        // API URL for BTS content
        const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=20`;
        
        const response = await fetch(url);
        const data = await response.json(); // This is the JSON return

        if (data.results.length === 0) {
            status.innerText = "No tracks found. Try searching 'Butter' or 'Map of the Soul'.";
            return;
        }

        status.innerText = `Found ${data.resultCount} results for "${query}"`;

        data.results.forEach(track => {
            // Replace low-res art with high-res (100x100 to 600x600)
            const hiresArt = track.artworkUrl100.replace('100x100bb', '600x600bb');
            
            const card = `
                <div class="glass rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 group">
                    <div class="relative overflow-hidden">
                        <img src="${hiresArt}" alt="${track.collectionName}" class="w-full aspect-square object-cover">
                        <div class="absolute inset-0 bg-purple-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <a href="${track.trackViewUrl}" target="_blank" class="bg-white text-black px-4 py-2 rounded-full font-bold text-xs">VIEW ON ITUNES</a>
                        </div>
                    </div>
                    <div class="p-5">
                        <h3 class="font-black text-lg truncate">${track.trackName}</h3>
                        <p class="text-purple-400 text-sm truncate">${track.collectionName}</p>
                        <div class="mt-4 flex items-center justify-between">
                            <span class="text-xs text-gray-500">${new Date(track.releaseDate).getFullYear()}</span>
                            <audio controls class="h-8 w-32 opacity-50 hover:opacity-100">
                                <source src="${track.previewUrl}" type="audio/mpeg">
                            </audio>
                        </div>
                    </div>
                </div>
            `;
            resultsContainer.innerHTML += card;
        });

    } catch (error) {
        console.error("API Error:", error);
        status.innerText = "Error connecting to the ARMY signal.";
    }
}

// Load default BTS tracks on startup
window.onload = fetchBTS;