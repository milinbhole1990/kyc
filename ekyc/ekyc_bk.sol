pragma solidity ^0.4.0;


contract ekyc {
    
    string public constant KYC_ADDED = "Kyc Added : ";
    string public constant REQUEST_ADDED = "Request Added : ";
    string public constant AUTHORIZE = "Kyc Authorized by admin";
    string public constant REJECT = "Kyc Rejected by admin";
    string public constant AUTHORIZE_ACTION = "authorize";
    
    struct Account{
        uint accountId;
        string accountName;
        string accountType;
        string password;
        uint kycUploaded;
        uint kycApproved;
        uint pendingRequest;
    }
    
    Account[] accountDetails;
    
    struct Kyc{
        uint kycId;
        string kycName;
        string createdBy;
        string[] allowViewUser;
        bool authorize;
        string dataHash;
        ChangeLog[] changeLogDetails;
    }
    
     struct ChangeLog{
        uint changeId;
        string changeAction;
    }
    
    Kyc[] public kycDetails;
    
    struct Request{
        uint requestId;
        string kycName;
        string requestBy;
        string actionBy;
        string action;
    }
    
    Request[] public requestDetails;
    
    function addAccoutant(string userName, string accountType, string password) public payable returns(uint) {
        accountDetails.length ++;
        accountDetails[accountDetails.length - 1] = Account(accountDetails.length, userName, accountType, password, 0, 0, 0);
        
        return accountDetails.length;

    }
    
    function checkAccount(string userName, string password) public payable returns(bool){
         for(uint i=0; i<accountDetails.length; ++i){
              if(stringsEqual(accountDetails[i].accountName,userName)){
                  if(stringsEqual(accountDetails[i].password,password)){
                      return true;
                  }
              }
         }
         return false;
    }
    
    function addKyc(string kycName, string createdBy, string dataHash) public payable returns(uint) {
        kycDetails.length ++;
        kycDetails[kycDetails.length - 1].kycId = kycDetails.length;
        kycDetails[kycDetails.length - 1].kycName = kycName;
        kycDetails[kycDetails.length - 1].createdBy = createdBy;
        kycDetails[kycDetails.length - 1].allowViewUser.push(createdBy);
        kycDetails[kycDetails.length - 1].authorize = false;
        kycDetails[kycDetails.length - 1].dataHash = dataHash;
        kycDetails[kycDetails.length - 1].changeLogDetails.length++;
        kycDetails[kycDetails.length - 1].changeLogDetails[kycDetails[kycDetails.length - 1].changeLogDetails.length-1].changeId=kycDetails[kycDetails.length - 1].changeLogDetails.length;
        kycDetails[kycDetails.length - 1].changeLogDetails[kycDetails[kycDetails.length - 1].changeLogDetails.length-1].changeAction= concat(KYC_ADDED,kycName);
        
        for(uint i=0; i<accountDetails.length; ++i){
            if(stringsEqual(accountDetails[i].accountName,createdBy)){
                accountDetails[i].kycUploaded++;
            }
        }
        
        return kycDetails.length;

    }
    
    function addRequest(string kycName, string requestBy, string actionBy, string action) public payable returns(uint) {
        requestDetails.length ++;
        requestDetails[requestDetails.length - 1] = Request(requestDetails.length, kycName, requestBy, actionBy, action);
        
        for(uint i=0; i<kycDetails.length; ++i){
            if(stringsEqual(kycDetails[i].kycName,kycName)){
                kycDetails[i].changeLogDetails.length++;
                kycDetails[i].changeLogDetails[kycDetails[i].changeLogDetails.length-1].changeId = kycDetails[i].changeLogDetails.length;
                kycDetails[i].changeLogDetails[kycDetails[i].changeLogDetails.length-1].changeAction = concat(REQUEST_ADDED,kycName);
            }
        }
        
        return requestDetails.length;

    }
    
    function actionRequest(uint requestId, string kycName, string action) public payable returns(bool){
        for(uint i=0; i<requestDetails.length; ++i){
            if(requestDetails[i].requestId == requestId){
                    requestDetails[i].action = action;
                
                    for(uint j=0; j<kycDetails.length; ++j){
                        if(stringsEqual(kycDetails[j].kycName,kycName)){
                             if(stringsEqual(requestDetails[i].action,AUTHORIZE_ACTION)){
                                 kycDetails[j].authorize=true;
                                 kycDetails[j].changeLogDetails.length++;
                                 kycDetails[j].changeLogDetails[kycDetails[j].changeLogDetails.length-1].changeId = kycDetails[j].changeLogDetails.length;
                                 kycDetails[j].changeLogDetails[kycDetails[j].changeLogDetails.length-1].changeAction = AUTHORIZE;
                                 return true;

                             } else {
                                 kycDetails[j].authorize=false;
                                 kycDetails[j].changeLogDetails.length++;
                                 kycDetails[j].changeLogDetails[kycDetails[j].changeLogDetails.length-1].changeId = kycDetails[j].changeLogDetails.length;
                                 kycDetails[j].changeLogDetails[kycDetails[j].changeLogDetails.length-1].changeAction = REJECT;
                                 return false;
                             }
                        }
                    }
                    return false;
            }
        }
    }
    
    function stringsEqual(string storage _a, string memory _b) internal returns (bool) {
    bytes storage a = bytes(_a);
    bytes memory b = bytes(_b);
    if (a.length != b.length)
      return false;
    // @todo unroll this loop
    for (uint i = 0; i < a.length; i ++)
        {
      if (a[i] != b[i])
        return false;
        }
    return true;
  }
    
    function concat(string _base, string _value)
        internal
        returns (string) {
        bytes memory _baseBytes = bytes(_base);
        bytes memory _valueBytes = bytes(_value);

        assert(_valueBytes.length > 0);

        string memory _tmpValue = new string(_baseBytes.length + 
            _valueBytes.length);
        bytes memory _newValue = bytes(_tmpValue);

        uint i;
        uint j;

        for(i = 0; i < _baseBytes.length; i++) {
            _newValue[j++] = _baseBytes[i];
        }

        for(i = 0; i<_valueBytes.length; i++) {
            _newValue[j++] = _valueBytes[i];
        }

        return string(_newValue);
    }
    
}