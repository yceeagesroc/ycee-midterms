async function fetchBTS() {
    const searchInput = document.getElementById('searchInput');
    const resultsContainer = document.getElementById('results');
    const status = document.getElementById('status');
    
    // Kunin ang text sa search bar, default ay 'BTS' kung empty
    const query = searchInput.value.trim() || 'BTS';
    
    status.innerText = "Searching the archives...";
    resultsContainer.innerHTML = ''; // Linisin ang dating results

    try {
        // iTunes API - entity=song para puro kanta ang lumabas
        const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=20`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error("Network response was not ok");
        
        const data = await response.json();

        if (data.results.length === 0) {
            status.innerText = "No tracks found. Try another keyword!";
            return;
        }

        status.innerText = `Showing ${data.results.length} results for "${query}"`;

        // I-map ang bawat track para maging HTML card
        const cardsHTML = data.results.map(track => {
            // Palitan ang 100x100 na image ng 600x600 para HD
            const hiresArt = track.artworkUrl100.replace('100x100bb', '600x600bb');
            const releaseYear = new Date(track.releaseDate).getFullYear();

            return `
                <div class="glass rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 group">
                    <div class="relative overflow-hidden">
                        <img src="${hiresArt}" alt="${track.trackName}" class="w-full aspect-square object-cover">
                        <div class="absolute inset-0 bg-purple-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <a href="${track.trackViewUrl}" target="_blank" class="bg-white text-black px-4 py-2 rounded-full font-bold text-xs">VIEW ON ITUNES</a>
                        </div>
                    </div>
                    <div class="p-5">
                        <h3 class="font-bold text-lg truncate mb-1" title="${track.trackName}">${track.trackName}</h3>
                        <p class="text-purple-400 text-sm truncate mb-4">${track.collectionName}</p>
                        
                        <div class="flex items-center justify-between mt-auto">
                            <span class="text-xs text-gray-500">${releaseYear}</span>
                            ${track.previewUrl ? `
                                <audio controls class="h-8 w-32 opacity-70 hover:opacity-100">
                                    <source src="${track.previewUrl}" type="audio/mpeg">
                                </audio>
                            ` : '<span class="text-[10px] italic text-gray-500">No Preview</span>'}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        resultsContainer.innerHTML = cardsHTML;

    } catch (error) {
        console.error("Error:", error);
        status.innerText = "Error connecting to the server. Please try again.";
    }
}

// Para lumabas agad ang music pagka-open ng website
window.addEventListener('DOMContentLoaded', fetchBTS);

// Para gumana ang "Enter" key sa search bar
document.getElementById('searchInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        fetchBTS();
    }
});
