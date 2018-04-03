var express = require('express');
var app = express();
var moment = require('moment');
//var url = require('url');
var request = require('request');
var bodyParse = require('body-parser');
//var parser = require('xml2json');
var result;
var type;
var symbol;

var port = process.env.PORT || 3000,
    http = require('http'),
    fs = require('fs'),
    html = fs.readFileSync('index.html');

app.use(bodyParse.json());
app.use(express.static('public'));
app.get('/', function (req,res){
    //var para = url.parse(req.url,true).query;
    type = req.query.type;;
    symbol = req.query.symbol;
    console.log(type);
    console.log(symbol);
    var address;
    if (!type && !symbol){
        res.sendFile(__dirname + '/index.html');
    }
    else{
        if (type == "autocomplete"){
            address = 'https://jsonplaceholder.typicode.com/users';
            //address = 'http://dev.markitondemand.com/MODApis/Api/v2/Lookup/json?input=' + symbol;
            request(address, function (err, response, body) {
                            if (!err&&response.statusCode==200){
                            var json = JSON.parse(body);
                            console.log(json);
                            res.send(body);
                            }
                        });
        }
        else{
            if (type == "news"){
                address = 'https://seekingalpha.com/api/sa/combined/'+symbol+'.xml';
                request(address, function (error, response, body) {
                            if (!error&&response.statusCode==200){
                            //var jsonFile = parser.toJson(body);
                            //var json = JSON.parse(jsonFile);
                            var parseJson = require('xml2js').parseString;
                            parseJson(body,function(err,result){
                                var json = JSON.parse(JSON.stringify(result["rss"]["channel"]));
                                var item1 = json[0]["item"][0];
                                var item2 = json[0]["item"][1];
                                var item3 = json[0]["item"][2];
                                var item4 = json[0]["item"][3];
                                var item5 = json[0]["item"][4];
                                var item6 = json[0]["item"][5];
                                var item7 = json[0]["item"][6];
                                var item8 = json[0]["item"][7];
                                var item9 = json[0]["item"][8];
                                var item10 = json[0]["item"][9];
                                console.log(item1["link"][0]);
                                var results = {
                                    "item1_title" : item1["title"][0],
                                    "item1_link" : item1["link"][0],
                                    "item1_author" : item1["sa:author_name"][0],
                                    "item1_date" : item1["pubDate"][0].substring(0,25)+" EDT",
                                    "item2_title" : item2["title"][0],
                                    "item2_link" : item2["link"][0],
                                    "item2_author" : item2["sa:author_name"][0],
                                    "item2_date" : item2["pubDate"][0].substring(0,25)+" EDT",
                                    "item3_title" : item3["title"][0],
                                    "item3_link" : item3["link"][0],
                                    "item3_author" : item3["sa:author_name"][0],
                                    "item3_date" : item3["pubDate"][0].substring(0,25)+" EDT",
                                    "item4_title" : item4["title"][0],
                                    "item4_link" : item4["link"][0],
                                    "item4_author" : item4["sa:author_name"][0],
                                    "item4_date" : item4["pubDate"][0].substring(0,25)+" EDT",
                                    "item5_title" : item5["title"][0],
                                    "item5_link" : item5["link"][0],
                                    "item5_author" : item5["sa:author_name"][0],
                                    "item5_date" : item5["pubDate"][0].substring(0,25)+" EDT",
                                    "item6_title" : item6["title"][0],
                                    "item6_link" : item6["link"][0],
                                    "item6_author" : item6["sa:author_name"][0],
                                    "item6_date" : item6["pubDate"][0].substring(0,25)+" EDT",
                                    "item7_title" : item7["title"][0],
                                    "item7_link" : item7["link"][0],
                                    "item7_author" : item7["sa:author_name"][0],
                                    "item7_date" : item7["pubDate"][0].substring(0,25)+" EDT",
                                    "item8_title" : item8["title"][0],
                                    "item8_link" : item8["link"][0],
                                    "item8_author" : item8["sa:author_name"][0],
                                    "item8_date" : item8["pubDate"][0].substring(0,25)+" EDT",
                                    "item9_title" : item9["title"][0],
                                    "item9_link" : item9["link"][0],
                                    "item9_author" : item9["sa:author_name"][0],
                                    "item9_date" : item9["pubDate"][0].substring(0,25)+" EDT",
                                    "item10_title" : item10["title"][0],
                                    "item10_link" : item10["link"][0],
                                    "item10_author" : item10["sa:author_name"][0],
                                    "item10_date" : item10["pubDate"][0].substring(0,25)+" EDT",
                                    /*
                                    "item1" : {
                                        "title" : item1["title"][0],
                                        "link" : item1["link"][0],
                                        "author" : item1["sa:author_name"][0],
                                        "date" : item1["pubDate"][0].substring(0,25)+" EDT"
                                    },
                                    "item2" : {
                                        "title" : item2["title"][0],
                                        "link" : item2["link"][0],
                                        "author" : item2["sa:author_name"][0],
                                        "date" : item2["pubDate"][0].substring(0,25)+" EDT"
                                    },
                                    "item3" : {
                                        "title" : item3["title"][0],
                                        "link" : item3["link"][0],
                                        "author" : item3["sa:author_name"][0],
                                        "date" : item3["pubDate"][0].substring(0,25)+" EDT"
                                    },
                                    "item4" : {
                                        "title" : item4["title"][0],
                                        "link" : item4["link"][0],
                                        "author" : item4["sa:author_name"][0],
                                        "date" : item4["pubDate"][0].substring(0,25)+" EDT"
                                    },
                                    "item5" : {
                                        "title" : item5["title"][0],
                                        "link" : item5["link"][0],
                                        "author" : item5["sa:author_name"][0],
                                        "date" : item5["pubDate"][0].substring(0,25)+" EDT"
                                    },
                                    */
                                    "error" : false
                                }
                                res.send(results);
                            });
                            
                            }
                            else{
                                var result = {
                                    "error" : true
                                }
                                res.send(result);
                            }
                        });
            }
            else{
                if (type == "TIME_SERIES_DAILY"){
                    address = 'https://www.alphavantage.co/query?function='+type+'&symbol='+symbol+'&apikey=ZZPJ8EI5S0CXS8O4';
                    request(address, function (err, response, body) {
                        if (!err&&response.statusCode==200){
                        var json = JSON.parse(body);
                        if (!json["Meta Data"]){
                            var result = {
                                    "error" : true
                                }
                            res.send(result);
                        }
                        else{
                        var keys = new Array();
                        var i = 0;
                        for(var key in json["Time Series (Daily)"]){
                            keys[i] = key;
                            i++;
                        }
                        var change = json["Time Series (Daily)"][keys[0]]["4. close"]-json["Time Series (Daily)"][keys[1]]["4. close"];
                        var changePercent = 100*(change/json["Time Series (Daily)"][keys[0]]["4. close"]);
                        change = change.toFixed(2);
                        changePercent = changePercent.toFixed(2);
                        var time = moment().format();
                        var timestamp = time.substring(0,10) + " " + time.substring(11,19) + " EST";
                        var close = json["Time Series (Daily)"][keys[0]]["4. close"]*1;
                        close = close.toFixed(2);
                        var open = json["Time Series (Daily)"][keys[0]]["1. open"]*1;
                        open = open.toFixed(2);
                        var high = json["Time Series (Daily)"][keys[0]]["2. high"]*1;
                        high = high.toFixed(2);
                        var low = json["Time Series (Daily)"][keys[0]]["3. low"]*1;
                        low = low.toFixed(2);
                        var price = new Array();
                        var volume = new Array();
                        var dates = new Array();
                        
                        for(var j = 0;j < 85;j++){
                            price[j] = json["Time Series (Daily)"][keys[85-j-1]]["4. close"]*1;
                            volume[j] = json["Time Series (Daily)"][keys[85-j-1]]["5. volume"]/1000000;
                            dates[j] = keys[85-j-1].substring(5,7)+"/"+keys[85-j-1].substring(8,10);
                        }
                        var result = {
                            "symbol" : symbol,
                            "lastPrice" : close,
                            "change" : change,
                            "changePercent" : changePercent,
                            "open" : open,
                            "high" : high,
                            "low" : low,
                            "volume" : json["Time Series (Daily)"][keys[0]]["5. volume"],
                            "timeStamp" : timestamp,
                            "pricearray" : price,
                            "volumearray" : volume,
                            "dates" : dates,
                            "error" : false
                        }
                        res.send(result);
                        }
                        }
                        else{
                            var result = {
                                    "error" : true
                                }
                            res.send(result);
                        }
                    });
                }
                else{
                    if (type == "SMA"){
                        address = 'https://www.alphavantage.co/query?function=sma&symbol='+symbol+'&interval=daily&time_period=10&series_type=close&apikey=ZZPJ8EI5S0CXS8O4';
                        request(address, function (err, response, body) {
                            if (!err&&response.statusCode==200){
                            var json = JSON.parse(body);
                            if (!json["Meta Data"]){
                                var result = {
                                        "error" : true
                                    }
                                res.send(result);
                            }
                            else{
                            var keys = new Array();
                            var smadata = new Array();
                            var dates = new Array();
                            var i = 0;
                            for(var key in json["Technical Analysis: SMA"]){
                                keys[i] = key;
                                i++;
                            }
                            
                            for(var j=0;j < 130;j++){
                                smadata[j] = json["Technical Analysis: SMA"][keys[130-j-1]]["SMA"]*1;
                                dates[j] = keys[130-j-1].substring(5,7)+"/"+keys[130-j-1].substring(8,10);
                            }
                            var result = {
                                "symbol" : symbol,
                                "smadata" : smadata,
                                "dates" : dates,
                                "error" : false
                            }
                            res.send(result);
                            }
                            }
                            else{
                            var result = {
                                    "error" : true
                                }
                            res.send(result);
                        }
                        });
                    }
                    else if(type == "EMA"){
                        address = 'https://www.alphavantage.co/query?function=ema&symbol='+symbol+'&interval=daily&time_period=10&series_type=close&apikey=ZZPJ8EI5S0CXS8O4';
                        request(address, function (err, response, body) {
                            if (!err&&response.statusCode==200){
                            var json = JSON.parse(body);
                            if (!json["Meta Data"]){
                                var result = {
                                        "error" : true
                                    }
                                res.send(result);
                            }
                            else{
                            var keys = new Array();
                            var emadata = new Array();
                            var dates = new Array();
                            var i = 0;
                            for(var key in json["Technical Analysis: EMA"]){
                                keys[i] = key;
                                i++;
                            }
                            
                            for(var j=0;j < 130;j++){
                                emadata[j] = json["Technical Analysis: EMA"][keys[130-j-1]]["EMA"]*1;
                                dates[j] = keys[130-j-1].substring(5,7)+"/"+keys[130-j-1].substring(8,10);
                            }
                            var result = {
                                "symbol" : symbol,
                                "emadata" : emadata,
                                "dates" : dates,
                                "error" : false
                            }
                            res.send(result);
                            }
                            }
                            else{
                            var result = {
                                    "error" : true
                                }
                            res.send(result);
                        }
                        });
                    }
                    else if(type == "STOCH"){
                        address = 'https://www.alphavantage.co/query?function=stoch&symbol='+symbol+'&interval=daily&time_period=10&series_type=close&apikey=ZZPJ8EI5S0CXS8O4';
                        request(address, function (err, response, body) {
                            if (!err&&response.statusCode==200){
                            var json = JSON.parse(body);
                            if (!json["Meta Data"]){
                                var result = {
                                        "error" : true
                                    }
                                res.send(result);
                            }
                            else{
                            var keys = new Array();
                            var slowkdata = new Array();
                            var slowddata = new Array();
                            var dates = new Array();
                            var i = 0;
                            for(var key in json["Technical Analysis: STOCH"]){
                                keys[i] = key;
                                i++;
                            }
                            
                            for(var j=0;j < 130;j++){
                                slowkdata[j] = json["Technical Analysis: STOCH"][keys[130-j-1]]["SlowK"]*1;
                                slowddata[j] = json["Technical Analysis: STOCH"][keys[130-j-1]]["SlowD"]*1;
                                dates[j] = keys[130-j-1].substring(5,7)+"/"+keys[130-j-1].substring(8,10);
                            }
                            var result = {
                                "symbol" : symbol,
                                "slowkdata" : slowkdata,
                                "slowddata" : slowddata,
                                "dates" : dates,
                                "error" : false
                            }
                            res.send(result);
                            }
                            }
                        });
                    }
                    else if(type == "RSI"){
                        address = 'https://www.alphavantage.co/query?function=rsi&symbol='+symbol+'&interval=daily&time_period=10&series_type=close&apikey=ZZPJ8EI5S0CXS8O4';
                        request(address, function (err, response, body) {
                            if (!err&&response.statusCode==200){
                            var json = JSON.parse(body);
                            if (!json["Meta Data"]){
                                var result = {
                                        "error" : true
                                    }
                                res.send(result);
                            }
                            else{
                            var keys = new Array();
                            var rsidata = new Array();
                            var dates = new Array();
                            var i = 0;
                            for(var key in json["Technical Analysis: RSI"]){
                                keys[i] = key;
                                i++;
                            }
                            
                            for(var j=0;j < 130;j++){
                                rsidata[j] = json["Technical Analysis: RSI"][keys[130-j-1]]["RSI"]*1;
                                dates[j] = keys[130-j-1].substring(5,7)+"/"+keys[130-j-1].substring(8,10);
                            }
                            var result = {
                                "symbol" : symbol,
                                "rsidata" : rsidata,
                                "dates" : dates,
                                "error" : false
                            }
                            res.send(result);
                            }
                            }
                            else{
                            var result = {
                                    "error" : true
                                }
                            res.send(result);
                        }
                        });
                    }
                    else if(type == "ADX"){
                        address = 'https://www.alphavantage.co/query?function=adx&symbol='+symbol+'&interval=daily&time_period=10&series_type=close&apikey=ZZPJ8EI5S0CXS8O4';
                        request(address, function (err, response, body) {
                            if (!err&&response.statusCode==200){
                            var json = JSON.parse(body);
                            if (!json["Meta Data"]){
                                var result = {
                                        "error" : true
                                    }
                                res.send(result);
                            }
                            else{
                            var keys = new Array();
                            var adxdata = new Array();
                            var dates = new Array();
                            var i = 0;
                            for(var key in json["Technical Analysis: ADX"]){
                                keys[i] = key;
                                i++;
                            }
                            
                            for(var j=0;j < 130;j++){
                                adxdata[j] = json["Technical Analysis: ADX"][keys[130-j-1]]["ADX"]*1;
                                dates[j] = keys[130-j-1].substring(5,7)+"/"+keys[130-j-1].substring(8,10);
                            }
                            var result = {
                                "symbol" : symbol,
                                "adxdata" : adxdata,
                                "dates" : dates,
                                "error" : false
                            }
                            res.send(result);
                            }
                            }
                            else{
                            var result = {
                                    "error" : true
                                }
                            res.send(result);
                        }
                        });
                    }
                    else if(type == "CCI"){
                        address = 'https://www.alphavantage.co/query?function=cci&symbol='+symbol+'&interval=daily&time_period=10&series_type=close&apikey=ZZPJ8EI5S0CXS8O4';
                        request(address, function (err, response, body) {
                            if (!err&&response.statusCode==200){
                            var json = JSON.parse(body);
                            if (!json["Meta Data"]){
                                var result = {
                                        "error" : true
                                    }
                                res.send(result);
                            }
                            else{
                            var keys = new Array();
                            var ccidata = new Array();
                            var dates = new Array();
                            var i = 0;
                            for(var key in json["Technical Analysis: CCI"]){
                                keys[i] = key;
                                i++;
                            }
                            
                            for(var j=0;j < 130;j++){
                                ccidata[j] = json["Technical Analysis: CCI"][keys[130-j-1]]["CCI"]*1;
                                dates[j] = keys[130-j-1].substring(5,7)+"/"+keys[130-j-1].substring(8,10);
                            }
                            var result = {
                                "symbol" : symbol,
                                "ccidata" : ccidata,
                                "dates" : dates,
                                "error" : false
                            }
                            res.send(result);
                            }
                            }
                            else{
                            var result = {
                                    "error" : true
                                }
                            res.send(result);
                        }
                        });
                    }
                    else if(type == "BBANDS"){
                        address = 'https://www.alphavantage.co/query?function=bbands&symbol='+symbol+'&interval=daily&time_period=10&series_type=close&apikey=ZZPJ8EI5S0CXS8O4';
                        request(address, function (err, response, body) {
                            if (!err&&response.statusCode==200){
                            var json = JSON.parse(body);
                            if (!json["Meta Data"]){
                                var result = {
                                        "error" : true
                                    }
                                res.send(result);
                            }
                            else{
                            var keys = new Array();
                            var lowerdata = new Array();
                            var upperdata = new Array();
                            var middledata = new Array();
                            var dates = new Array();
                            var i = 0;
                            for(var key in json["Technical Analysis: BBANDS"]){
                                keys[i] = key;
                                i++;
                            }
                            
                            for(var j=0;j < 130;j++){
                                lowerdata[j] = json["Technical Analysis: BBANDS"][keys[130-j-1]]["Real Lower Band"]*1;
                                upperdata[j] = json["Technical Analysis: BBANDS"][keys[130-j-1]]["Real Upper Band"]*1;
                                middledata[j] = json["Technical Analysis: BBANDS"][keys[130-j-1]]["Real Middle Band"]*1;
                                dates[j] = keys[130-j-1].substring(5,7)+"/"+keys[130-j-1].substring(8,10);
                            }
                            var result = {
                                "symbol" : symbol,
                                "lowerdata" : lowerdata,
                                "upperdata" : upperdata,
                                "middledata" : middledata,
                                "dates" : dates,
                                "error" : false
                            }
                            res.send(result);
                            }
                            }
                            else{
                            var result = {
                                    "error" : true
                                }
                            res.send(result);
                        }
                        });
                    }
                    else if(type == "MACD"){
                        address = 'https://www.alphavantage.co/query?function=macd&symbol='+symbol+'&interval=daily&time_period=10&series_type=close&apikey=ZZPJ8EI5S0CXS8O4';
                        request(address, function (err, response, body) {
                            if (!err&&response.statusCode==200){
                            var json = JSON.parse(body);
                            if (!json["Meta Data"]){
                                var result = {
                                        "error" : true
                                    }
                                res.send(result);
                            }
                            else{
                            var keys = new Array();
                            var sdata = new Array();
                            var ndata = new Array();
                            var hdata = new Array();
                            var dates = new Array();
                            var i = 0;
                            for(var key in json["Technical Analysis: MACD"]){
                                keys[i] = key;
                                i++;
                            }
                            
                            for(var j=0;j < 130;j++){
                                sdata[j] = json["Technical Analysis: MACD"][keys[130-j-1]]["MACD_Signal"]*1;
                                ndata[j] = json["Technical Analysis: MACD"][keys[130-j-1]]["MACD"]*1;
                                hdata[j] = json["Technical Analysis: MACD"][keys[130-j-1]]["MACD_Hist"]*1;
                                dates[j] = keys[130-j-1].substring(5,7)+"/"+keys[130-j-1].substring(8,10);
                            }
                            var result = {
                                "symbol" : symbol,
                                "sdata" : sdata,
                                "ndata" : ndata,
                                "hdata" : hdata,
                                "dates" : dates,
                                "error" : false
                            }
                            res.send(result);
                            }
                            }
                            else{
                            var result = {
                                    "error" : true
                                }
                            res.send(result);
                        }
                        });
                    }
                    else if(type == "HIGHSTOCK"){
                        address = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='+symbol+'&outputsize=full&apikey=ZZPJ8EI5S0CXS8O4';
                        request(address, function (err, response, body) {
                            if (!err&&response.statusCode==200){
                            var json = JSON.parse(body);
                            if (!json["Meta Data"]){
                                var result = {
                                        "error" : true
                                    }
                                res.send(result);
                            }
                            else{
                            var keys = new Array();
                            var value = new Array();
                            var i = 0;
                            for(var key in json["Time Series (Daily)"]){
                                keys[i] = key;
                                i++;
                            }
                            
                            for(var j=0;j < 1000;j++){
                                var temp = new Array();
                                var date = keys[1000-j-1];
                                date = date.split("-");
                                var newDate = date[1]+"/"+date[2]+"/"+date[0];
                                temp[0] = new Date(newDate).getTime();
                                temp[1] = Number(json["Time Series (Daily)"][keys[1000-j-1]]["4. close"]);
                                temp[1] = temp[1].toFixed(2);
                                temp[1] = temp[1].substring(0,5);
                                temp[1] = Number(temp[1]);
                                value[j] = temp;
                            }
                            var result = {
                                "symbol" : symbol,
                                "volume_price" : value,
                                "error" : false
                            }
                            res.send(result);
                            }
                            }
                            else{
                            var result = {
                                    "error" : true
                                }
                            res.send(result);
                            }
                        });
                    }
                    else if(type == "refresh"){
                        address = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol='+symbol+'&interval=1min&apikey=ZZPJ8EI5S0CXS8O4';
                        request(address, function (err, response, body) {
                            if (!err&&response.statusCode==200){
                            var json = JSON.parse(body);
                            if (!json["Meta Data"]){
                                var result = {
                                        "symbol" : symbol,
                                        "error" : true
                                    }
                                res.send(result);
                            }
                            else{
                            var keys = new Array();
                            var ccidata = new Array();
                            var dates = new Array();
                            var i = 0;
                            for(var key in json["Time Series (1min)"]){
                                keys[i] = key;
                                i++;
                            }
                            
                            var change = json["Time Series (1min)"][keys[0]]["4. close"]-json["Time Series (1min)"][keys[1]]["4. close"];
                            var changePercent = 100*(change/json["Time Series (1min)"][keys[0]]["4. close"]);
                            change = change.toFixed(2);
                            changePercent = changePercent.toFixed(2);
                            var close = json["Time Series (1min)"][keys[0]]["4. close"]*1;
                            close = close.toFixed(2);
                            if (change>0){
                                var color = 'green';
                                var img_url = 'http://cs-server.usc.edu:45678/hw/hw8/images/Up.png';
                            }
                            else{
                                var color = 'red';
                                var img_url = 'http://cs-server.usc.edu:45678/hw/hw8/images/Down.png';
                            }
                            var result = {
                                "symbol" : symbol,
                                "price" : close,
                                "change" : change,
                                "changepercent" : changePercent,
                                "color" : color,
                                "img_url" : img_url,
                                "volume" : json["Time Series (1min)"][keys[0]]["5. volume"],
                                "error" : false
                            }
                            res.send(result);
                            }
                            }
                            else{
                            var result = {
                                    "symbol" : symbol,
                                    "error" : true
                                }
                            res.send(result);
                        }
                        });
                    }
                }
            }
            
            
        }
        
    
    }
    
});

app.listen(port, function () {
    console.log('Example app listening on port 3000!');
});



