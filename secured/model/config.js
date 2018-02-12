     /*App settings*/
    var authToken = 'cGRpdjpAcm0xazB5MWxAZzBz';
    var appSettings = {
        appTitle:'Payday',
        displayContainer:'display',
        defaultPage:'splashscreen',
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
    var paydayWebAuthToken =  btoa("paydayInvestor:13fc17edc2ea436f7dab66cad29eb9b2")
    var paydayWebBaseUrl = "https://paydayinvestor.ng/api/v1";
    var armOneBaseUrl = "http://41.216.170.131:8000/armauth";
    var paydayWebKongUrl = "http://41.216.170.131:8000/paydaypayment";
    
    /////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////Test Data\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
