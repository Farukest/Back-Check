// Eklenti ilk kurulduğunda veya Chrome açıldığında çalışacak
chrome.runtime.onInstalled.addListener(() => {
    // Tüm geçmişi al
    chrome.history.search({ text: '', maxResults: 50000 }, (results) => {
        const visitedSites = results.map(entry => {
            const currentUrl = new URL(entry.url);
            const baseDomain = getBaseDomain(currentUrl.hostname);
            return `${currentUrl.protocol}//${baseDomain}`;  // Ana domaini al
        });

        // Kaydedilen siteleri chrome.storage'ye kaydet
        chrome.storage.local.set({ visitedSites: visitedSites }, () => {
            console.log("Tarihçe kaydedildi:", visitedSites);
        });
    });
});

// Eklenti her sekme güncellendiğinde çalışacak
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url && tab.url) {
        const currentUrl = new URL(tab.url);
        const baseDomain = getBaseDomain(currentUrl.hostname);
        const baseUrl = `${currentUrl.protocol}//${baseDomain}`;

        // visitedSites listesinde önceki ziyaret edilen siteleri al
        chrome.storage.local.get(["visitedSites"], (result) => {
            const visitedSites = result.visitedSites || [];

            // Eğer site daha önce ziyaret edilmemişse
            if (!visitedSites.includes(baseUrl)) {
                // Siteyi visitedSites listesine ekle
                visitedSites.push(baseUrl);

                // visitedSites'i güncelle
                chrome.storage.local.set({ visitedSites: visitedSites }, () => {
                    console.log(`${baseUrl} kaydedildi.`);
                });

                // Content script'i enjekte et
                chrome.scripting.executeScript(
                    {
                        target: { tabId: tabId },
                        files: ["content.js"]
                    },
                    () => {
                        // Content script'e mesaj gönder
                        chrome.tabs.sendMessage(tabId, { type: "NEW_SITE", site: baseUrl });
                    }
                );
            }
        });
    }
});

// Helper function: Base domaini almak için (Subdomain'leri yok sayacak şekilde)
function getBaseDomain(hostname) {
    // Burada, hostname'deki sadece son iki kısmı alıyoruz (örneğin: example.com)
    const domainParts = hostname.split('.');
    if (domainParts.length > 2) {
        // Eğer domain 3 veya daha fazla parçadan oluşuyorsa (subdomain var), son iki parçayı alıyoruz
        return domainParts.slice(domainParts.length - 2).join('.');
    }
    // Eğer domain sadece 2 parçadan oluşuyorsa (örn: example.com), olduğu gibi döndür
    return hostname;
}
