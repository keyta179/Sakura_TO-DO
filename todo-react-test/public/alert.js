chrome.storage.local.get("flagDate", function (result) {
    let nowDate = new Date().toLocaleString().split(" ");
    let lastDate = result.flagDate;
    if (!lastDate || lastDate !== nowDate[0]) {
        alert('やらなきゃいけないことは終わったの?');
        chrome.storage.local.set({'flagDate': nowDate[0]}, function() {});
    }
});
