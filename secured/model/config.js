    /*App settings*/
    var appSettings = {
        appTitle:'Payday',
        displayContainer:'display',
        defaultPage:'login',
        loadDefaultPage:false,
        trackUrlChanges:false,
        registerPageHistory:false,
        viewPath:'secured/views/',
        serverUrl:'http://paydayinvestor.arm.com.ng/api/v1',
        appMode:'debug',
        httpReqHeaders:{
            "Content-Type": "application/json"
        },
        httpRequestAuth:'',
        loader:{
            active:false,
            id:'loader1', 
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
 

 