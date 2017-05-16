'use strict';
var onDeviceReady = function() {
    // console.log("JPushPlugin:Device ready!");
    initiateUI();
};
var getRegistrationID = function() {
    if (regID === '') {
        window.plugins.jPushPlugin.getRegistrationID(onGetRegistrationID);
    }
};
var onGetRegistrationID = function(data) {
    try {
        /*console.log("JPushPlugin:registrationID is " + data);*/
        if (data.length == 0) {
            var t1 = window.setTimeout(getRegistrationID, 1000);
        } else {
            localStorage.setItem('regID', data);
            regID = data;
            // bughd("notify", regID);
        }
       /* console.log(data)*/
    } catch (exception) {
        console.log(exception);
    }
};
var onReceiveNotification = function(event) {
    try {
        var alertContent;
        if (device.platform == "Android") {
            alertContent = window.plugins.jPushPlugin.receiveNotification.alert;
        } else {
            alertContent = event.aps.alert;
        }
        console.log(alertContent);
    } catch (exception) {
        console.log(exception);
    }
};
var initiateUI = function() {
    try {
        window.plugins.jPushPlugin.init();
        getRegistrationID();
        if (device.platform != "Android") {
            window.plugins.jPushPlugin.setDebugModeFromIos();
            window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0);
        } else {
            window.plugins.jPushPlugin.setDebugMode(true);
            window.plugins.jPushPlugin.setStatisticsOpen(true);
        }
    } catch (exception) {
        console.log(exception);
    }
};
if(user){
    document.addEventListener("deviceready", onDeviceReady, false);
    document.addEventListener("jpush.receiveNotification", onReceiveNotification, false);
    document.addEventListener('deviceready', function() {
        window.plugins.jPushPlugin.isPushStopped(function(data){
            if(data === 1){
                window.plugins.jPushPlugin.resumePush();
            }
        });
    }, false);
}

function ab2str(buf) {
    var s = String.fromCharCode.apply(null, new Uint8Array(buf));
    return decode_utf8(decode_utf8(s));
}

function decode_utf8(s) {
    return decodeURIComponent(escape(s));
}

// ASCII only
function bytesToString(buffer) {
    var str = String.fromCharCode.apply(null, new Uint8Array(buffer));
    return str;
}

function bytesToStringc(buffer) {
    var str = new Uint8Array(buffer);
    var strbuf = "";
    var tizhong = "";
    var isfalse = "";
    for (var i = 0; i < str.length; i++) {
        var s = str[i].toString(16);
        if (s.length == 1) {
            strbuf += "0" + s + ",";
            if (i == 11 || i == 12) {
                tizhong += "0" + s;
            }
            if (i == 8) {
                isfalse = "0" + s;
            }
        } else {
            strbuf += s + ",";
            if (i == 11 || i == 12) {
                tizhong += s;
            }
            if (i == 8) {
                isfalse = s;
            }
        }



    }
    var tz = parseInt(tizhong, 16);

    return tz.toString() + "&" + isfalse + "=" + strbuf;
}

function stringToHex(str) {　　　　
    var val = "";　　　　
    for (var i = 0; i < str.length; i++) {
        if (val == "") {
            val = str.charCodeAt(i).toString(16);　　　　　　
        } else {
            val += "," + str.charCodeAt(i).toString(16);　　　　
        }
    }　　　　
    return val;　　
}
// ASCII only
function stringToBytes(string) {
    var array = new Uint16Array(string.length);
    for (var i = 0, l = string.length; i < l; i++) {
        array[i] = string.charCodeAt(i);
    }
    return array.buffer;
}

String.prototype.D_o_B = function() {
    var str = this;
    var num = 0;
    var len = str.length;
    str = str.reverse();
    for (var i = 0; i < len; i++) {
        var b = str.charAt(i);
        if (b != "0") {
            num += Math.pow(2, i)
        }
    }
    return num
};
String.prototype.rfidDecode = function(type) {
    var code = this;
    code = code.replace(":FDXB=", "");
    type = type ? type : "ISO11784";
    var H_o_B = {
        "0": "0000",
        "1": "0001",
        "2": "0010",
        "3": "0011",
        "4": "0100",
        "5": "0101",
        "6": "0110",
        "7": "0111",
        "8": "1000",
        "9": "1001",
        "a": "1010",
        "b": "1011",
        "c": "1100",
        "d": "1101",
        "e": "1110",
        "f": "1111"
    };
    switch (type) {
        case "ISO11784":
            code = code.toLowerCase();
            code = code.substr(0, 16);
            var codestr = "";
            var stringArr = [];
            for (var i = 0; i < code.length;) {
                var str = H_o_B[code.charAt(i)] + H_o_B[code.charAt(i + 1)];
                stringArr.push(str);
                i += 2
            }
            stringArr = stringArr.reverse();
            codestr = stringArr.join("");
            var aid_0 = codestr.substr(0, 1);
            aid_0 = aid_0.D_o_B() + "";
            var aid_1 = codestr.substr(1, 3);
            aid_1 = aid_1.D_o_B() + "";
            var aid_2 = codestr.substr(4, 5);
            aid_2 = aid_2.D_o_B() + "";
            var aid_3 = codestr.substr(9, 6);
            aid_3 = aid_3.D_o_B() + "";
            var aid_4 = codestr.substr(15, 1);
            aid_4 = aid_4.D_o_B() + "";
            var aid_5 = codestr.substr(16, 10);
            aid_5 = aid_5.D_o_B() + "";
            var aid_6 = codestr.substr(26, 38);
            aid_6 = aid_6.D_o_B() + "";
            code = aid_5.prepend("0", 3) + aid_6.prepend("0", 12);
            break;
        default:
            code = ""
    }
    return code
};
String.prototype.ID64Decode = function() {
    var code = this;
    code = code.replace(":ID64=", "");
    code = code.replace(/\r\n/g,'');
    return code;
};
String.prototype.prepend = function(str, num) {
    var code = this;
    if (code.length < num) {
        var len = code.length;
        for (var i = 0; i < num - len; i++) {
            code = str + code
        }
        return code
    } else {
        return code.substr(0, num)
    }
};
String.prototype.reverse = function() {
    var code = this;
    var codeArr = code.split("");
    codeArr = codeArr.reverse();
    return codeArr.join("")
};

function sleep(numberMillis) {
    var now = new Date();
    var exitTime = now.getTime() + numberMillis;
    while (true) {
        now = new Date();
        if (now.getTime() > exitTime)
            return;
    }
}


Array.prototype.in_array = function(e) {
    for (var i = 0; i < this.length && this[i] != e; i++);
    return !(i == this.length);
};

function getNumRandom(num) {
    var result = "";
    for (var i = 0; i < num; i++) {
        result += parseInt(Math.random() * 10).toString();
    }
    return result;
}

function chunk(array, size) {
    var result = [];
    for (var x = 0; x < Math.ceil(array.length / size); x++) {
        var start = x * size;
        var end = start + size;
        result.push(array.slice(start, end));
    }
    return result;
}

function Arabia_to_Chinese(Num){
    if(!!Num) {
    for(var i = Num.length-1;i>=0;i--)
    {
        Num = Num.replace(",","") ;
        Num = Num.replace(" ","") ;
    }
    Num = Num.replace("￥","");
    if(isNaN(Num))
    {
       /* alert("请检查小写金额是否正确");*/
        return;
    }
    var part = String(Num).split(".");
    var newchar = "";
    for(i=part[0].length-1;i>=0;i--)
    {
        if(part[0].length > 10)
        {
           /* alert("位数过大，无法计算");*/
            return "";
        }//若数量超过拾亿单位，提示
        var tmpnewchar = "";
        var perchar = part[0].charAt(i);
        switch(perchar)
        {
            case "0": tmpnewchar="零" + tmpnewchar ;break;
            case "1": tmpnewchar="壹" + tmpnewchar ;break;
            case "2": tmpnewchar="贰" + tmpnewchar ;break;
            case "3": tmpnewchar="叁" + tmpnewchar ;break;
            case "4": tmpnewchar="肆" + tmpnewchar ;break;
            case "5": tmpnewchar="伍" + tmpnewchar ;break;
            case "6": tmpnewchar="陆" + tmpnewchar ;break;
            case "7": tmpnewchar="柒" + tmpnewchar ;break;
            case "8": tmpnewchar="捌" + tmpnewchar ;break;
            case "9": tmpnewchar="玖" + tmpnewchar ;break;
        }
        switch(part[0].length-i-1)
        {
            case 0: tmpnewchar = tmpnewchar +"元" ;break;
            case 1: if(perchar!=0)tmpnewchar= tmpnewchar +"拾" ;break;
            case 2: if(perchar!=0)tmpnewchar= tmpnewchar +"佰" ;break;
            case 3: if(perchar!=0)tmpnewchar= tmpnewchar +"仟" ;break;
            case 4: tmpnewchar= tmpnewchar +"万" ;break;
            case 5: if(perchar!=0)tmpnewchar= tmpnewchar +"拾" ;break;
            case 6: if(perchar!=0)tmpnewchar= tmpnewchar +"佰" ;break;
            case 7: if(perchar!=0)tmpnewchar= tmpnewchar +"仟" ;break;
            case 8: tmpnewchar= tmpnewchar +"亿" ;break;
            case 9: tmpnewchar= tmpnewchar +"拾" ;break;
        }
        newchar = tmpnewchar + newchar;
    }
    if(Num.indexOf(".")!=-1)
    {
        if(part[1].length > 2)
        {
            alert("小数点之后只能保留两位,系统将自动截断");
            part[1] = part[1].substr(0,2);
        }
        for(i=0;i<part[1].length;i++)
        {
            tmpnewchar = "";
            perchar = part[1].charAt(i);
            switch(perchar)
            {
                case "0": tmpnewchar="零" + tmpnewchar ;break;
                case "1": tmpnewchar="壹" + tmpnewchar ;break;
                case "2": tmpnewchar="贰" + tmpnewchar ;break;
                case "3": tmpnewchar="叁" + tmpnewchar ;break;
                case "4": tmpnewchar="肆" + tmpnewchar ;break;
                case "5": tmpnewchar="伍" + tmpnewchar ;break;
                case "6": tmpnewchar="陆" + tmpnewchar ;break;
                case "7": tmpnewchar="柒" + tmpnewchar ;break;
                case "8": tmpnewchar="捌" + tmpnewchar ;break;
                case "9": tmpnewchar="玖" + tmpnewchar ;break;
            }
            if(i==0)tmpnewchar =tmpnewchar + "角";
            if(i==1)tmpnewchar = tmpnewchar + "分";
            newchar = newchar + tmpnewchar;
        }
    }
    while(newchar.search("零零") != -1)
        newchar = newchar.replace("零零", "零");
    newchar = newchar.replace("零亿", "亿");
    newchar = newchar.replace("亿万", "亿");
    newchar = newchar.replace("零万", "万");
    newchar = newchar.replace("零元", "元");
    newchar = newchar.replace("零角", "");
    newchar = newchar.replace("零分", "");
    if (newchar.charAt(newchar.length-1) == "元" || newchar.charAt(newchar.length-1) == "角")
        newchar = newchar+"整";
    return newchar;
    }
}

function changeAuthAccessArray(type, array) {
    array.forEach(function (value) {
        value.AuthAccess = type;
        if(value.children != null){
            changeAuthAccessArray(type ,value.children);
        }
    });
}

function changeAuthAccess(type, object) {
    object.AuthAccess = type;
    changeAuthAccessArray(type ,object.children);
}

function chooseAuthIsTrue(array, returnArray){
    array.forEach(function (value) {
        returnArray.push(value.Id);
        value.children.forEach(function (value) {
            returnArray.push(value.Id);
            value.children.forEach(function (value) {
                if(value.AuthAccess){
                    returnArray.push(value.Id);
                }
            });
        });
    });
    return returnArray;
}
