
function Dashboard(obj){
    this.totalUsers = obj == null ? '' : obj.totalUsers;
    this.totalClients = obj == null ? '' : obj.totalClients;
    this.totalContentCreators = obj == null ? '' : obj.totalContentCreators;
    this.totalContents = obj == null ? '' : obj.totalContents;
    this.approvedContents = obj == null ? '' : obj.approvedContents;
    this.pendingContents = obj == null ? '' : obj.pendingContents;
    this.rejectedContents = obj == null ? '' : obj.rejectedContents;
    this.totalDownloads = obj == null ? '' : obj.totalDownloads;
    this.category = obj == null ? '' : obj.category;

}


function Categories(obj){
    this.name = obj == null ? '' : obj.name;
    this.description = obj == null ? '' : obj.description;
    this.fileId = obj == null ? '' : obj.fileId;
    this.userId = obj == null ? '' : obj.userId;
    this._id = obj == null ? '' : obj._id;
    this.image = obj == null ? '' : obj.image;
    this.createdBy = obj == null ? '' : obj.createdBy;
    this.createdAt = obj == null ? '' : obj.createdAt;

}

function ContentType(obj){
    this.name = obj == null ? '' : obj.name;
    this.details = obj == null ? '' : obj.details;
    this.userId = obj == null ? '' : obj.userId;
}

function Content(obj){
    this.createdBy = obj == null ? '' : obj.createdBy;
    this.approveMsg = obj == null ? '' : obj.approveMsg;
    this.rejectMsg = obj == null ? '' : obj.rejectMsg;

}

function User(obj){
    this.createdBy = obj == null ? '' : obj.createdBy;
    this.approveMsg = obj == null ? '' : obj.approveMsg;
    this.rejectMsg = obj == null ? '' : obj.rejectMsg;

}

