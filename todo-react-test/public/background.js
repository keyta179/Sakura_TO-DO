chrome.webNavigation.onCompleted.addListener(function(details) {
  if (details.url.includes("youtube.com") || details.url.includes("twitter.com")) {
      console.log("youtube.comにアクセスしました。アラートを表示します。");
      chrome.scripting.executeScript({
          target: {tabId: details.tabId},
          files: ["alert.js"]
      });
    }
  });