chrome.webNavigation.onCompleted.addListener(function(details) {
    if (details.url.includes("youtube.com")) {
      console.log("youtube.comにアクセスしました。アラートを表示します。");
      chrome.scripting.executeScript({
          target: {tabId: details.tabId},
          function: showAlert
      });
    }
  });

function showAlert() {
    alert('やらなきゃいけないことは終わったの?');
}
