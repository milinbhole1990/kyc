pragma solidity ^0.4.18;

contract eKYC {
    
   struct Customer {
		string uname;
	    string customerName;
		string gender;
		string nationality;
		string kycIPFSFileHash;
		uint256 currentKycDate;
		}
    
    mapping (address=>Customer) customers;
    address[] customerAddress;
    
    struct Organisation {
		string uname;
        string organisationName;
		string organisationCategory;
    }
    
    mapping (address=>Organisation) organisations;
    address[] organisationAddress;
    
    struct KYCViewHistory
	{
	    uint256 viewDate;
		string organisationUname;
		string customerUname;
	}
	
	struct KYCRequestHistory
	{
	    uint256 date;
		string organisationUname;
		string customerUname;
		bool grantFlag;
		bool requestPendingFlag;
		uint256 grantOrDenyDate;
	}
	
	struct KYCUpdateHistory
	{
		string customerUname;	
	    uint256 kycDate;
		string kycIPFSFileHash;
		string gender;
		string nationality;
	}
    
    mapping (address=>KYCUpdateHistory[]) customerKYCUpdateHistory;
	mapping (address=>KYCViewHistory[]) customerKYCViewHistory;
	mapping (address=>KYCRequestHistory[]) customerKYCRequestHistory;
	
	mapping (address=>KYCViewHistory[]) organisationKYCViewHistory;	
	mapping (address=>KYCRequestHistory[]) organisationKYCRequestHistory;
    
    
   function stringsEqual(string storage _a, string memory _b) internal returns (bool) {
		bytes storage a = bytes(_a);
		bytes memory b = bytes(_b);
		if (a.length != b.length)
			return false;
			
		for (uint i = 0; i < a.length; i ++)
        {
			if (a[i] != b[i])
				return false;
        }
		return true;
	}
	
	function memoryStringsEqual(string memory _a, string memory _b) internal returns (bool) {
		bytes memory a = bytes(_a);
		bytes memory b = bytes(_b);
		if (a.length != b.length)
			return false;
			
		for (uint i = 0; i < a.length; i ++)
        {
			if (a[i] != b[i])
				return false;
        }
		return true;
	}
	
	function registerCustomer( address ethAddress, string uname, string customerName) public payable returns(string) {
		Customer storage customer = customers[ethAddress];
        customer.uname = uname;
        customer.customerName = customerName;
        customerAddress.push(ethAddress) -1;
		return "Customer Registered Successfully";
    }
	
	function checkCustomer(string uname) public payable returns(address) {
        for(uint i = 0; i < customerAddress.length; ++ i) {
            if(stringsEqual(customers[customerAddress[i]].uname, uname)) {
                return customerAddress[i];
            }
        }
        return 0x0;
    }
    
    function viewCustomer(address accAddress) public payable returns(string,string,string,string,string) {
       	Customer storage customer = customers[accAddress];
       	return (customer.customerName,customer.uname,customer.kycIPFSFileHash,customer.gender,customer.nationality);
    }
    
    function updateCustomer( address ethAddress, string uname, string customerName, string gender, string nationality, string fileHash) public payable returns(string) {
		Customer storage customer = customers[ethAddress];
        customer.uname = uname;
        customer.customerName = customerName;
        customer.gender = gender;
		customer.nationality = nationality;
		customer.kycIPFSFileHash = fileHash;
		customerKYCUpdateHistory[ethAddress].push(KYCUpdateHistory(customer.uname,now,fileHash,gender,nationality));
		return "Customer Updated Successfully";
    }
    
    function registerOrganisation( address ethAddress, string uname, string organisationName, string organisationCategory) public payable returns(string) {
		Organisation storage organisation = organisations[ethAddress];
        organisation.uname = uname;
        organisation.organisationName = organisationName;
        organisation.organisationCategory = organisationCategory;
        organisationAddress.push(ethAddress) -1;
		return "Organisation Registered Successfully";
    }
    
    function loginOrganization(address accAddress) public payable returns(string,string) {
       Organisation storage organisation = organisations[accAddress];
       	return (organisation.uname,organisation.organisationName);
    }
    
    function checkOrganization(string uname) public payable returns(address) {
        for(uint i = 0; i < organisationAddress.length; ++ i) {
            if(stringsEqual(organisations[organisationAddress[i]].uname, uname)) {
                return organisationAddress[i];
            }
        }
        return 0x0;
    }
	
	function viewOrRequestCustomerKyc(address ethAddress, string customerUname) public payable returns(string) 
	{
		KYCRequestHistory[] storage organisationKYCRequestHistoryList = organisationKYCRequestHistory[ethAddress];
		for(uint i = 0; i < organisationKYCRequestHistoryList.length; ++ i)
		{
			if(stringsEqual(organisationKYCRequestHistoryList[i].customerUname, customerUname)) {
                if(organisationKYCRequestHistoryList[i].requestPendingFlag)
				{
					return "Request is Pending. Contact Customer to Approve the Request";
				}
			}
			
		}
		customerKYCRequestHistory[checkCustomer(customerUname)].push(KYCRequestHistory(now,organisations[ethAddress].uname,customerUname,false,true,0));
		organisationKYCRequestHistory[ethAddress].push(KYCRequestHistory(now,organisations[ethAddress].uname,customerUname,false,true,0));
		
		return "Request to View KYC Submitted to Customer";
		
	}
	
    function getCountOfEntriesForIteration(address ethAddress, string userType, string countType) public payable returns(uint count) {
		if(memoryStringsEqual('ORG',userType))
		{
			if(memoryStringsEqual('KYCViewHistory',countType))
			{
				return organisationKYCViewHistory[ethAddress].length;
			}
			else if(memoryStringsEqual('KYCRequestHistory',countType))
			{
				return organisationKYCRequestHistory[ethAddress].length;
			}
		}
		else if(memoryStringsEqual('CUST',userType))
		{
			if(memoryStringsEqual('KYCViewHistory',countType))
			{
				return customerKYCViewHistory[ethAddress].length;
			}
			else if(memoryStringsEqual('KYCRequestHistory',countType))
			{
				return customerKYCRequestHistory[ethAddress].length;
			}
			else if(memoryStringsEqual('KYCUpdateHistory',countType))
			{
				return customerKYCUpdateHistory[ethAddress].length;
			}
		}
		return 0;
	}
	
	
	 function getKYCUpdateHistory(address ethAddress, uint index) public payable returns(string,uint256,string,string,string){
	     KYCUpdateHistory[] storage history = customerKYCUpdateHistory[ethAddress];
	     return (history[index].customerUname,history[index].kycDate,history[index].kycIPFSFileHash,history[index].gender,history[index].nationality);
	 }
	 
	 function getRequestHistory(address ethAddress, string userType, uint index) public payable returns(uint256,string,string,bool,bool,uint256){
	    KYCRequestHistory[] storage history;
	    if(memoryStringsEqual('CUST',userType)){
	        history = customerKYCRequestHistory[ethAddress];
	    } else if(memoryStringsEqual('ORG',userType)){
	       history = organisationKYCRequestHistory[ethAddress];
	    }
	     return (history[index].date,history[index].organisationUname,history[index].customerUname,history[index].grantFlag,history[index].requestPendingFlag,history[index].grantOrDenyDate);
	 }
	 
	 function getViewHistory(address ethAddress, string userType, uint index) public payable returns(uint256,string,string){
	     KYCViewHistory[] storage history;
	      if(memoryStringsEqual('CUST',userType)){
	        history = customerKYCViewHistory[ethAddress];
    	  } else if(memoryStringsEqual('ORG',userType)){
    	        history = organisationKYCViewHistory[ethAddress];
    	  }
	     return (history[index].viewDate,history[index].organisationUname,history[index].customerUname);
	 }
	 
	 function checkViewOrRequestCustomerKyc(address ethAddress, string customerUname) public payable returns(uint) 
	 {
		KYCRequestHistory[] storage organisationKYCRequestHistoryList = organisationKYCRequestHistory[ethAddress];
		for(uint i = 0; i < organisationKYCRequestHistoryList.length; ++ i)
		{
			if(stringsEqual(organisationKYCRequestHistoryList[i].customerUname, customerUname)) {
                if(organisationKYCRequestHistoryList[i].requestPendingFlag)
				{
					return 0;
				}
				else if(organisationKYCRequestHistoryList[i].grantFlag)
				{
					return 1;
				}
			}
		}
		return 2;
	 }
	 
	 function organisactionViewCustomerKyc(address ethAddress, string customerUname) public payable returns(string,string,string,string) 
	{
		KYCRequestHistory[] storage organisationKYCRequestHistoryList = organisationKYCRequestHistory[ethAddress];
		for(uint i = 0; i < organisationKYCRequestHistoryList.length; ++ i)
		{
			if(stringsEqual(organisationKYCRequestHistoryList[i].customerUname, customerUname)) {
                if(organisationKYCRequestHistoryList[i].grantFlag)
				 {
					customerKYCViewHistory[checkCustomer(customerUname)].push(KYCViewHistory(now,organisations[ethAddress].uname,customerUname));
					organisationKYCViewHistory[ethAddress].push(KYCViewHistory(now,organisations[ethAddress].uname,customerUname));
					Customer storage customer = customers[checkCustomer(customerUname)];
					return (customer.customerName,customer.gender,customer.nationality,customer.kycIPFSFileHash);
				 }
			}
			
		}
		return("null","null","null","null");
		
	}
	
	function approveOrRejectCustomerKycViewRequest(string organisationUname, address apprAddress, bool grantFlag) public payable returns(string) 
	{
		KYCRequestHistory[] storage customerKYCRequestHistoryList = customerKYCRequestHistory[apprAddress];
		for(uint i = 0; i < customerKYCRequestHistoryList.length; ++ i)
		{
			if(stringsEqual(customerKYCRequestHistoryList[i].organisationUname, organisationUname)) {
                if(customerKYCRequestHistoryList[i].requestPendingFlag)
				{
					customerKYCRequestHistoryList[i].requestPendingFlag = false;
					customerKYCRequestHistoryList[i].grantFlag = grantFlag;
					customerKYCRequestHistoryList[i].grantOrDenyDate = now;
					
					KYCRequestHistory[] storage organisationKYCRequestHistoryList = organisationKYCRequestHistory[checkOrganization(organisationUname)];
					for(uint j = 0; j < organisationKYCRequestHistoryList.length; ++ j)
					{
						if(stringsEqual(organisationKYCRequestHistoryList[i].customerUname, customerKYCRequestHistoryList[i].customerUname))
						{
							organisationKYCRequestHistoryList[j].requestPendingFlag = false;
							organisationKYCRequestHistoryList[j].grantFlag = grantFlag;
							organisationKYCRequestHistoryList[j].grantOrDenyDate = now;	
							
							break;
						}
					}
					if(grantFlag)
						return "Request Approved Successfully";
					else
						return "Request Rejected Successfully";
				}
			}
			
		}

		return "No Such Request Pending";
		
	}

}