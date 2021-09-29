export const tdist = {
    110000:["北京","1"],
    110100:["北京市","110000"],
    110101:["东城区","110100"],
    110102:["西城区","110100"],
    110103:["崇文区","110100"],
    110104:["宣武区","110100"],
    120000:["天津","1"],
    120100:["和平区","120000"],
    120101:["和平街道","120100"]

}

tdist.getLev1 = function (){
    for (var t=[],e=1;e<100;e++){
        var i = "0000";
        i=e<10 ? "0"+e+i : e+i;
        var n =this[i];
        "undefined" != typeof n && t.push({
            id:i,
            text:n[0]
        })
    }
    return  t
}

tdist.getLev2 = function (t){
    if (""== t){
        return[];
    }

        for (var e=[],i=1;i<100;i++){
            var n = t.substr(0,2);
            n += i < 10 ? "0" + i + "00" : i + "00";
            var r = this[n];
            "undefined" != typeof r && e.push({
                id:n,
                text:r[0]
            })
        }

    return  e
}



tdist.getLev3 = function (t){
    if (""== t){
        return[];
    }

        for (var e=[],i=1;i<100;i++){
            var n = t.substr(0,4);
            n += i < 10 ? "0" + i : i;
            var r = this[n];
            "undefined" !=typeof r && e.push({
                id:n,
                text:r[0]
            })
        }

    return  e
}