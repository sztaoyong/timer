var caseId = 100000000;
var associateId = 1999;

function setStartTime(){
    if (!supportsLocalStorage()) {
        alert("local storage failed!"); 
        return false; 
    }
    var startTime = new Date();
    var key = "CST" + caseId; // Case start time
    var values = {csId:associateId, start:startTime};
    localStorage[key] = JSON.stringify(values);
    return true;
}

function computeAHT(){
    if (!supportsLocalStorage()) { 
        alert("local storage failed!");
        return false; 
    }
    var key = "CST" + caseId;
    if (localStorage.getItem(key) === null) {
        alert("this case has been solved. refresh the page to get next case!");
        return false;
    } else{
        var startValues = JSON.parse(localStorage[key]);
        var associateId = startValues.csId;
        var startTime = new Date(startValues.start);
        var endTime = new Date();
        var caseHandleTime = endTime - startTime;
        localStorage["lastCHT" + associateId] = caseHandleTime; // save this case handle time;
        if (!updateAHT(associateId, caseHandleTime)) { 
            return false; 
        }else{
            localStorage.removeItem(key); // this case has been resolved;
            alert(JSON.stringify(displayInfo())); // display AHT information;
            return true;
        }
    }
}

function displayInfo(){
    if (!supportsLocalStorage()) { 
        alert("local storage failed!");
        return false; 
    }
     var lastCHTValue = localStorage["lastCHT" + associateId];
     var AHTValues = JSON.parse(localStorage["AHT" + associateId]);

     var AHTInfo = {lastCaseHandleTime:msToTime(lastCHTValue), AHT:msToTime(AHTValues.AHT)};
     return AHTInfo;
}

function msToTime(s) {
    function padding(n) {
        return (n<10? '0':'') + n;
    }
    
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;
    return padding(hrs) + ':' + padding(mins) + ':' + padding(secs);
}

function updateAHT(associateId, caseHandleTime){
    if (!supportsLocalStorage()) { 
        alert("local storage failed!");
        return false; 
    }   
    var key = "AHT" + associateId; // average handle time
    if(localStorage.getItem(key) === null){
        var values = {n:1, AHT:caseHandleTime};
        localStorage[key] = JSON.stringify(values);
    }else{
        var oldValues = JSON.parse(localStorage.getItem(key));
        var n = oldValues.n;
        var oldAHT = oldValues.AHT;
        var newAHT = (n * oldAHT + caseHandleTime)/(n + 1);
        var newValues = {n:(n+1), AHT:newAHT};
        localStorage[key] = JSON.stringify(newValues);
    }
    return true;
}

function supportsLocalStorage() {
    return ('localStorage' in window) && window.localStorage !== null;
} 
