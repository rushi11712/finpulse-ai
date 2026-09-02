// ⚡ FinPulse AI - Live Core Engine
const API_URL = "https://coingecko.com";

async function fetchMarketData() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("API Limit Reached or Network Issue");
        const data = await response.json();
        
        updateDashboard(data);
    } catch (error) {
        console.error("Pipeline Error:", error);
        document.getElementById("crypto-table-body").innerHTML = 
            `<tr><td colspan="4" style="text-align: center; color: var(--neon-red);">Stream Interrupted: ${error.message}</td></tr>`;
    }
}

function updateDashboard(assets) {
    const tableBody = document.getElementById("crypto-table-body");
    tableBody.innerHTML = ""; // Clear loading placeholder

    // Find and update top volatile asset card
    let topVolatile = assets[0];
    assets.forEach(asset => {
        if (Math.abs(asset.price_change_percentage_24h) > Math.abs(topVolatile.price_change_percentage_24h)) {
            topVolatile = asset;
        }
    });
    
    document.getElementById("top-crypto-val").innerText = topVolatile.symbol.toUpperCase();

    // Render streaming dataset table rows dynamically
    assets.forEach(asset => {
        const isPositive = asset.price_change_percentage_24h >= 0;
        const deltaClass = isPositive ? "text-positive" : "text-negative";
        const deltaSign = isPositive ? "+" : "";

        const row = `
            <tr>
                <td><strong>${asset.symbol.toUpperCase()}</strong> ${asset.name}</td>
                <td>$${asset.current_price.toLocaleString()}</td>
                <td class="${deltaClass}">${deltaSign}${asset.price_change_percentage_24h.toFixed(2)}%</td>
                <td><button class="btn-ai" onclick="triggerAIAnalysis('${asset.id}', ${asset.current_price})">Run AI Analysis</button></td>
            </tr>
        `;
        tableBody.insertAdjacentHTML("beforeend", row);
    });
}

function triggerAIAnalysis(assetId, currentPrice) {
    const chatBox = document.getElementById("chat-box");
    const incomingPrompt = `
        <div class="message user-msg">
            <p><strong>You:</strong> Analyze current vectors for ${assetId.toUpperCase()}.</p>
        </div>
        <div class="message ai-response">
            <p><strong>AI Assistant:</strong> Initiating extraction layer for ${assetId.toUpperCase()} spot value of $${currentPrice}. Connecting to Gemini stack keys tomorrow...</p>
        </div>
    `;
    chatBox.insertAdjacentHTML("beforeend", incomingPrompt);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Fire data pipeline loop on initialization
fetchMarketData();
// Poll market streams every 60 seconds
setInterval(fetchMarketData, 60000);
