document.getElementById('stayBtn').addEventListener('click', () => {
    // Kullanıcı "Devam Et" butonuna tıkladıysa siteyi aç
    chrome.storage.local.get(["blockedUrl", "visitedSites"], (result) => {
        const blockedUrl = result.blockedUrl;
        let visitedSites = result.visitedSites || [];

        if (blockedUrl) {
            // Eğer site visitedSites'te yoksa, ekle
            if (!visitedSites.includes(blockedUrl)) {
                visitedSites.push(blockedUrl);
                chrome.storage.local.set({ visitedSites: visitedSites }, () => {
                    console.log(`${blockedUrl} visitedSites listesine eklendi.`);
                });
            }

            // Kullanıcıyı siteye yönlendir
            chrome.tabs.update({ url: blockedUrl }, () => {
                console.log(`${blockedUrl} açılıyor...`);
            });

            window.close(); // Popup'ı kapat
        }
    });
});

  
  document.getElementById('leaveBtn').addEventListener('click', () => {
    // Kullanıcı "Terk Et" butonuna tıkladıysa aktif sekmeyi kapat
    chrome.storage.local.get("activeTabId", (result) => {
      const activeTabId = result.activeTabId;
  
      if (activeTabId) {
        chrome.tabs.remove(activeTabId, () => {
          console.log(`SEKME ${activeTabId} KAPATILDI.`);
        });
      }
  
      // Geçmişten siteyi sil
      chrome.storage.local.get("visitedSites", (result) => {
        let visitedSites = result.visitedSites || [];
        const blockedUrl = result.blockedUrl;
  
        if (blockedUrl) {
          // Siteyi visitedSites'ten sil
          visitedSites = visitedSites.filter(site => site !== blockedUrl);
          chrome.storage.local.set({ visitedSites: visitedSites });
  
          // Chrome history'den de sil
          chrome.history.deleteUrl({ url: blockedUrl }, () => {
            console.log(`Site ${blockedUrl} GEÇMİŞTEN SİLİNDİ.`);
          });
        }
      });
  
      window.close(); // Popup'ı kapat
    });
  });
  