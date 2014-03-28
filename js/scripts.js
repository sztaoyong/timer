var caseId = 100000000;
var associateId = 1999;
var timer;
var tick;
var active;

function startTimer(){
    loadTimer();
    active = true;
    tick = setInterval(incrementTimer, 1000);
    return true;
}

function loadTimer(){
    if(localStorage.getItem("lastTimer" + caseId) === null){
        timer = 0;
    }else{
        timer = localStorage.getItem("lastTimer" + caseId);
    }
}

window.onblur = function() {
    active = false;
};

window.onfocus = function() {
    active = true;
};

window.onunload = window.onbeforeunload = function(){
    key = "lastTimer" + caseId;
    localStorage[key] = timer;
};

function incrementTimer(){
    if (active) {
        timer++;
    }
    document.getElementById("timer").innerHTML = secondToTime(timer);
}

function computeAHT(){
    if (supportsLocalStorage()) { 
        var caseHandleTime = timer;
        localStorage["lastCHT" + associateId] = caseHandleTime; // save this case handle time;
        if (updateAHT(associateId, caseHandleTime)) { 
            alert(JSON.stringify(displayInfo())); // display AHT information; // all pass parameters
            clearInterval(tick);
            localStorage.removeItem("lastTimer" + caseId);
            timer = 0;
            return true;
        }
    }else{
        // alert('local storage failed!');
    }
}

function displayInfo(){
    if (!supportsLocalStorage()) { 
        alert("local storage failed!");
        return false; 
    }
     var lastCHTValue = localStorage["lastCHT" + associateId];
     var AHTValues = JSON.parse(localStorage["AHT" + associateId]);

     var AHTInfo = {lastCaseHandleTime:secondToTime(lastCHTValue), AHT:secondToTime(AHTValues.AHT)};
     return AHTInfo;
}

function secondToTime(ss) {
    function padding(n) {
        return (n<10? '0':'') + n;
    }
    
    var s = Math.round(ss);
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
