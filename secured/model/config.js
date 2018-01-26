     /*App settings*/
    var authToken = btoa("pdiv:@rm1k0y1l@g0s")
    var appSettings = {
        appTitle:'Payday',
        displayContainer:'display',
        defaultPage:'login',
        errorPage:'login',
        loadDefaultPage:false,
        trackUrlChanges:false,
        registerPageHistory:true, 
        viewPath:'secured/views/',
        serverUrl:'http://41.216.170.131:8000/pdiv/',
        appMode:'debug',
        httpReqHeaders:{
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Access-Control-Allow-Credentials":"true"
         }, 
        httpRequestAuth:{
            "status": true,
            "authName":"Basic",
            "authToken": authToken
        },
        loader:{
            active:true,
            useCustom:true,
            id:'loadingbar', 
            imgUrl: '',
            text:'Loading...',
            showImg:false,
            showTxt:true,
            imgSize:'',
            style:'',
            class:'loader'
        }
    };
    renda.config(appSettings);

    var paydayWebBaseUrl = "https://paydayinvestor.arm.com.ng/api/v1";
    var armOneBaseUrl = "http://41.216.170.131:8000/armauth";
    var paydayWebKongUrl = "http://41.216.170.131:8000/paydaypayment";

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////Test Data\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
var cardList ={
    "status": 200,
    "message": "",
    "data": [
        {
        "Id": 2328,
        "AppUserId": "PIV100012",
        "CardNo": "6398",
        "FWCode": "UKiIIx2IlQ0aFod=VBV",
        "Status": "active",
        "DeductionDay": 27
        },
        {
        "Id": 2312,
        "AppUserId": "PIV100012",
        "CardNo": "6326",
        "FWCode": "UKiIIx2IlQ0aFod=VUT",
        "Status": "active",
        "DeductionDay": 27
        },
        {
        "Id": 2333,
        "AppUserId": "PIV100012",
        "CardNo": "6355",
        "FWCode": "UKiIIx2IlQ0aFod=VAS",
        "Status": "active",
        "DeductionDay": 27
        }
    ]
 }