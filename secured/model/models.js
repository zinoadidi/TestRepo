function Dashboard(obj){
    this.yield_rate = obj == null ? '' : obj.yield_rate;
    this.goals_done = obj == null ? '' : obj.goals_done;
    this.goals_total = obj == null ? '' : obj.goals_total;
    this.goals_pending = obj == null ? '' : obj.goals_pending;
    this.goals_suspended = obj == null ? '' : obj.goals_suspended;
    this.total_withdrawals = obj == null ? '' : obj.total_withdrawals;
    this.net_investment = obj == null ? {
        "AppUserId": "PIV100012",
        "TotalInvestment": 0,
        "AccruedIntrest": 0
    } : obj.net_investment;
    this.fetchWallet = obj == null ? {
        "UserId": "",
        "Amount": 0
    } : obj.fetchWallet;
    this.top_goal = obj == null ? '' : obj.top_goal;
    this.goals = obj == null ? []: obj.goals;
    this.chat_data = obj == null ? {
        "Credit":"",
        "Debit":""
    } : obj.chat_data;

}

function Goal(obj){
    this.GoalId = obj == null ? '' : obj.GoalId;
    this.AppUserId = obj == null ? '' : obj.AppUserId;
    this.ItemName = obj == null ? '' : obj.ItemName;
    this.ItemDescription = obj == null ? '' : obj.ItemDescription;
    this.GoalAmount = obj == null ? '' : obj.GoalAmount;
    this.Duration = obj == null ? '' : obj.Duration;
    this.MonthlyDeduction = obj == null ? '' : obj.MonthlyDeduction;
    this.ProductId = obj == null ? '' : obj.ProductId;
    this.AmountAttained = obj == null ? '' : obj.AmountAttained;
    this.Status = obj == null ? '' : obj.Status;
    this.DateCreated = obj == null ? '' : obj.DateCreated;
    this.GoalType = obj == null ? '' : obj.GoalType;
    this.Day = obj == null ? '' : obj.Day;
    this.Frequency = obj == null ? '' : obj.Frequency;
    this.CardId = obj == null ? '' : obj.CardId;
    this.GoalImage = obj == null ? '' : obj.GoalImage;
    this.NoOfDeductionRemaining = obj == null ? '' : obj.NoOfDeductionRemaining;
    this.IsTopGoal = obj == null ? '' : obj.IsTopGoal;

}


function User(obj){
    this.UserId = obj == null ? '' : obj.UserId;
    this.Firstname = obj == null ? '' : obj.Firstname;
    this.Middlename = obj == null ? '' : obj.Middlename;
    this.BVN = obj == null ? '' : obj.BVN;
    this.BankName = obj == null ? '' : obj.BankName;
    this.BankAccountNo = obj == null ? '' : obj.BankAccountNo;
    this.Address = obj == null ? '' : obj.Address;
    this.Email = obj == null ? '' : obj.Email;
    this.Phonenumber = obj == null ? '' : obj.Phonenumber;
    this.RegistrationDate = obj == null ? '' : obj.RegistrationDate;
    this.Status = obj == null ? '' : obj.Status;
    this.State = obj == null ? '' : obj.State;
    this.ProfilePic = obj == null ? '' : obj.ProfilePic;
    this.MaritalStatus = obj == null ? '' : obj.MaritalStatus;
    this.Gender = obj == null ? '' : obj.Gender;
    this.DOB = obj == null ? '' : obj.DOB;
    this.ProgressStatus = obj == null ? '' : obj.ProgressStatus;
    this.Token = obj == null ? '' : obj.Token;
    this.PRToken = obj == null ? '' : obj.PRToken;
    this.SecurityQuestion = obj == null ? '' : obj.SecurityQuestion;
    this.SecurityAnswer = obj == null ? '' : obj.SecurityAnswer;
    this.Surname = obj == null ? '' : obj.Surname;

}

var payday = {
    user:{}
};

function updateUserData(){
    var data = JSON.parse(sessionStorage.UserInfo);
    payday.user = data['data']
}

var commonData = {
    User:new User(null),
    Dashboard: new Dashboard(null)
}