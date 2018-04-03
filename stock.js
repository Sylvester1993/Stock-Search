
var App = angular.module("App",['ngMaterial','ngAnimate']);



App.controller("SearchCtrl",function($log,$scope,$http,$interval){
    
    $scope.data = {
        input : "",
        message : "",
        favorite_hide : false,
        details_hide : true,
        hidden : false,
        price_hide : false,
        sma_hide : true,
        ema_hide : true,
        stoch_hide : true,
        rsi_hide : true,
        adx_hide : true,
        cci_hide :true,
        bbands_hide : true,
        macd_hide : true,
        current_stock_hide : false,
        hist_charts_hide : true,
        news_feeds_hide : true,
        stock_details_hide : true,
        favorite : false,
        autorefresh : false,
        orderby : ""
        
    };
    $scope.showlist = Array();
    $scope.rawlist = Array();
    $scope.selectedmethod = "Default";
    $scope.selectedorder = "Ascending";
    $scope.method = ["Default","Symbol","Price","Change","Change Percent","Volume"];
    $scope.order = ["Ascending","Descending"];
    
    setInterval(function(){
        $scope.$apply(function(){
            //console.log($scope.method);
            if($scope.selectedmethod=="Default"){
                $scope.data.orderby = "";
            }
            else if(($scope.selectedmethod=="Symbol")&&($scope.selectedorder=="Ascending")){
               $scope.data.orderby = "symbol";
            }
            else if(($scope.selectedmethod=="Symbol")&&($scope.selectedorder=="Descending")){
               $scope.data.orderby = "-symbol";
            }
            else if(($scope.selectedmethod=="Price")&&($scope.selectedorder=="Ascending")){
               $scope.data.orderby = "price";
            }
            else if(($scope.selectedmethod=="Price")&&($scope.selectedorder=="Descending")){
               $scope.data.orderby = "-price";
            }
            else if(($scope.selectedmethod=="Change")&&($scope.selectedorder=="Ascending")){
               $scope.data.orderby = "change";
            }
            else if(($scope.selectedmethod=="Change")&&($scope.selectedorder=="Descending")){
               $scope.data.orderby = "-change";
            }
            else if(($scope.selectedmethod=="Change Percent")&&($scope.selectedorder=="Ascending")){
               $scope.data.orderby = "changepercent";
            }
            else if(($scope.selectedmethod=="Change Percent")&&($scope.selectedorder=="Descending")){
               $scope.data.orderby = "-changepercent";
            }
            else if(($scope.selectedmethod=="Volume")&&($scope.selectedorder=="Ascending")){
               $scope.data.orderby = "volume";
            }
            else if(($scope.selectedmethod=="Volume")&&($scope.selectedorder=="Descending")){
               $scope.data.orderby = "-volume";
            }
        })
    },10)
    
    
    
    /*
    if($scope.method=="Default"){
        $scope.data.orderby = "";
    }
    else if(($scope.method=="Symbol")&&($scope.order=="Ascending")){
       $scope.data.orderby = "symbol";
    }
    else if(($scope.method=="Symbol")&&($scope.order=="Descending")){
       $scope.data.orderby = "-symbol";
    }
    else if(($scope.method=="Price")&&($scope.order=="Ascending")){
       $scope.data.orderby = "price";
    }
    else if(($scope.method=="Price")&&($scope.order=="Descending")){
       $scope.data.orderby = "-price";
    }
    else if(($scope.method=="Change")&&($scope.order=="Ascending")){
       $scope.data.orderby = "change";
    }
    else if(($scope.method=="Change")&&($scope.order=="Descending")){
       $scope.data.orderby = "-change";
    }
    else if(($scope.method=="Change Percent")&&($scope.order=="Ascending")){
       $scope.data.orderby = "changepercent";
    }
    else if(($scope.method=="Change Percent")&&($scope.order=="Descending")){
       $scope.data.orderby = "-changepercent";
    }
    else if(($scope.method=="Volume")&&($scope.order=="Ascending")){
       $scope.data.orderby = "volume";
    }
    else if(($scope.method=="Volume")&&($scope.order=="Descending")){
       $scope.data.orderby = "-volume";
    }
    */
    var count = 0;
    favorite_star = function(){
        if($scope.data.favorite){
            $scope.data.favorite = false;
            $scope.favorite_delete($scope.data.input);
            /*
            for(var i=0;i<$scope.rawlist.length;i++){
                if($scope.rawlist[i].symbol == $scope.data.input){
                    $scope.favorite_delete();
                }
            }
            */
        }
        else{
            collect();
            $scope.data.favorite = true;
            document.getElementById("star_button").innerHTML = '<span class="glyphicon glyphicon-star yellow_star"></span>';
        }
    }
    collect = function(){
        $scope.data.favorite = true;
        if ($scope.data.change>0){
            var color = 'green';
            var img_url = 'http://cs-server.usc.edu:45678/hw/hw8/images/Up.png';
        }
        else{
            var color = 'red';
            var img_url = 'http://cs-server.usc.edu:45678/hw/hw8/images/Down.png';
        }
        var temp1 = {
            symbol : $scope.data.symbol,
            price : $scope.data.last_price,
            change : $scope.data.change,
            changepercent : $scope.data.changePercent,
            volume : $scope.data.volume
        };
        var temp2 = {
            symbol : $scope.data.symbol,
            price : $scope.data.last_price,
            change : $scope.data.change,
            changepercent : $scope.data.changePercent,
            color : color,
            imgurl : img_url,
            volume : $scope.data.volume
            
        };
        $scope.rawlist[count] = temp1;
        $scope.showlist[count] = temp2;
        count++;
        document.getElementById("star_button").innerHTML = '<span class="glyphicon glyphicon-star yellow_star"></span>';
    }
    $scope.searchagain = function(symbol){
        $scope.data.input = symbol;
        
        getquote();
    }
    $scope.favorite_delete = function(symbol){
        var index;
        if(symbol==$scope.data.input){
                    $scope.data.favorite = false;
                    document.getElementById("star_button").innerHTML = '<span class="glyphicon glyphicon-star-empty"></span>';
                }
        for(var i=0;i<$scope.rawlist.length;i++){
            if(symbol==$scope.rawlist[i].symbol){
                index = i;
            }
        }
        $scope.rawlist.splice(index,1);
        $scope.showlist.splice(index,1);
        count--;
        
    }
    $scope.helplist = new Array();
    refresh = function(){
        for (var j=0;j<$scope.rawlist.length;j++){
            $scope.helplist[$scope.rawlist[j].symbol] = j;
        }
        for (var i=0;i<$scope.rawlist.length;i++){
            
            $http.get("/?type=refresh&symbol="+$scope.rawlist[i].symbol).then(function(response){
            if(response.data.error){
                alert(response.data.symbol+" data error!");
            }
            else{
                console.log(response.data.symbol);
                $scope.rawlist[$scope.helplist[response.data.symbol]].symbol = response.data.symbol;
                $scope.rawlist[$scope.helplist[response.data.symbol]].price = response.data.price;
                $scope.rawlist[$scope.helplist[response.data.symbol]].change = response.data.change;
                $scope.rawlist[$scope.helplist[response.data.symbol]].changepercent = response.data.changepercent;
                $scope.rawlist[$scope.helplist[response.data.symbol]].volume = response.data.volume.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                
                $scope.showlist[$scope.helplist[response.data.symbol]].symbol = response.data.symbol;
                $scope.showlist[$scope.helplist[response.data.symbol]].price = response.data.price;
                $scope.showlist[$scope.helplist[response.data.symbol]].change = response.data.change;
                $scope.showlist[$scope.helplist[response.data.symbol]].changepercent = response.data.changepercent;
                $scope.showlist[$scope.helplist[response.data.symbol]].color = response.data.color;
                $scope.showlist[$scope.helplist[response.data.symbol]].imgurl = response.data.img_url;
                $scope.showlist[$scope.helplist[response.data.symbol]].volume = response.data.volume.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                
            }
        });
            
        }
    }
    
    autorefresh = function(){
        if($scope.data.autorefresh){
            $scope.data.autorefresh = false;
            $interval(refresh(),5000);
        }
        else{
            $interval(refresh(),5000,0);
        }
    }
    
    $scope.refresh_disable = function(){
        $scope.$apply(function(){
            if($scope.rawlist.length == 0){
                return true;
            }
            else{
                return false;
            }
        });
        
    }
    /*
    var self = this;
            self.simulateQuery = false;
            self.isDisabled    = false;
            
            // list of states to be displayed
            self.querySearch   = querySearch;
            self.selectedItemChange = selectedItemChange;
            self.searchTextChange   = searchTextChange;
            
            
            function querySearch (query) {
               var res = $http({
                   method : "GET",
                   url : "http://localhost:3000/?type=autocomplete&symbol=" + query
               }).then(function mySuccess(response){
                   return response.data;
               },function errorCallback(response){
                   return response.statusText;
               })
               return res;
            }
            
            function searchTextChange(text) {
               $log.info('Text changed to ' + text);
            }
            
            function selectedItemChange(item) {
               $log.info('Item changed to ' + JSON.stringify(item));
            }
    */
    
    
    $scope.isInput = function(){
        if ($scope.data.input == ""){
            $scope.data.message = "Please enter a stock ticker symbol.";
            return true;
        }
        else{
            $scope.data.message = "";
            return false;
        }
    }
    slide = function(){
        $scope.$apply(function(){
            if ($scope.data.favorite_hide){
                $scope.data.favorite_hide = false;
                $scope.data.details_hide = true;
            }
            else{
                $scope.data.favorite_hide = true;
                $scope.data.details_hide = false;
            }
            
        });
        
    }
    
    getquote = function(){
        $scope.data.favorite = false;
        document.getElementById("star_button").innerHTML = '<span class="glyphicon glyphicon-star-empty"></span>';
        for (var k=0;k<$scope.rawlist.length;k++){
            if ($scope.data.input == $scope.rawlist[k].symbol){
                $scope.data.favorite = true;
                document.getElementById("star_button").innerHTML = '<span class="glyphicon glyphicon-star yellow_star"></span>';
                break;
            }
        }
        $scope.data.favorite_hide = true;
        $scope.data.details_hide = false;
        $scope.data.stock_details_hide = false;
        $http.get("/?type=TIME_SERIES_DAILY&symbol="+$scope.data.input).then(function(response){
            if(response.data.error){
                var html_text = '<div class="alert alert-danger" role="alert">Error! Fail to get Price data.</div>';
                document.getElementById("price").innerHTML = html_text;
            }
            else{
            $scope.data.symbol = response.data.symbol;
            $scope.data.last_price = Number(response.data.lastPrice);
            $scope.data.change = Number(response.data.change);
            $scope.data.changePercent = Number(response.data.changePercent);
            if($scope.data.change>0){
                document.getElementById("changeChangePercent").innerHTML = '<span style="color:green;">'+$scope.data.change+'('+$scope.data.changePercent+'%)</span><img id="arrow" src="http://cs-server.usc.edu:45678/hw/hw8/images/Up.png">';
            }
            else{
                document.getElementById("changeChangePercent").innerHTML = '<span style="color:red;">'+$scope.data.change+'('+$scope.data.changePercent+'%)</span><img id="arrow" src="http://cs-server.usc.edu:45678/hw/hw8/images/Down.png">';
            }
            $scope.data.timestamp = response.data.timeStamp;
            $scope.data.open = Number(response.data.open);
            $scope.data.range = Number(response.data.low) + "-" +Number(response.data.high);
            $scope.data.volume = response.data.volume.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            drawPrice(response.data.pricearray,response.data.volumearray,response.data.dates,response.data.symbol);
            }
        });
        $http.get("/?type=SMA&symbol="+$scope.data.input).then(function(response){
            if(response.data.error){
                var html_text = '';
                document.getElementById("sma").innerHTML = html_text;
            }
            else{
            drawsma(response.data.smadata,response.data.dates,response.data.symbol);
            }
        });
        $http.get("/?type=EMA&symbol="+$scope.data.input).then(function(response){
            if(response.data.error){
                var html_text = '';
                document.getElementById("ema").innerHTML = html_text;
            }
            else{
            drawema(response.data.emadata,response.data.dates,response.data.symbol);
            }
        });
        $http.get("/?type=STOCH&symbol="+$scope.data.input).then(function(response){
            if(response.data.error){
                var html_text = '';
                document.getElementById("stoch").innerHTML = html_text;
            }
            else{
            drawstoch(response.data.slowkdata,response.data.slowddata,response.data.dates,response.data.symbol);
            }
        });
        $http.get("/?type=RSI&symbol="+$scope.data.input).then(function(response){
            if(response.data.error){
                var html_text = '';
                document.getElementById("rsi").innerHTML = html_text;
            }
            else{
            drawrsi(response.data.rsidata,response.data.dates,response.data.symbol);
            }
        });
        $http.get("/?type=ADX&symbol="+$scope.data.input).then(function(response){
            if(response.data.error){
                var html_text = '';
                document.getElementById("adx").innerHTML = html_text;
            }
            else{
            drawadx(response.data.adxdata,response.data.dates,response.data.symbol);
            }
        });
        $http.get("/?type=CCI&symbol="+$scope.data.input).then(function(response){
            if(response.data.error){
                var html_text = '';
                document.getElementById("cci").innerHTML = html_text;
            }
            else{
            drawcci(response.data.ccidata,response.data.dates,response.data.symbol);
            }
        });
        $http.get("/?type=BBANDS&symbol="+$scope.data.input).then(function(response){
           if(response.data.error){
                var html_text = '';
                document.getElementById("bbands").innerHTML = html_text;
            }
            else{ drawbbands(response.data.lowerdata,response.data.upperdata,response.data.middledata,response.data.dates,response.data.symbol);
                }
        });
        $http.get("/?type=MACD&symbol="+$scope.data.input).then(function(response){
            if(response.data.error){
                var html_text = '';
                document.getElementById("macd").innerHTML = html_text;
            }
            else{ 
            drawmacd(response.data.sdata,response.data.ndata,response.data.hdata,response.data.dates,response.data.symbol);
            }
        });
        /*
        $http.get("http://localhost:3000/?type=HIGHSTOCK&symbol="+$scope.data.input).then(function(response){
            
            drawhighstock(response.data.volume_price,response.data.symbol);
        });
        */
    }
    price = function(){
        $scope.data.price_hide = false;
        $scope.data.sma_hide = true;
        $scope.data.ema_hide = true;
        $scope.data.stoch_hide = true;
        $scope.data.rsi_hide = true;
        $scope.data.adx_hide = true;
        $scope.data.cci_hide = true;
        $scope.data.bbands_hide = true;
        $scope.data.macd_hide = true;
        $http.get("/?type=TIME_SERIES_DAILY&symbol="+$scope.data.input).then(function(response){
            if(response.data.error){
                var html_text = '<div class="alert alert-danger" role="alert">Error! Fail to get Price data.</div>';
                document.getElementById("price").innerHTML = html_text;
            }
            else{
            $scope.data.symbol = response.data.symbol;
            $scope.data.last_price = Number(response.data.lastPrice);
            $scope.data.change = Number(response.data.change);
            $scope.data.changePercent = Number(response.data.changePercent);
            if($scope.data.change>0){
                document.getElementById("changeChangePercent").innerHTML = '<span style="color:green;">'+$scope.data.change+'('+$scope.data.changePercent+'%)</span><img id="arrow" src="http://cs-server.usc.edu:45678/hw/hw8/images/Up.png">';
            }
            else{
                document.getElementById("changeChangePercent").innerHTML = '<span style="color:red;">'+$scope.data.change+'('+$scope.data.changePercent+'%)</span><img id="arrow" src="http://cs-server.usc.edu:45678/hw/hw8/images/Down.png">';
            }
            $scope.data.timestamp = response.data.timeStamp;
            $scope.data.open = Number(response.data.open);
            $scope.data.range = Number(response.data.low) + "-" +Number(response.data.high);
            $scope.data.volume = response.data.volume.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            drawPrice(response.data.pricearray,response.data.volumearray,response.data.dates,response.data.symbol);
            }
        });
    }
    sma = function(){
        $scope.data.price_hide = true;
        $scope.data.sma_hide = false;
        $scope.data.ema_hide = true;
        $scope.data.stoch_hide = true;
        $scope.data.rsi_hide = true;
        $scope.data.adx_hide = true;
        $scope.data.cci_hide = true;
        $scope.data.bbands_hide = true;
        $scope.data.macd_hide = true;
        $http.get("/?type=SMA&symbol="+$scope.data.input).then(function(response){
            if(response.data.error){
                var html_text = '<div class="alert alert-danger" role="alert">Error! Fail to get SMA data.</div>';
                document.getElementById("sma").innerHTML = html_text;
            }
            else{ 
            drawsma(response.data.smadata,response.data.dates,response.data.symbol);
            }
        });
    }
    ema = function(){
        $scope.data.price_hide = true;
        $scope.data.sma_hide = true;
        $scope.data.ema_hide = false;
        $scope.data.stoch_hide = true;
        $scope.data.rsi_hide = true;
        $scope.data.adx_hide = true;
        $scope.data.cci_hide = true;
        $scope.data.bbands_hide = true;
        $scope.data.macd_hide = true;
        $http.get("/?type=EMA&symbol="+$scope.data.input).then(function(response){
            if(response.data.error){
                var html_text = '<div class="alert alert-danger" role="alert">Error! Fail to get EMA data.</div>';
                document.getElementById("ema").innerHTML = html_text;
            }
            else{ 
            drawema(response.data.emadata,response.data.dates,response.data.symbol);
            }
        });
    }
    stoch = function(){
        $scope.data.price_hide = true;
        $scope.data.sma_hide = true;
        $scope.data.ema_hide = true;
        $scope.data.stoch_hide = false;
        $scope.data.rsi_hide = true;
        $scope.data.adx_hide = true;
        $scope.data.cci_hide = true;
        $scope.data.bbands_hide = true;
        $scope.data.macd_hide = true;
        $http.get("/?type=STOCH&symbol="+$scope.data.input).then(function(response){
            if(response.data.error){
                var html_text = '<div class="alert alert-danger" role="alert">Error! Fail to get STOCH data.</div>';
                document.getElementById("stoch").innerHTML = html_text;
            }
            else{ 
            drawstoch(response.data.slowkdata,response.data.slowddata,response.data.dates,response.data.symbol);
            }
        });
    }
    rsi = function(){
        $scope.data.price_hide = true;
        $scope.data.sma_hide = true;
        $scope.data.ema_hide = true;
        $scope.data.stoch_hide = true;
        $scope.data.rsi_hide = false;
        $scope.data.adx_hide = true;
        $scope.data.cci_hide = true;
        $scope.data.bbands_hide = true;
        $scope.data.macd_hide = true;
        $http.get("/?type=RSI&symbol="+$scope.data.input).then(function(response){
            if(response.data.error){
                var html_text = '<div class="alert alert-danger" role="alert">Error! Fail to get RSI data.</div>';
                document.getElementById("rsi").innerHTML = html_text;
            }
            else{ 
            drawrsi(response.data.rsidata,response.data.dates,response.data.symbol);
            }
        });
    }
    adx = function(){
        $scope.data.price_hide = true;
        $scope.data.sma_hide = true;
        $scope.data.ema_hide = true;
        $scope.data.stoch_hide = true;
        $scope.data.rsi_hide = true;
        $scope.data.adx_hide = false;
        $scope.data.cci_hide = true;
        $scope.data.bbands_hide = true;
        $scope.data.macd_hide = true;
        $http.get("/?type=ADX&symbol="+$scope.data.input).then(function(response){
            if(response.data.error){
                var html_text = '<div class="alert alert-danger" role="alert">Error! Fail to get ADX data.</div>';
                document.getElementById("adx").innerHTML = html_text;
            }
            else{ 
            drawadx(response.data.adxdata,response.data.dates,response.data.symbol);
            }
        });
    }
    cci = function(){
        $scope.data.price_hide = true;
        $scope.data.sma_hide = true;
        $scope.data.ema_hide = true;
        $scope.data.stoch_hide = true;
        $scope.data.rsi_hide = true;
        $scope.data.adx_hide = true;
        $scope.data.cci_hide = false;
        $scope.data.bbands_hide = true;
        $scope.data.macd_hide = true;
        $http.get("/?type=CCI&symbol="+$scope.data.input).then(function(response){
            if(response.data.error){
                var html_text = '<div class="alert alert-danger" role="alert">Error! Fail to get CCI data.</div>';
                document.getElementById("cci").innerHTML = html_text;
            }
            else{ 
            drawcci(response.data.ccidata,response.data.dates,response.data.symbol);
            }
        });
    }
    bbands = function(){
        $scope.data.price_hide = true;
        $scope.data.sma_hide = true;
        $scope.data.ema_hide = true;
        $scope.data.stoch_hide = true;
        $scope.data.rsi_hide = true;
        $scope.data.adx_hide = true;
        $scope.data.cci_hide = true;
        $scope.data.bbands_hide = false;
        $scope.data.macd_hide = true;
        $http.get("/?type=BBANDS&symbol="+$scope.data.input).then(function(response){
            
           if(response.data.error){
                var html_text = '<div class="alert alert-danger" role="alert">Error! Fail to get BBANDS data.</div>';
                document.getElementById("bbands").innerHTML = html_text;
            }
            else{  drawbbands(response.data.lowerdata,response.data.upperdata,response.data.middledata,response.data.dates,response.data.symbol);
                }
        });
    }
    macd = function(){
        $scope.data.price_hide = true;
        $scope.data.sma_hide = true;
        $scope.data.ema_hide = true;
        $scope.data.stoch_hide = true;
        $scope.data.rsi_hide = true;
        $scope.data.adx_hide = true;
        $scope.data.cci_hide = true;
        $scope.data.bbands_hide = true;
        $scope.data.macd_hide = false;
        $http.get("/?type=MACD&symbol="+$scope.data.input).then(function(response){
            if(response.data.error){
                var html_text = '<div class="alert alert-danger" role="alert">Error! Fail to get MACD data.</div>';
                document.getElementById("macd").innerHTML = html_text;
            }
            else{ 
            drawmacd(response.data.sdata,response.data.ndata,response.data.hdata,response.data.dates,response.data.symbol);
            }
        });
    }
    highstock = function(){
        $scope.data.current_stock_hide = true;
        $scope.data.news_feeds_hide = true;
        $scope.data.hist_charts_hide = false;
        $http.get("/?type=HIGHSTOCK&symbol="+$scope.data.input).then(function(response){
            if(response.data.error){
                var html_text = '<div class="alert alert-danger" role="alert">Error! Fail to get historical charts data.</div>';
                document.getElementById("highstock").innerHTML = html_text;
            }
            else{ 
            drawhighstock(response.data.volume_price,response.data.symbol);
            }
        });
    }
    newsfeeds = function(){
        $scope.data.current_stock_hide = true;
        $scope.data.news_feeds_hide = false;
        $scope.data.hist_charts_hide = true;
        $http.get("/?type=news&symbol="+$scope.data.input).then(function(response){
            if(response.data.error){
                var html_err_text = '<div class="alert alert-danger" role="alert">Error! Fail to get news feeds data.</div>';
                document.getElementById("news_feeds").innerHTML = html_err_text;
            }
            else{ 
            var html_text = '<div class="well"><div id="news_title"><a href="'+response.data.item1.link+'" target="_blank"><b>'+response.data.item1.title+'</b></a></div><br><b>Author: '+response.data.item1.author+'</b><br><b>Date: '+response.data.item1.date+'</b></div>';
            html_text += '<div class="well"><div id="news_title"><a href="'+response.data.item2.link+'" target="_blank"><b>'+response.data.item2.title+'</b></a></div><br><b>Author: '+response.data.item2.author+'</b><br><b>Date: '+response.data.item2.date+'</b></div>';
            html_text += '<div class="well"><div id="news_title"><a href="'+response.data.item3.link+'" target="_blank"><b>'+response.data.item3.title+'</b></a></div><br><b>Author: '+response.data.item3.author+'</b><br><b>Date: '+response.data.item3.date+'</b></div>';
            html_text += '<div class="well"><div id="news_title"><a href="'+response.data.item4.link+'" target="_blank"><b>'+response.data.item4.title+'</b></a></div><br><b>Author: '+response.data.item4.author+'</b><br><b>Date: '+response.data.item4.date+'</b></div>';
            html_text += '<div class="well"><div id="news_title"><a href="'+response.data.item5.link+'" target="_blank"><b>'+response.data.item5.title+'</b></a></div><br><b>Author: '+response.data.item5.author+'</b><br><b>Date: '+response.data.item5.date+'</b></div>';
            document.getElementById('news_feeds').innerHTML = html_text;
            }
        });
    }
    currentstock = function(){
        $scope.data.current_stock_hide = false;
        $scope.data.news_feeds_hide = true;
        $scope.data.hist_charts_hide = true;
    }
    facebookshare = function(){
    window.fbAsyncInit = function() {
                FB.init({
                  appId            : '301121523721385',
                  autoLogAppEvents : true,
                  xfbml            : true,
                  version          : 'v2.11'
                });
        FB.AppEvents.logPageView();
              };
    (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
        
    var share;
    var activeTab = $('.nav-tabs .active> a').attr('href');
    console.log(activeTab);
    if(activeTab=='#price'){share = priceChart;}
    else if(activeTab=='#sma'){share = smaChart;}
    else if(activeTab=='#ema'){share = emaChart;}
    else if(activeTab=='#stoch'){share = stochChart;}
    else if(activeTab=='#rsi'){share = rsiChart;}
    else if(activeTab=='#adx'){share = adxChart;}
    else if(activeTab=='#cci'){share = cciChart;}
    else if(activeTab=='#bbands'){share = bbandsChart;}
    else if(activeTab=='#macd'){share = macdChart;}
    var exportUrl = share.exporting.url;
    var info = {};
    console.log(share);
    info.options = JSON.stringify(share);
    info.type = 'image/png';
    info.async = true;
    $http({
        method : 'post',
        url : exportUrl,
        data : info
    }).then(function (response){
        exportUrl = exportUrl + response.data;
        console.log(exportUrl);
        FB.ui({
            app_id: '301121523721385',
            method: 'feed',
            picture: exportUrl,
        }, (response)=>{
            if(response&&!response.error_message){
                alert('Posted Successfully');
            }
            else{
                alert('Not Posted');
            }
        });
    });
    
}
});

var priceChart;
var smaChart;
var emaChart;
var stochChart;
var rsiChart;
var adxChart;
var cciChart;
var bbandsChart;
var macdChart;

function drawPrice(pricedata,volume,dates,symbol) {
              Highcharts.chart('price', {
                chart: {
                    zoomType: 'xy'
                },
                title: {
                    text: symbol+' Stock Price and Volume'
                },
                subtitle: {
                    useHTML: true,
                    text: "<a href='https://www.alphavantage.co/' target='_blank'>Source: Alpha Vantage</a>"
                },
                xAxis: [{
                    categories: dates,
                    crosshair: true,
                    tickInterval: 5
                }],
                plotOptions: {
                    area: {
                        fillOpacity: 0.9,
                        marker: {
                            enable: false,
                            states: {
                                hover: {
                                    enabled: true,
                                    radius: 5
                                }
                            }
                        },
                        shadows: false,
                        threshold: null
                    }

                },
                yAxis: [
                    { // Primary yAxis
                        labels: {
                            format: '{value}',
                            style: {
                                color: Highcharts.getOptions().colors[1]
                            }
                        },
                        title: {
                            text: 'Stock Price',
                            style: {
                                color: Highcharts.getOptions().colors[1]
                            }
                        }
                    },
                    { // Secondary yAxis
                        title: {
                            text: 'Volume',
                            style: {
                                color: Highcharts.getOptions().colors[1]
                            }
                        },
                        labels: {
                            format: '{value}M',
                            style: {
                                color: Highcharts.getOptions().colors[1]
                            }
                        },
                        opposite: true
                    }
                ],
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    x: 0,
                    verticalAlign: 'bottom',
                    y: 0,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
                },
                plotOptions: {
                    area: {
                        fillOpacity: 0.2,
                        marker: {
                            enabled: false
                        }
                    }
                },
                series: [
                    {
                        name: 'Price',
                        type: 'area',
                        color: '#08088A',
                        data: pricedata,
                        tooltip: {
                            valueSuffix: ''
                        }
                    },
                    {
                        name: 'Volume',
                        type: 'column',
                        color: '#DF0101',
                        yAxis: 1,
                        data: volume,
                        tooltip: {
                            valueSuffix: ' M'
                        }

                    }

                ]
            });
    priceChart = {
    exporting: {
        url: 'http://export.highcharts.com/'
    },
     chart: {
                    zoomType: 'xy'
                },
                title: {
                    text: symbol+' Stock Price and Volume'
                },
                subtitle: {
                    useHTML: true,
                    text: "<a href='https://www.alphavantage.co/' target='_blank'>Source: Alpha Vantage</a>"
                },
                xAxis: [{
                    categories: dates,
                    crosshair: true,
                    tickInterval: 5
                }],
                plotOptions: {
                    area: {
                        fillOpacity: 0.9,
                        marker: {
                            enable: false,
                            states: {
                                hover: {
                                    enabled: true,
                                    radius: 5
                                }
                            }
                        },
                        shadows: false,
                        threshold: null
                    }

                },
                yAxis: [
                    { // Primary yAxis
                        labels: {
                            format: '{value}',
                            style: {
                                color: Highcharts.getOptions().colors[1]
                            }
                        },
                        title: {
                            text: 'Stock Price',
                            style: {
                                color: Highcharts.getOptions().colors[1]
                            }
                        }
                    },
                    { // Secondary yAxis
                        title: {
                            text: 'Volume',
                            style: {
                                color: Highcharts.getOptions().colors[1]
                            }
                        },
                        labels: {
                            format: '{value}M',
                            style: {
                                color: Highcharts.getOptions().colors[1]
                            }
                        },
                        opposite: true
                    }
                ],
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    x: 0,
                    verticalAlign: 'bottom',
                    y: 0,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
                },
                plotOptions: {
                    area: {
                        fillOpacity: 0.2,
                        marker: {
                            enabled: false
                        }
                    }
                },
                series: [
                    {
                        name: 'Price',
                        type: 'area',
                        color: '#08088A',
                        data: pricedata,
                        tooltip: {
                            valueSuffix: ''
                        }
                    },
                    {
                        name: 'Volume',
                        type: 'column',
                        color: '#DF0101',
                        yAxis: 1,
                        data: volume,
                        tooltip: {
                            valueSuffix: ' M'
                        }

                    }

                ]
    
};
        }

function drawsma(smadata,dates,symbol){
     Highcharts.chart('sma', {
                chart: {
                    zoomType: 'xy'
                },
                title: {
                    text: 'Simple Moving Average (SMA)'
                },

                subtitle: {
                    useHTML: true,
                    text: "<a href='https://www.alphavantage.co/' target='_blank'>Source: Alpha Vantage</a>"
                },
                xAxis: [{
                    categories: dates,
                    tickInterval: 5,
                    crosshair: true
                }],
                yAxis: {
                    labels: {
                        format: '{value}',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    },
                    title: {
                        text: 'SMA'
                    }
                },
                legend: {
                    layout: 'vertical',
                    align: 'center',
                    verticalAlign: 'bottom'
                },
                plotOptions: {
                    line: {
                        lineWidth: 2
                    }
                },
                series: [{
                    name: symbol,
                    color: '#58ACFA',
                    threshold: null,
                    data: smadata
                }
                ]
            });
    smaChart = {
     exporting: {
        url: 'http://export.highcharts.com/'
    },
    chart: {
                    zoomType: 'xy'
                },
                title: {
                    text: 'Simple Moving Average (SMA)'
                },

                subtitle: {
                    useHTML: true,
                    text: "<a href='https://www.alphavantage.co/' target='_blank'>Source: Alpha Vantage</a>"
                },
                xAxis: [{
                    categories: dates,
                    tickInterval: 5,
                    crosshair: true
                }],
                yAxis: {
                    labels: {
                        format: '{value}',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    },
                    title: {
                        text: 'SMA'
                    }
                },
                legend: {
                    layout: 'vertical',
                    align: 'center',
                    verticalAlign: 'bottom'
                },
                plotOptions: {
                    line: {
                        lineWidth: 2
                    }
                },
                series: [{
                    name: symbol,
                    color: '#58ACFA',
                    threshold: null,
                    data: smadata
                }
                ]
};
}

function drawema(emadata,dates,symbol){
     Highcharts.chart('ema', {
                chart: {
                    zoomType: 'xy'
                },
                title: {
                    text: 'Exponential Moving Average (EMA)'
                },

                subtitle: {
                    useHTML: true,
                    text: "<a href='https://www.alphavantage.co/' target='_blank'>Source: Alpha Vantage</a>"
                },
                xAxis: [{
                    categories: dates,
                    tickInterval: 5,
                    crosshair: true
                }],
                yAxis: {
                    labels: {
                        format: '{value}',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    },
                    title: {
                        text: 'EMA'
                    }
                },
                legend: {
                    layout: 'vertical',
                    align: 'center',
                    verticalAlign: 'bottom'
                },
                plotOptions: {
                    line: {
                        lineWidth: 2
                    }
                },
                series: [{
                    name: symbol,
                    color: '#58ACFA',
                    threshold: null,
                    data: emadata
                }
                ]
            });
    emaChart = {
     exporting: {
        url: 'http://export.highcharts.com/'
    },
    chart: {
                    zoomType: 'xy'
                },
                title: {
                    text: 'Exponential Moving Average (EMA)'
                },

                subtitle: {
                    useHTML: true,
                    text: "<a href='https://www.alphavantage.co/' target='_blank'>Source: Alpha Vantage</a>"
                },
                xAxis: [{
                    categories: dates,
                    tickInterval: 5,
                    crosshair: true
                }],
                yAxis: {
                    labels: {
                        format: '{value}',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    },
                    title: {
                        text: 'EMA'
                    }
                },
                legend: {
                    layout: 'vertical',
                    align: 'center',
                    verticalAlign: 'bottom'
                },
                plotOptions: {
                    line: {
                        lineWidth: 2
                    }
                },
                series: [{
                    name: symbol,
                    color: '#58ACFA',
                    threshold: null,
                    data: emadata
                }
                ]
};
    
}

function drawstoch(slowkdata,slowddata,dates,symbol){
     Highcharts.chart('stoch', {
                chart: {
                    zoomType: 'xy'
                },
                title: {
                    text: 'Stochastic (STOCH)'
                },

                subtitle: {
                    useHTML: true,
                    text: "<a href='https://www.alphavantage.co/' target='_blank'>Source: Alpha Vantage</a>"
                },
                xAxis: [{
                    categories: dates,
                    tickInterval: 5,
                    crosshair: true
                }],
                yAxis: {
                    labels: {
                        format: '{value}',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    },
                    title: {
                        text: 'STOCH'
                    }
                },
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom'
                },
                plotOptions: {
                    line: {
                        lineWidth: 2
                    }
                },
                series: [{
                    name: symbol + ' SlowK',
                    color: '#FF4000',
                    threshold: null,
                    data: slowkdata
                }, {
                    name: symbol + ' SlowD',
                    threshold: null,
                    data: slowddata
                }
                ]
            });
    stochChart = {
     exporting: {
        url: 'http://export.highcharts.com/'
    },
    chart: {
                    zoomType: 'xy'
                },
                title: {
                    text: 'Stochastic (STOCH)'
                },

                subtitle: {
                    useHTML: true,
                    text: "<a href='https://www.alphavantage.co/' target='_blank'>Source: Alpha Vantage</a>"
                },
                xAxis: [{
                    categories: dates,
                    tickInterval: 5,
                    crosshair: true
                }],
                yAxis: {
                    labels: {
                        format: '{value}',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    },
                    title: {
                        text: 'STOCH'
                    }
                },
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom'
                },
                plotOptions: {
                    line: {
                        lineWidth: 2
                    }
                },
                series: [{
                    name: symbol + ' SlowK',
                    color: '#FF4000',
                    threshold: null,
                    data: slowkdata
                }, {
                    name: symbol + ' SlowD',
                    threshold: null,
                    data: slowddata
                }
                ]
};
}

function drawrsi(rsidata,dates,symbol){
     Highcharts.chart('rsi', {
                chart: {
                    zoomType: 'xy'
                },
                title: {
                    text: 'Relative Strength Index (RSI)'
                },

                subtitle: {
                    useHTML: true,
                    text: "<a href='https://www.alphavantage.co/' target='_blank'>Source: Alpha Vantage</a>"
                },
                xAxis: [{
                    categories: dates,
                    tickInterval: 5,
                    crosshair: true
                }],
                yAxis: {
                    labels: {
                        format: '{value}',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    },
                    title: {
                        text: 'RSI'
                    }
                },
                legend: {
                    layout: 'vertical',
                    align: 'center',
                    verticalAlign: 'bottom'
                },
                plotOptions: {
                    line: {
                        lineWidth: 2
                    }
                },
                series: [{
                    name: symbol,
                    color: '#58ACFA',
                    threshold: null,
                    data: rsidata
                }
                ]
            });
    rsiChart = {
     exporting: {
        url: 'http://export.highcharts.com/'
    },
    chart: {
                    zoomType: 'xy'
                },
                title: {
                    text: 'Relative Strength Index (RSI)'
                },

                subtitle: {
                    useHTML: true,
                    text: "<a href='https://www.alphavantage.co/' target='_blank'>Source: Alpha Vantage</a>"
                },
                xAxis: [{
                    categories: dates,
                    tickInterval: 5,
                    crosshair: true
                }],
                yAxis: {
                    labels: {
                        format: '{value}',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    },
                    title: {
                        text: 'RSI'
                    }
                },
                legend: {
                    layout: 'vertical',
                    align: 'center',
                    verticalAlign: 'bottom'
                },
                plotOptions: {
                    line: {
                        lineWidth: 2
                    }
                },
                series: [{
                    name: symbol,
                    color: '#58ACFA',
                    threshold: null,
                    data: rsidata
                }
                ]
};
}

function drawadx(adxdata,dates,symbol){
     Highcharts.chart('adx', {
                chart: {
                    zoomType: 'xy'
                },
                title: {
                    text: 'Average Directional Movement Index (ADX)'
                },

                subtitle: {
                    useHTML: true,
                    text: "<a href='https://www.alphavantage.co/' target='_blank'>Source: Alpha Vantage</a>"
                },
                xAxis: [{
                    categories: dates,
                    tickInterval: 5,
                    crosshair: true
                }],
                yAxis: {
                    labels: {
                        format: '{value}',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    },
                    title: {
                        text: 'ADX'
                    }
                },
                legend: {
                    layout: 'vertical',
                    align: 'center',
                    verticalAlign: 'bottom'
                },
                plotOptions: {
                    line: {
                        lineWidth: 2
                    }
                },
                series: [{
                    name: symbol,
                    color: '#58ACFA',
                    threshold: null,
                    data: adxdata
                }
                ]
            });
    adxChart = {
     exporting: {
        url: 'http://export.highcharts.com/'
    },
    chart: {
                    zoomType: 'xy'
                },
                title: {
                    text: 'Average Directional Movement Index (ADX)'
                },

                subtitle: {
                    useHTML: true,
                    text: "<a href='https://www.alphavantage.co/' target='_blank'>Source: Alpha Vantage</a>"
                },
                xAxis: [{
                    categories: dates,
                    tickInterval: 5,
                    crosshair: true
                }],
                yAxis: {
                    labels: {
                        format: '{value}',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    },
                    title: {
                        text: 'ADX'
                    }
                },
                legend: {
                    layout: 'vertical',
                    align: 'center',
                    verticalAlign: 'bottom'
                },
                plotOptions: {
                    line: {
                        lineWidth: 2
                    }
                },
                series: [{
                    name: symbol,
                    color: '#58ACFA',
                    threshold: null,
                    data: adxdata
                }
                ]
};
}

function drawcci(ccidata,dates,symbol){
     Highcharts.chart('cci', {
                chart: {
                    zoomType: 'xy'
                },
                title: {
                    text: 'Commodity Channel Index (CCI)'
                },

                subtitle: {
                    useHTML: true,
                    text: "<a href='https://www.alphavantage.co/' target='_blank'>Source: Alpha Vantage</a>"
                },
                xAxis: [{
                    categories: dates,
                    tickInterval: 5,
                    crosshair: true
                }],
                yAxis: {
                    labels: {
                        format: '{value}',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    },
                    title: {
                        text: 'CCI'
                    }
                },
                legend: {
                    layout: 'vertical',
                    align: 'center',
                    verticalAlign: 'bottom'
                },
                plotOptions: {
                    line: {
                        lineWidth: 2
                    }
                },
                series: [{
                    name: symbol,
                    color: '#58ACFA',
                    threshold: null,
                    data: ccidata
                }
                ]
            });
    cciChart = {
     exporting: {
        url: 'http://export.highcharts.com/'
    },
    chart: {
                    zoomType: 'xy'
                },
                title: {
                    text: 'Commodity Channel Index (CCI)'
                },

                subtitle: {
                    useHTML: true,
                    text: "<a href='https://www.alphavantage.co/' target='_blank'>Source: Alpha Vantage</a>"
                },
                xAxis: [{
                    categories: dates,
                    tickInterval: 5,
                    crosshair: true
                }],
                yAxis: {
                    labels: {
                        format: '{value}',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    },
                    title: {
                        text: 'CCI'
                    }
                },
                legend: {
                    layout: 'vertical',
                    align: 'center',
                    verticalAlign: 'bottom'
                },
                plotOptions: {
                    line: {
                        lineWidth: 2
                    }
                },
                series: [{
                    name: symbol,
                    color: '#58ACFA',
                    threshold: null,
                    data: ccidata
                }
                ]
};
}

function drawbbands(lowerdata,upperdata,middledata,dates,symbol){
     Highcharts.chart('bbands', {
                chart: {
                    zoomType: 'xy'
                },
                title: {
                    text: 'Bollinger Bands (BBANDS)'
                },

                subtitle: {
                    useHTML: true,
                    text: "<a href='https://www.alphavantage.co/' target='_blank'>Source: Alpha Vantage</a>"
                },
                xAxis: [{
                    categories: dates,
                    tickInterval: 5,
                    crosshair: true
                }],
                yAxis: {
                    labels: {
                        format: '{value}',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    },
                    title: {
                        text: 'BBANDS'
                    }
                },
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom'
                },
                plotOptions: {
                    line: {
                        lineWidth: 2
                    }
                },
                series: [{
                    name: symbol + ' Real Middle Band',
                    color: '#58ACFA',
                    threshold: null,
                    data: middledata
                }, {
                    name: symbol + ' Real Upper Band',
                    color: '#000000',
                    threshold: null,
                    data: upperdata
                }, {
                    name: symbol + ' Real Lower Band',
                    color: '#27e70c',
                    threshold: null,
                    data: lowerdata
                }
                ]
            });
    bbandsChart = {
     exporting: {
        url: 'http://export.highcharts.com/'
    },
    chart: {
                    zoomType: 'xy'
                },
                title: {
                    text: 'Bollinger Bands (BBANDS)'
                },

                subtitle: {
                    useHTML: true,
                    text: "<a href='https://www.alphavantage.co/' target='_blank'>Source: Alpha Vantage</a>"
                },
                xAxis: [{
                    categories: dates,
                    tickInterval: 5,
                    crosshair: true
                }],
                yAxis: {
                    labels: {
                        format: '{value}',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    },
                    title: {
                        text: 'BBANDS'
                    }
                },
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom'
                },
                plotOptions: {
                    line: {
                        lineWidth: 2
                    }
                },
                series: [{
                    name: symbol + ' Real Middle Band',
                    color: '#58ACFA',
                    threshold: null,
                    data: middledata
                }, {
                    name: symbol + ' Real Upper Band',
                    color: '#000000',
                    threshold: null,
                    data: upperdata
                }, {
                    name: symbol + ' Real Lower Band',
                    color: '#27e70c',
                    threshold: null,
                    data: lowerdata
                }
                ]
};
}

function drawmacd(sdata,ndata,hdata,dates,symbol){
     Highcharts.chart('macd', {
                chart: {
                    zoomType: 'xy'
                },
                title: {
                    text: 'Moving Average Convergence/Divergence (MACD)'
                },

                subtitle: {
                    useHTML: true,
                    text: "<a href='https://www.alphavantage.co/' target='_blank'>Source: Alpha Vantage</a>"
                },
                xAxis: [{
                    categories: dates,
                    tickInterval: 5,
                    crosshair: true
                }],
                yAxis: {
                    labels: {
                        format: '{value}',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    },
                    title: {
                        text: 'MACD'
                    }
                },
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom'
                },
                plotOptions: {
                    line: {
                        lineWidth: 2
                    }
                },
                series: [{
                    name: symbol + ' MACD Signal',
                    color: '#58ACFA',
                    threshold: null,
                    data: sdata
                }, {
                    name: symbol + ' MACD',
                    color: '#000000',
                    threshold: null,
                    data: ndata
                }, {
                    name: symbol + ' MACD Hist',
                    color: '#27e70c',
                    threshold: null,
                    data: hdata
                }
                ]
            });
    macdChart = {
     exporting: {
        url: 'http://export.highcharts.com/'
    },
    chart: {
                    zoomType: 'xy'
                },
                title: {
                    text: 'Moving Average Convergence/Divergence (MACD)'
                },

                subtitle: {
                    useHTML: true,
                    text: "<a href='https://www.alphavantage.co/' target='_blank'>Source: Alpha Vantage</a>"
                },
                xAxis: [{
                    categories: dates,
                    tickInterval: 5,
                    crosshair: true
                }],
                yAxis: {
                    labels: {
                        format: '{value}',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    },
                    title: {
                        text: 'MACD'
                    }
                },
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom'
                },
                plotOptions: {
                    line: {
                        lineWidth: 2
                    }
                },
                series: [{
                    name: symbol + ' MACD Signal',
                    color: '#58ACFA',
                    threshold: null,
                    data: sdata
                }, {
                    name: symbol + ' MACD',
                    color: '#000000',
                    threshold: null,
                    data: ndata
                }, {
                    name: symbol + ' MACD Hist',
                    color: '#27e70c',
                    threshold: null,
                    data: hdata
                }
                ]
};
}

function drawhighstock(value,symbol){
    Highcharts.stockChart('highstock', {

        
        title: {
            text: symbol+' Stock Value'
        },

        subtitle: {
            useHTML: true,
            text: "<a href='https://www.alphavantage.co/' target='_blank'>Source: Alpha Vantage</a>"
        },

        rangeSelector: {
            selected: 1
        },

        series: [{
            name: symbol,
            data: value,
            type: 'area',
            threshold: null,
            tooltip: {
                valueDecimals: 2
            }
        }],

        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    
                    subtitle: {
                        text: null
                    },
                    navigator: {
                        enabled: false
                    }
                }
            }]
        }
    });
}



    
    
    
    



