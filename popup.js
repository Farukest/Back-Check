document.getElementById('stayBtn').addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://example.com' });  // Örnek siteye git
    window.close();  // Popup'ı kapat
  });
  
  document.getElementById('leaveBtn').addEventListener('click', () => {
    window.close();  // Popup'ı kapat, kullanıcı terk etti
  });
  