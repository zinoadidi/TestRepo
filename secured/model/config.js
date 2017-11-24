    /*App settings*/
    var authToken = btoa("paydayInvestor:13fc17edc2ea436f7dab66cad29eb9b2")
    var appSettings = {
        appTitle:'Payday',
        displayContainer:'display',
        defaultPage:'login',
        errorPage:'login',
        loadDefaultPage:false,
        trackUrlChanges:false,
        registerPageHistory:false,
        viewPath:'secured/views/',
        serverUrl:'http://paydayinvestor.arm.com.ng/api/v1',
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
 

 var USERDATA = {
    "status": 200,
    "message": "Login Successful",
    "data": {
        "UserId": "PIV1000148123",
        "Surname": "TestSurname",
        "Firstname": "TestFirstName",
        "Middlename": "TestMiddleName",
        "BVN": null,
        "BankName": null,
        "BankAccountNo": null,
        "Address": null,
        "Email": "ftgffgfg@fros.com",
        "Phonenumber": "08003005802",
        "RegistrationDate": "2017-11-21T17:01:16.43",
        "Status": null,
        "ProfilePic": null,
        "MaritalStatus": null,
        "Gender": null,
        "DOB": null,
        "ProgressStatus": "Stage 1 Completed",
        "Token": "52556",
        "PRToken": null,
        "SecurityQuestion": "TestQuestion",
        "SecurityAnswer": "TestAnswer"
    }
}

var TESTDATA = {
    "status": 200,
    "message": "",
    "data": {
        "UserId": "PIV1000213131",
        "Surname": "Adidi",
        "Firstname": "Zino",
        "Middlename": "Adidi",
        "BVN": "12345678909",
        "BankName": "First Bank",
        "BankAccountNo": "1234567890",
        "Address": "vfgdf",
        "Email": "zino@home.com",
        "Phonenumber": "09090909090",
        "RegistrationDate": "2017-11-23T16:39:36.177",
        "Status": "active",
        "ProfilePic": null,
        "MaritalStatus": "Divorced",
        "Gender": "Male",
        "DOB": "2017-11-01T00:00:00",
        "ProgressStatus": "KYC Submitted",
        "Token": "56645",
        "PRToken": null,
        "SecurityQuestion": "TestQuestion",
        "SecurityAnswer": "TestAnswer"
    }
}

var TESTDASH = { "status": 200, "message": "", "data": { "yield_rate": 17.8173, "goals_done": null, "goals_total": 1, "goals_pending": 1, "goals_suspended": 0, "total_withdrawals": 0, "net_investment": { "AppUserId": "PIV1000213131", "TotalInvestment": 0, "AccruedIntrest": 0 }, "fetchWallet": { "UserId": "PIV1000213131", "Amount": 0 }, "top_goal": false, "goals": [{ "ExcessFund": 0, "GoalId": "Goal1131161", "AppUserId": "PIV1000213131", "ItemName": "my new goal", "ItemDescription": "GGJJBGJ JGJBGJJ ", "GoalAmount": 10000, "Duration": "10 days", "MonthlyDeduction": 1000, "ProductId": null, "AmountAttained": 0, "Status": "Active", "DateCreated": "2017-11-24T04:26:16.357", "GoalType": "2", "Day": "Daily", "Frequency": "Daily", "CardId": 0, "GoalImage": null, "NoOfDeductionRemaining": 10, "IsTopGoal": false }], "chat_data ": { "Credit": "", "Debit": "" } } }