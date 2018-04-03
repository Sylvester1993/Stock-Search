<html>
<head>

    <meta charset="UTF-8">
    <title>Stock Search with Data APIs</title>
    <style>
        #search_box {
            width: 400px;
            height: 180px;
            border: 2px solid #ccd1d1;
            background: #eaeded;
            position: relative;
            left:35%;
            padding-left: 6px;
            margin-bottom: 10px;
        }
        #stock_search{
            text-align: center;
            font-size: 37px;
        }
        #gray_line{
            background-color: #ccd1d1;
            width: 380px;
            height: 1px;
            margin-bottom: 20px;
            position: relative;
            left:1%;
        }
        #input_box{
            width: 150px;
            height:25px;
            border:2px solid #ccd1d1;
            margin-bottom: 5px;
            position: relative;
            bottom: 5%;
        }
        #buttons{
            position: relative;
            left:48%;
            margin-bottom: 5px;
        }
        table{
            font-family: Arial;
            border:2px solid #ccd1d1;
            width:100%;
            height: auto;
            margin-bottom: 10px;
        }
        th{
            border:1px solid #ccd1d1;
            text-align: left;
            background: #eaeded;
            width:30%;
            padding-top: 3px;
            padding-bottom: 3px;
        }
        td{
            border:1px solid #ccd1d1;
            background: #f8f9f9;
            padding-top: 3px;
            padding-bottom: 3px;
        }
        #table_data{
            text-align: center;
        }
        #arrow_img{
            height: 15px;
            width: 15px;
        }
        #plot_link{
            margin-left: 10px;
            margin-right: 10px;
        }
        #hide_show{
            position: relative;
            height:50px;
            width:200px;
            margin: auto;
            color: #bdbdc2;
        }
        #gray_arrow{
            position: relative;
            left:30%;
            width: 35px;
            height: 15px;
        }
        #newsTable{
            margin-top: 20px;
            width:100%;
        }

    </style>
</head>
<body>
    <?php
        $stock_ticker_symbol = "";
    ?>
    <div id="search_box">
        <div id="stock_search"><I>Stock Search</I></div>
        <div id="gray_line"></div>
        <form id="myForm" onsubmit="return validateForm()" method="post" action="stock.php">
            Enter Stock Ticker Symbol:*<input type="text" id="input_box" name="name" value="<?php
            if(isset($_POST["name"]))
            {
                echo $_POST["name"];
            }?>">
            <br/>
            <?php
                if ($_SERVER["REQUEST_METHOD"] == "POST"){
                    $stock_ticker_symbol = $_POST["name"];
                }
            ?>
            <div id="buttons">
                <button type="submit"  value="Submit">Search</button>
                <button type="reset"  value="Reset" onclick="divRemove();formReset();" >Clear</button>
            </div>
            <I>* - Mandatory fields.</I>
        </form>
    </div>
    <?php
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $Daily_Time_Series_Data_Json_url = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" . $stock_ticker_symbol . "&apikey=ZZPJ8EI5S0CXS8O4";

            $Daily_Time_Series_Data_Json = file_get_contents($Daily_Time_Series_Data_Json_url);
            $Daily_Time_Series_Data = json_decode($Daily_Time_Series_Data_Json, true);
            if (key($Daily_Time_Series_Data) == "Error Message"){
                $html_error = "<table><tr><th>Error</th><td>Error:NO recorded has been found, please enter a valid symbol</td></tr></table>";
                echo $html_error;
            }
            else{
    $Dates = array_keys($Daily_Time_Series_Data['Time Series (Daily)']);
    $html_text_table = "<table cellspacing='0' cellpadding='0'><tr><th>Stock Ticker Symbol</th><td id='table_data'>" . $Daily_Time_Series_Data['Meta Data']['2. Symbol'] . "</td></tr>
                                   <tr><th>Close</th><td id='table_data'>" . $Daily_Time_Series_Data['Time Series (Daily)'][$Dates[0]]['4. close'] . "</td></tr>
                                   <tr><th>Open</th><td id='table_data'>" . $Daily_Time_Series_Data['Time Series (Daily)'][$Dates[0]]['1. open'] . "</td></tr>
                                   <tr><th>Previous Close</th><td id='table_data'>" . $Daily_Time_Series_Data['Time Series (Daily)'][$Dates[1]]['4. close'] . "</td></tr>
                                   <tr><th>Change</th><td id='table_data'>" . number_format(($Daily_Time_Series_Data['Time Series (Daily)'][$Dates[0]]['4. close'] - $Daily_Time_Series_Data['Time Series (Daily)'][$Dates[1]]['4. close']), 2);
    if (($Daily_Time_Series_Data['Time Series (Daily)'][$Dates[0]]['4. close'] - $Daily_Time_Series_Data['Time Series (Daily)'][$Dates[1]]['4. close']) < 0) {
        $html_text_table .= "<img id='arrow_img' src='http://cs-server.usc.edu:45678/hw/hw6/images/Red_Arrow_Down.png'></td></tr>";
    } else {
        $html_text_table .= "<img id='arrow_img' src='http://cs-server.usc.edu:45678/hw/hw6/images/Green_Arrow_Up.png'></td></tr>";
    }
    $html_text_table .= "<tr><th>Change Percent</th><td id='table_data'>" . number_format(($Daily_Time_Series_Data['Time Series (Daily)'][$Dates[0]]['4. close'] - $Daily_Time_Series_Data['Time Series (Daily)'][$Dates[1]]['4. close']) * 100 / $Daily_Time_Series_Data['Time Series (Daily)'][$Dates[0]]['4. close'], 2) . "%";
    if (($Daily_Time_Series_Data['Time Series (Daily)'][$Dates[0]]['4. close'] - $Daily_Time_Series_Data['Time Series (Daily)'][$Dates[1]]['4. close']) * 100 / $Daily_Time_Series_Data['Time Series (Daily)'][$Dates[0]]['4. close'] < 0) {
        $html_text_table .= "<img id='arrow_img' src='http://cs-server.usc.edu:45678/hw/hw6/images/Red_Arrow_Down.png'></td></tr>";
    } else {
        $html_text_table .= "<img id='arrow_img' src='http://cs-server.usc.edu:45678/hw/hw6/images/Green_Arrow_Up.png'></td></tr>";
    }
    $html_text_table .= "<tr><th>Day's Range</th><td id='table_data'>" . $Daily_Time_Series_Data['Time Series (Daily)'][$Dates[0]]['3. low'] . "-" . $Daily_Time_Series_Data['Time Series (Daily)'][$Dates[0]]['2. high'] . "</td></tr>";
    $html_text_table .= "<tr><th>Volume</th><td id='table_data'>" . number_format($Daily_Time_Series_Data['Time Series (Daily)'][$Dates[1]]['5. volume']) . "</td></tr>";
    $html_text_table .= "<tr><th>Timestamp</th><td id='table_data'>" . $Dates[0] . "</td></tr>";
    $html_text_table .= '<tr><th>Indicators</th><td id="table_data">
        <a id="plot_link" href="javascript:void(0)" onclick="drawPrice()">Price</a>
        <a id="plot_link" href="javascript:void(0)" onclick="drawSMA()">SMA</a>
        <a id="plot_link" href="javascript:void(0)" onclick="drawEMA()">EMA</a>
        <a id="plot_link" href="javascript:void(0)" onclick="drawSTOCH()">STOCH</a>
        <a id="plot_link" href="javascript:void(0)" onclick="drawRSI()">RSI</a>
        <a id="plot_link" href="javascript:void(0)" onclick="drawADX()">ADX</a>
        <a id="plot_link" href="javascript:void(0)" onclick="drawCCI()">CCI</a>
        <a id="plot_link" href="javascript:void(0)" onclick="drawBBANDS()">BBANDS</a>
        <a id="plot_link" href="javascript:void(0)" onclick="drawMACD()">MACD</a>
        </td></tr></table>';
    echo $html_text_table;
    $today = substr($Dates[0], 5, 2) . "/" . substr($Dates[0], 8, 2) . "/" . substr($Dates[0], 0, 4);
    $index = 0;
    $dates = array();
    $price = array();
    $volume = array();
    for ($i = (sizeof($Dates) - 1); $i >= 0; $i--) {
        $dates[$index] = substr($Dates[$i], 5, 2) . "/" . substr($Dates[$i], 8, 2);
        $price[$index] = $Daily_Time_Series_Data['Time Series (Daily)'][$Dates[$i]]['4. close'] * 1;
        $volume[$index] = $Daily_Time_Series_Data['Time Series (Daily)'][$Dates[$i]]['5. volume'] / 1000000;
        $index++;
    }
    $min = min($price) * 0.6;
    $max = max($price) * 1.05;
    $volume_max = max($volume) * 4;
    $dates_json = json_encode($dates);
    $price_json = json_encode($price);
    $volume_json = json_encode($volume);


    ?>

    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>

    <script type="text/javascript" src="json.js"></script>

    <div id="container" style="min-width: 310px; height: 600px;border:2px solid #ccd1d1; margin: 0 auto"></div>

    <script>

        var stock_ticker_symbol = '<?=$stock_ticker_symbol?>';
        var dates_json = '<?=$dates_json?>';
        var price_json = '<?=$price_json?>';
        var volume_json = '<?=$volume_json?>';
        var dates = JSON.parse(dates_json);
        var price = JSON.parse(price_json);
        var volume = JSON.parse(volume_json);
        Highcharts.chart('container', {
            chart: {
                zoomType: 'xy'
            },
            title: {
                text: 'Stock Price(<?php echo $today?>)'
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
                    fillOpacity: 0.65,
                    marker: {
                        enabled: false,
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
                    min: <?php echo $min?>,
                    max: <?php echo $max?>,
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
                    max: <?php echo $volume_max?>,
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
                layout: 'vertical',
                align: 'right',
                x: 0,
                verticalAlign: 'top',
                y: 200,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
            },
            plotOptions: {
                area: {
                    fillOpacity: 0.65,
                    marker: {
                        enabled: false
                    }
                }
            },
            series: [
                {
                    name: '<?php echo $stock_ticker_symbol?>',
                    type: 'area',
                    color: '#e74c3c',
                    data: price,
                    threshold: null,
                    tooltip: {
                        valueSuffix: ''
                    }
                },
                {
                    name: '<?php echo $stock_ticker_symbol?> Volume',
                    type: 'column',
                    color: '#ffffff',
                    yAxis: 1,
                    data: volume,
                    tooltip: {
                        valueSuffix: ' M'
                    }

                }

            ]
        });

        function drawPrice() {
            Highcharts.chart('container', {
                chart: {
                    zoomType: 'xy'
                },
                title: {
                    text: 'Stock Price(<?php echo $today?>)'
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
                        fillOpacity: 0.65,
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
                        min: <?php echo $min?>,
                        max: <?php echo $max?>,
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
                        max: <?php echo $volume_max?>,
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
                    layout: 'vertical',
                    align: 'right',
                    x: 0,
                    verticalAlign: 'top',
                    y: 200,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
                },
                plotOptions: {
                    area: {
                        fillOpacity: 0.65,
                        marker: {
                            enabled: false
                        }
                    }
                },
                series: [
                    {
                        name: '<?php echo $stock_ticker_symbol?>',
                        type: 'area',
                        color: '#e74c3c',
                        data: price,
                        threshold: null,
                        tooltip: {
                            valueSuffix: ''
                        }
                    },
                    {
                        name: '<?php echo $stock_ticker_symbol?> Volume',
                        type: 'column',
                        color: '#ffffff',
                        yAxis: 1,
                        data: volume,
                        tooltip: {
                            valueSuffix: ' M'
                        }

                    }

                ]
            });
        }

        function drawSMA() {
            var url = "https://www.alphavantage.co/query?function=SMA&symbol=" + stock_ticker_symbol + "&interval=daily&time_period=10&series_type=close&apikey=ZZPJ8EI5S0CXS8O4";
            var xmlhttp;
            if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
                xmlhttp = new XMLHttpRequest();
            }
            else {// code for IE6, IE5
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            xmlhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    setSMA(this);
                }
            };
            xmlhttp.open("GET", url, true);
            xmlhttp.send();
            if (xmlhttp.status === 404) {
                alert("JSON file not found.")
            }

        }

        function setSMA(jsonfile) {
            var json = JSON.parse(jsonfile.responseText);
            var name = json["Meta Data"]["2: Indicator"];
            var time = Object.keys(json["Technical Analysis: SMA"]);
            var date = new Array(130);
            var sma = new Array(130);
            var index = 0;
            for (var i = 129; i >= 0; i--) {
                date[index] = time[i].substring(5, 7) + "/" + time[i].substring(8, 10);
                sma[index] = parseFloat(json["Technical Analysis: SMA"][time[i]]["SMA"]);
                index++;
            }

            Highcharts.chart('container', {
                chart: {
                    zoomType: 'xy'
                },
                title: {
                    text: name
                },

                subtitle: {
                    useHTML: true,
                    text: "<a href='https://www.alphavantage.co/' target='_blank'>Source: Alpha Vantage</a>"
                },
                xAxis: [{
                    categories: date,
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
                    align: 'right',
                    verticalAlign: 'middle'
                },
                plotOptions: {
                    line: {
                        lineWidth: 2
                    }
                },
                series: [{
                    name: stock_ticker_symbol,
                    color: '#e74c3c',
                    threshold: null,
                    data: sma
                }
                ]
            });
        }

        function drawEMA() {
            var url = "https://www.alphavantage.co/query?function=EMA&symbol=" + stock_ticker_symbol + "&interval=daily&time_period=10&series_type=close&apikey=ZZPJ8EI5S0CXS8O4";
            var xmlhttp;
            if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
                xmlhttp = new XMLHttpRequest();
            }
            else {// code for IE6, IE5
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            xmlhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    setEMA(this);
                }
            };
            xmlhttp.open("GET", url, true);
            xmlhttp.send();
            if (xmlhttp.status === 404) {
                alert("JSON file not found.")
            }
        }

        function setEMA(jsonfile) {
            var json = JSON.parse(jsonfile.responseText);
            var name = json["Meta Data"]["2: Indicator"];
            var time = Object.keys(json["Technical Analysis: EMA"]);
            var date = new Array(130);
            var ema = new Array(130);
            var index = 0;
            for (var i = 129; i >= 0; i--) {
                date[index] = time[i].substring(5, 7) + "/" + time[i].substring(8, 10);
                ema[index] = parseFloat(json["Technical Analysis: EMA"][time[i]]["EMA"]);
                index++;
            }

            Highcharts.chart('container', {
                chart: {
                    zoomType: 'xy'
                },
                title: {
                    text: name
                },

                subtitle: {
                    useHTML: true,
                    text: "<a href='https://www.alphavantage.co/' target='_blank'>Source: Alpha Vantage</a>"
                },
                xAxis: [{
                    categories: date,
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
                    align: 'right',
                    verticalAlign: 'middle'
                },
                plotOptions: {
                    line: {
                        lineWidth: 2
                    }
                },
                series: [{
                    name: stock_ticker_symbol,
                    color: '#e74c3c',
                    threshold: null,
                    data: ema
                }
                ]
            });
        }

        function drawSTOCH() {
            var url = "https://www.alphavantage.co/query?function=STOCH&symbol=" + stock_ticker_symbol + "&interval=daily&time_period=10&series_type=close&apikey=ZZPJ8EI5S0CXS8O4";
            var xmlhttp;
            if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
                xmlhttp = new XMLHttpRequest();
            }
            else {// code for IE6, IE5
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            xmlhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    setSTOCH(this);
                }
            };
            xmlhttp.open("GET", url, true);
            xmlhttp.send();
            if (xmlhttp.status === 404) {
                alert("JSON file not found.")
            }
        }

        function setSTOCH(jsonfile) {
            var json = JSON.parse(jsonfile.responseText);
            var name = json["Meta Data"]["2: Indicator"];
            var time = Object.keys(json["Technical Analysis: STOCH"]);
            var date = new Array(130);
            var slowD = new Array(130);
            var slowK = new Array(130);
            var index = 0;
            for (var i = 129; i >= 0; i--) {
                date[index] = time[i].substring(5, 7) + "/" + time[i].substring(8, 10);
                slowD[index] = parseFloat(json["Technical Analysis: STOCH"][time[i]]["SlowD"]);
                slowK[index] = parseFloat(json["Technical Analysis: STOCH"][time[i]]["SlowK"]);
                index++;
            }

            Highcharts.chart('container', {
                chart: {
                    zoomType: 'xy'
                },
                title: {
                    text: name
                },

                subtitle: {
                    useHTML: true,
                    text: "<a href='https://www.alphavantage.co/' target='_blank'>Source: Alpha Vantage</a>"
                },
                xAxis: [{
                    categories: date,
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
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle'
                },
                plotOptions: {
                    line: {
                        lineWidth: 2
                    }
                },
                series: [{
                    name: stock_ticker_symbol + ' SlowK',
                    color: '#e74c3c',
                    threshold: null,
                    data: slowK
                }, {
                    name: stock_ticker_symbol + ' SlowD',
                    threshold: null,
                    data: slowD
                }
                ]
            });
        }

        function drawRSI() {
            var url = "https://www.alphavantage.co/query?function=RSI&symbol=" + stock_ticker_symbol + "&interval=daily&time_period=10&series_type=close&apikey=ZZPJ8EI5S0CXS8O4";
            var xmlhttp;
            if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
                xmlhttp = new XMLHttpRequest();
            }
            else {// code for IE6, IE5
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            xmlhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    setRSI(this);
                }
            };
            xmlhttp.open("GET", url, true);
            xmlhttp.send();
            if (xmlhttp.status === 404) {
                alert("JSON file not found.")
            }
        }

        function setRSI(jsonfile) {
            var json = JSON.parse(jsonfile.responseText);
            var name = json["Meta Data"]["2: Indicator"];
            var time = Object.keys(json["Technical Analysis: RSI"]);
            var date = new Array(130);
            var rsi = new Array(130);
            var index = 0;
            for (var i = 129; i >= 0; i--) {
                date[index] = time[i].substring(5, 7) + "/" + time[i].substring(8, 10);
                rsi[index] = parseFloat(json["Technical Analysis: RSI"][time[i]]["RSI"]);
                index++;
            }

            Highcharts.chart('container', {
                chart: {
                    zoomType: 'xy'
                },
                title: {
                    text: name
                },

                subtitle: {
                    useHTML: true,
                    text: "<a href='https://www.alphavantage.co/' target='_blank'>Source: Alpha Vantage</a>"
                },
                xAxis: [{
                    categories: date,
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
                    align: 'right',
                    verticalAlign: 'middle'
                },
                plotOptions: {
                    line: {
                        lineWidth: 2
                    }
                },
                series: [{
                    name: stock_ticker_symbol,
                    color: '#e74c3c',
                    threshold: null,
                    data: rsi
                }
                ]
            });
        }

        function drawADX() {
            var url = "https://www.alphavantage.co/query?function=ADX&symbol=" + stock_ticker_symbol + "&interval=daily&time_period=10&series_type=close&apikey=ZZPJ8EI5S0CXS8O4";
            var xmlhttp;
            if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
                xmlhttp = new XMLHttpRequest();
            }
            else {// code for IE6, IE5
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            xmlhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    setADX(this);
                }
            };
            xmlhttp.open("GET", url, true);
            xmlhttp.send();
            if (xmlhttp.status === 404) {
                alert("JSON file not found.")
            }
        }

        function setADX(jsonfile) {
            var json = JSON.parse(jsonfile.responseText);
            var name = json["Meta Data"]["2: Indicator"];
            var time = Object.keys(json["Technical Analysis: ADX"]);
            var date = new Array(130);
            var adx = new Array(130);
            var index = 0;
            for (var i = 129; i >= 0; i--) {
                date[index] = time[i].substring(5, 7) + "/" + time[i].substring(8, 10);
                adx[index] = parseFloat(json["Technical Analysis: ADX"][time[i]]["ADX"]);
                index++;
            }

            Highcharts.chart('container', {
                chart: {
                    zoomType: 'xy'
                },
                title: {
                    text: name
                },

                subtitle: {
                    useHTML: true,
                    text: "<a href='https://www.alphavantage.co/' target='_blank'>Source: Alpha Vantage</a>"
                },
                xAxis: [{
                    categories: date,
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
                    align: 'right',
                    verticalAlign: 'middle'
                },
                plotOptions: {
                    line: {
                        lineWidth: 2
                    }
                },
                series: [{
                    name: stock_ticker_symbol,
                    color: '#e74c3c',
                    threshold: null,
                    data: adx
                }
                ]
            });
        }

        function drawCCI() {
            var url = "https://www.alphavantage.co/query?function=CCI&symbol=" + stock_ticker_symbol + "&interval=daily&time_period=10&series_type=close&apikey=ZZPJ8EI5S0CXS8O4";
            var xmlhttp;
            if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
                xmlhttp = new XMLHttpRequest();
            }
            else {// code for IE6, IE5
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            xmlhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    setCCI(this);
                }
            };
            xmlhttp.open("GET", url, true);
            xmlhttp.send();
            if (xmlhttp.status === 404) {
                alert("JSON file not found.")
            }
        }

        function setCCI(jsonfile) {
            var json = JSON.parse(jsonfile.responseText);
            var name = json["Meta Data"]["2: Indicator"];
            var time = Object.keys(json["Technical Analysis: CCI"]);
            var date = new Array(130);
            var cci = new Array(130);
            var index = 0;
            for (var i = 129; i >= 0; i--) {
                date[index] = time[i].substring(5, 7) + "/" + time[i].substring(8, 10);
                cci[index] = parseFloat(json["Technical Analysis: CCI"][time[i]]["CCI"]);
                index++;
            }

            Highcharts.chart('container', {
                chart: {
                    zoomType: 'xy'
                },
                title: {
                    text: name
                },

                subtitle: {
                    useHTML: true,
                    text: "<a href='https://www.alphavantage.co/' target='_blank'>Source: Alpha Vantage</a>"
                },
                xAxis: [{
                    categories: date,
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
                    align: 'right',
                    verticalAlign: 'middle'
                },
                plotOptions: {
                    line: {
                        lineWidth: 2
                    }
                },
                series: [{
                    name: stock_ticker_symbol,
                    color: '#e74c3c',
                    threshold: null,
                    data: cci
                }
                ]
            });
        }

        function drawBBANDS() {
            var url = "https://www.alphavantage.co/query?function=BBANDS&symbol=" + stock_ticker_symbol + "&interval=daily&time_period=10&series_type=close&apikey=ZZPJ8EI5S0CXS8O4";
            var xmlhttp;
            if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
                xmlhttp = new XMLHttpRequest();
            }
            else {// code for IE6, IE5
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            xmlhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    setBBANDS(this);
                }
            };
            xmlhttp.open("GET", url, true);
            xmlhttp.send();
            if (xmlhttp.status === 404) {
                alert("JSON file not found.")
            }
        }

        function setBBANDS(jsonfile) {
            var json = JSON.parse(jsonfile.responseText);
            var name = json["Meta Data"]["2: Indicator"];
            var time = Object.keys(json["Technical Analysis: BBANDS"]);
            var date = new Array(130);
            var rub = new Array(130);
            var rlb = new Array(130);
            var rmb = new Array(130);
            var index = 0;
            for (var i = 129; i >= 0; i--) {
                date[index] = time[i].substring(5, 7) + "/" + time[i].substring(8, 10);
                rub[index] = parseFloat(json["Technical Analysis: BBANDS"][time[i]]["Real Upper Band"]);
                rlb[index] = parseFloat(json["Technical Analysis: BBANDS"][time[i]]["Real Lower Band"]);
                rmb[index] = parseFloat(json["Technical Analysis: BBANDS"][time[i]]["Real Middle Band"]);
                index++;
            }

            Highcharts.chart('container', {
                chart: {
                    zoomType: 'xy'
                },
                title: {
                    text: name
                },

                subtitle: {
                    useHTML: true,
                    text: "<a href='https://www.alphavantage.co/' target='_blank'>Source: Alpha Vantage</a>"
                },
                xAxis: [{
                    categories: date,
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
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle'
                },
                plotOptions: {
                    line: {
                        lineWidth: 2
                    }
                },
                series: [{
                    name: stock_ticker_symbol + ' Real Middle Band',
                    color: '#e74c3c',
                    threshold: null,
                    data: rmb
                }, {
                    name: stock_ticker_symbol + ' Real Upper Band',
                    color: '#000000',
                    threshold: null,
                    data: rub
                }, {
                    name: stock_ticker_symbol + ' Real Lower Band',
                    color: '#27e70c',
                    threshold: null,
                    data: rlb
                }
                ]
            });
        }

        function drawMACD() {
            var url = "https://www.alphavantage.co/query?function=MACD&symbol=" + stock_ticker_symbol + "&interval=daily&time_period=10&series_type=close&apikey=ZZPJ8EI5S0CXS8O4";
            var xmlhttp;
            if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
                xmlhttp = new XMLHttpRequest();
            }
            else {// code for IE6, IE5
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            xmlhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    setMACD(this);
                }
            };
            xmlhttp.open("GET", url, true);
            xmlhttp.send();
            if (xmlhttp.status === 404) {
                alert("JSON file not found.")
            }
        }

        function setMACD(jsonfile) {
            var json = JSON.parse(jsonfile.responseText);
            var name = json["Meta Data"]["2: Indicator"];
            var time = Object.keys(json["Technical Analysis: MACD"]);
            var date = new Array(130);
            var macdH = new Array(130);
            var macd = new Array(130);
            var macdS = new Array(130);
            var index = 0;
            for (var i = 129; i >= 0; i--) {
                date[index] = time[i].substring(5, 7) + "/" + time[i].substring(8, 10);
                macdH[index] = parseFloat(json["Technical Analysis: MACD"][time[i]]["MACD_Hist"]);
                macd[index] = parseFloat(json["Technical Analysis: MACD"][time[i]]["MACD"]);
                macdS[index] = parseFloat(json["Technical Analysis: MACD"][time[i]]["MACD_Signal"]);
                index++;
            }

            Highcharts.chart('container', {
                chart: {
                    zoomType: 'xy'
                },
                title: {
                    text: name
                },

                subtitle: {
                    useHTML: true,
                    text: "<a href='https://www.alphavantage.co/' target='_blank'>Source: Alpha Vantage</a>"
                },
                xAxis: [{
                    categories: date,
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
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle'
                },
                plotOptions: {
                    line: {
                        lineWidth: 2
                    }
                },
                series: [{
                    name: stock_ticker_symbol + ' MACD',
                    color: '#e74c3c',
                    threshold: null,
                    data: macd
                }, {
                    name: stock_ticker_symbol + ' MACD_Hist',
                    color: '#f1c811',
                    threshold: null,
                    data: macdH
                }, {
                    name: stock_ticker_symbol + ' MACD_Signal',
                    color: '#2030ea',
                    threshold: null,
                    data: macdS
                }
                ]
            });
        }

    </script>

    <?php
    $News_xml_url = "https://seekingalpha.com/api/sa/combined/" . $stock_ticker_symbol . ".xml";
    $xmldata = file_get_contents($News_xml_url);
    $xml = simplexml_load_string($xmldata);
    $pattern = "/article/i";
    $title = array();
    $link = array();
    $publish = array();
    $count = 0;
    for ($i = 0; $i < sizeof($xml->channel->item); $i++) {
        $subject = $xml->channel->item[$i]->link;
        if (preg_match($pattern, $subject)) {
            $title[$count] = $xml->channel->item[$i]->title;
            $link[$count] = $xml->channel->item[$i]->link;
            $publish[$count] = substr($xml->channel->item[$i]->pubDate, 0, 25);
            $count++;
        }
        if ($count >= 5) {
            break;
        }
    }
    $title_json = json_encode($title);
    $link_json = json_encode($link);
    $publish_json = json_encode($publish);

    ?>
    <div></div>
    <div id="hide_show" onclick="change()">
        <p id="gray_text">click to show stock news</p>
        <img id="gray_arrow" src="http://cs-server.usc.edu:45678/hw/hw6/images/Gray_Arrow_Down.png">
    </div>
    <div id="newsTable">

        <script>

            function change() {
                var img = document.getElementById('gray_arrow');
                if (img.src.match("Down")) {
                    document.getElementById("gray_text").innerHTML = "click to hide stock news";
                    img.src = "http://cs-server.usc.edu:45678/hw/hw6/images/Gray_Arrow_Up.png";
                    drawNews();
                }
                else {
                    document.getElementById("gray_text").innerHTML = "click to show stock news";
                    img.src = "http://cs-server.usc.edu:45678/hw/hw6/images/Gray_Arrow_Down.png";
                    clearNews();
                }
            }

            function drawNews() {
                var html_news = "<table>\n" +
                    "                <tr><td><a href=<?php echo $link[0]?>><?php echo $title[0]?></a>&nbsp&nbsp&nbsp&nbsp&nbsp&nbspPublicated Time:   <?php echo $publish[0]?></td></tr>\n" +
                    "                <tr><td><a href=<?php echo $link[1]?>><?php echo $title[1]?></a>&nbsp&nbsp&nbsp&nbsp&nbsp&nbspPublicated Time:   <?php echo $publish[1]?></td></tr>\n" +
                    "                <tr><td><a href=<?php echo $link[2]?>><?php echo $title[2]?></a>&nbsp&nbsp&nbsp&nbsp&nbsp&nbspPublicated Time:   <?php echo $publish[2]?></td></tr>\n" +
                    "                <tr><td><a href=<?php echo $link[3]?>><?php echo $title[3]?></a>&nbsp&nbsp&nbsp&nbsp&nbsp&nbspPublicated Time:   <?php echo $publish[3]?></td></tr>\n" +
                    "                <tr><td><a href=<?php echo $link[4]?>><?php echo $title[4]?></a>&nbsp&nbsp&nbsp&nbsp&nbsp&nbspPublicated Time:   <?php echo $publish[4]?></td></tr>\n" +
                    "            </table>";
                document.getElementById('newsTable').innerHTML = html_news;
            }

            function clearNews() {
                document.getElementById('newsTable').innerHTML = "";
            }
        </script>
        <?php

        }
    }
    ?>



    <script>

        function divRemove() {
            window.location.href = "stock.php";
        }
        function validateForm() {
            var x = document.forms["myForm"]["name"].value;
            if ((x === null) || (x === "")) {
                alert("Please enter a symbol!");
                return false;
            }
        }
    </script>
</body>
</html>

