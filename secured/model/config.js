     /*App settings*/
    var authToken = btoa("paydayInvestor:13fc17edc2ea436f7dab66cad29eb9b2")
    var appSettings = {
        appTitle:'Payday',
        displayContainer:'display',
        defaultPage:'login',
        errorPage:'login',
        loadDefaultPage:false,
        trackUrlChanges:false,
        registerPageHistory:true,
        viewPath:'secured/views/',
        serverUrl:'https://paydayinvestor.arm.com.ng/api/v1',
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

var TESTDASH = { 

    "status": 200, 
    "message": "", 
    "data": { 
        "yield_rate": 17.8173, 
        "goals_done": 2, 
        "goals_total": 3, 
        "goals_pending": 1, 
        "goals_suspended": 0, 
        "total_withdrawals": 0, 
        "net_investment": { 
            "AppUserId": "PIV1000213131", 
            "TotalInvestment": 0, 
            "AccruedIntrest": 0 
        }, "fetchWallet": { 
            "UserId": "PIV1000213131", 
            "Amount": 0 
        }, "top_goal": false, 
        "goals": [
            { "ExcessFund": 0, "GoalId": "Goal1131161", "AppUserId": "PIV1000213131", "ItemName": "my new goal", "ItemDescription": "GGJJBGJ JGJBGJJ ", "GoalAmount": 10000, "Duration": "10 days", "MonthlyDeduction": 1000, "ProductId": null, "AmountAttained": 0, "Status": "Active", "DateCreated": "2017-11-24T04:26:16.357", "GoalType": "2", "Day": "Daily", "Frequency": "Daily", "CardId": 0, "GoalImage": null, "NoOfDeductionRemaining": 10, "IsTopGoal": false },
            { "ExcessFund": 0, "GoalId": "Goal1131161", "AppUserId": "PIV1000213131", "ItemName": "my new goal", "ItemDescription": "GGJJBGJ JGJBGJJ ", "GoalAmount": 10000, "Duration": "10 days", "MonthlyDeduction": 1000, "ProductId": null, "AmountAttained": 0, "Status": "Active", "DateCreated": "2017-11-24T04:26:16.357", "GoalType": "2", "Day": "Daily", "Frequency": "Daily", "CardId": 0, "GoalImage": null, "NoOfDeductionRemaining": 10, "IsTopGoal": false },
            { "ExcessFund": 0, "GoalId": "Goal1131161", "AppUserId": "PIV1000213131", "ItemName": "my new goal", "ItemDescription": "GGJJBGJ JGJBGJJ ", "GoalAmount": 10000, "Duration": "10 days", "MonthlyDeduction": 1000, "ProductId": null, "AmountAttained": 0, "Status": "Active", "DateCreated": "2017-11-24T04:26:16.357", "GoalType": "2", "Day": "Daily", "Frequency": "Daily", "CardId": 0, "GoalImage": null, "NoOfDeductionRemaining": 10, "IsTopGoal": false },
            { "ExcessFund": 0, "GoalId": "Goal1131161", "AppUserId": "PIV1000213131", "ItemName": "my new goal", "ItemDescription": "GGJJBGJ JGJBGJJ ", "GoalAmount": 10000, "Duration": "10 days", "MonthlyDeduction": 1000, "ProductId": null, "AmountAttained": 0, "Status": "Active", "DateCreated": "2017-11-24T04:26:16.357", "GoalType": "2", "Day": "Daily", "Frequency": "Daily", "CardId": 0, "GoalImage": null, "NoOfDeductionRemaining": 10, "IsTopGoal": false },
            { "ExcessFund": 0, "GoalId": "Goal1131161", "AppUserId": "PIV1000213131", "ItemName": "my new goal", "ItemDescription": "GGJJBGJ JGJBGJJ ", "GoalAmount": 10000, "Duration": "10 days", "MonthlyDeduction": 1000, "ProductId": null, "AmountAttained": 0, "Status": "Active", "DateCreated": "2017-11-24T04:26:16.357", "GoalType": "2", "Day": "Daily", "Frequency": "Daily", "CardId": 0, "GoalImage": null, "NoOfDeductionRemaining": 10, "IsTopGoal": false },
            { "ExcessFund": 0, "GoalId": "Goal1131161", "AppUserId": "PIV1000213131", "ItemName": "my new goal", "ItemDescription": "GGJJBGJ JGJBGJJ ", "GoalAmount": 10000, "Duration": "10 days", "MonthlyDeduction": 1000, "ProductId": null, "AmountAttained": 0, "Status": "Active", "DateCreated": "2017-11-24T04:26:16.357", "GoalType": "2", "Day": "Daily", "Frequency": "Daily", "CardId": 0, "GoalImage": null, "NoOfDeductionRemaining": 10, "IsTopGoal": false },
            { "ExcessFund": 0, "GoalId": "Goal1131161", "AppUserId": "PIV1000213131", "ItemName": "my new goal", "ItemDescription": "GGJJBGJ JGJBGJJ ", "GoalAmount": 10000, "Duration": "10 days", "MonthlyDeduction": 1000, "ProductId": null, "AmountAttained": 0, "Status": "Active", "DateCreated": "2017-11-24T04:26:16.357", "GoalType": "2", "Day": "Daily", "Frequency": "Daily", "CardId": 0, "GoalImage": null, "NoOfDeductionRemaining": 10, "IsTopGoal": false }
        ], 
        "chat_data ": { "Credit": "", "Debit": "" },
        "client_balance":{
            "AccruedIntrest":2000,
            "BookBalance":3000,
            "AvailableBalance":4000
        }
    } 
}

var TESTcard = 
{
    "status":200,"message":null,
    "data":{
        "data":{
            "authurl":"https:\/\/flutterwaveprod.com:9443\/flwmpgs\/trxauth?hid=FLWb8fe60e3d9d5404ca6806dc913e321df",
            "responsecode":true,
            "redirecturl":"https:\/\/flutterwaveprod.com:9443\/flwmpgs\/trxauth?hid=FLWb8fe60e3d9d5404ca6806dc913e321df",
            "avsresponsemessage":null,"avsresponsecode":null,"responsemessage":"Pending, Validation",
            "otptransactionidentifier":"FLW68308601","transactionreference":"FLW68308601",
            "responsehtml":"jwfvyBQk8eAUAoG6xeW9LYxNP+HWJ+n1\/vXJeyVzdmY6EklYTwol5YPon775ffsjvKht6IUdRmW+eWUVgSyGGVcZrI3th87xRXvd5UPouV1tCA9PPjRr5\/dTOwu3eIdqR0nIOYhmdZRZwlVOZOVxbp6t3xc20yisfuJms+QRpmrhGL6U4bEzBc6AhhLuizKFhYU2bvVVI1THhFx3v7gMfweOsgD8ERoPZvHlXmA+AAh7wEZorHltXkpshNdvYBadJfDBt8Emq5rg6clpK4IDJbo5nHbFrNR4Gz2Buc39c7IUapTIjLXbCnOTUSsC2KlajsVTtqSes3s+8xqFfOPz56lp4Kt1zfvnQlkn+071uAxThdZVP\/1QmjnLs9xN9hyKrc1lpZE66P35ymhZIVkgLwcV\/i7p9BDhv2G98OKteRqJorNCkkH2vTSyAONtn6gFXp74rf4X1ET5jimx20TpB4\/jJHoMub2koqnxbpXt4MaaygHkbElak5s5V13B+plq+F8yHHMfrIXN2lR16M9d2GDRZEvVXmrqHNmg1ladNnHi8w2j6A1hz685S4iuYaVUGZQ2nAPBC27BNeSUURKCXbKMzinsOawZSSNsFUrDhdIeOMNSPNSJGvf5K\/9dHKNAnPle+seTvqdKQjaj2azLxESfFzg3z9WQHrYYxHgnvRBQvhywJ3L5xwQ00n2DNryXcTgtY1ZfMATKDdrsrmH0p+nbrFtf5lhJv1\/wUzbdGc66kJE3qjhXmus0yAD1nvzNPkxtCNYfCUYMwLo2Sf59q4JE+IwDkxQqQ9+us6XKUwXR7fl9FnDciWX2NrxuYg0z1ZiyEpzBtQCKxSGV2OY+XEDyHuxCK+aSKAr\/UmHBW7Ebxl\/3oUXO8Mo\/7m3BcYMPzYJVYKEDoT\/1QK6FRGARDscwsxMx1JO8FYIKGTJpC1th9N9cK9iYMwocXLFjc4LWUdu\/wAtEjaBb\/uDa+sXx7UGteSCJ2Vx1n4dSBYtoRPunV9NDeCwUZ9yeAJM\/t6lgOy3xs61R4r6bit9NtnvUV7V8\/rGPdpjg4npOE5HXwyf7z+D7gNZa+E6MrDy5I+Oc8Igu31cwKfBfxsmleYBi5LNkzhPwmMW0FSqVpRQ9Kjw6bmOPwfYo\/Uo8b9t7pjRS3hlPVN5s5LdJ6fVZAioOi4iW8z5jt2FTMK45WF5TqxfnRFkYqnNU9yB\/t59RJ2oKQVYkOOzj+W22pTdVPkQILnatH9JBZxoJHF07Izx3bFo3ZV9aavMPKz3iE+uiXMbwhpk90PMt6ZOuld9D6Akrw9nWLYCVeboVG7PpoJc6SPYGrlRoOXY+T594iAioFTEZW4AJw4\/Q+lyHW+oJXB\/paE\/zc+AIzIs5aq\/niq3+4cvL5hUl6ZF+zPybMjfEDwXhFzgSbr0ZeqTT0t2xi\/ilHTwcXug3RSemK6t+Glo1DFBuitS7qO4oOBCpFl37FUzKOUUik4KgfuexNJLLqvS+7viX3GFyZdI9EQEw+lsqPhkNoCLBo52J3gcHiIaUPxBOiguerADiiCrQzovtakkKLzNvdNusmIkPkooKIrpz2vZpW+2aDySj5ZEt063iBNcEi3bi+xj3SC97HvLyCDHT18u7JSKU6KsjZ73lnzIhICKoj6alV9YZIvBTAeUBY1PLJE5kknbRzq6WR7iw0A5PkqaYnd\/qw5dFtGazhRZuchMPiegTPrg+F4s6uheU45x4pEZn2gyFGvHX6LN9lQpszDkVMpeOAZvAIvUQ4GOuDtTj+pwVcIeUtEgWvScYo3FHeYtYJNS36OeaJdrCHUe8JIWRcC+VaB2ti3BuINpoPP3yHoJWD9r1zTwGfwy8IAC35TH9zoQXDIOQF04ZRorDSrjYxx1CBs8wJyLJI9ej3JWaUhchT7IqT4xFKa04YLbGJMb3pBsrzEQNDnudOQpkN+4TEubkOSjUef3kV23I8TzhNS0pr+oI7jYqPEckr5Ojxy4vya973iE7dKJx4cSdNuufr3gi0oPl4npOE5HXwydD8NawZRVcGO4aEPHeYbPcZNXETJBTcAZIkwAh1taNIXvUIXTEER2XK6qQ0Wb4HfzYzj2kzPXamRlsHfZo0iIcnsxov+hPz\/8c2xCrPkP8YK57Afcn0z\/B\/eEu2si270EWElpHuVNDNaxMMAWYlkmdtEN5hoKQxhyCws0uxN6P6b\/5OcKfYyEYyd1GyJf5M+\/n8vrXiRMKRpNxPdBDjJ8DZfY2vG5iDTNdoCJXPJBEXxhuuKKDmUe3OH\/QpYrw6QDCn3I1PUrH1xWxHiBm2ppmfnOKyssPG5t4UpCr21FDI\/rtKX9uZry4cdtI0UeYfhppHatHNQSFHHeRtVRxC8WJVsWl8uSuWNh4nTa7kwfExMyaYwq3kYnHi7r3sqTn4MM=",
            "responsetoken":null},
            "status":"success"
        }
    };