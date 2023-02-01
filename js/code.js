const urlBase = 'http://COP4331-g13.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
let editTarget = 0;

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "cop4331_home.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}
function validate(fName, lName, uN, pw) {

	let fNameVal = /^[a-zA-Z\s]$/;
	let lNameVal = /^[a-zA-Z\s]$/;
	let userNVal = /^[a-zA-Z0-9]$/;
	let passWVal = /^(?=.*[0-9])(?=.[!@#$%^&*])[a-zA-Z0-9]!@#$%^&*]{7,}$/;

	if(fNameVal.test(fName.value)) {
		alert("The first name field requires the use of alphabetical characters only.");
		return false;
	}
	if(lNameVal.test(lName.value)) {
		alert("The last name field requires the use of alphabetical characters only.");
		return false;
	}
	if(userNVal.test(uN.value)) {
		alert("The username field requires the use of alphanumeric characters only and must have at least 8 characters.");
		return false;
	}
	if(passWVal.test(pw.value)) {
		alert("The password field requires the use of at least one number and special character and must have at least 8 characters.");
		return false;
	}
	return true;
}
function doRegister() {

	let fName = document.getElementById("loginFirst").value;
	let lName = document.getElementById("loginLast").value;
	let uN = document.getElementById("loginName").value;
	let pw = document.getElementById("loginPassword").value;

	if(!validate(fName, lName, uN, pw)) {
		return;
	}

	let payload = {
		firName: fName,
		lasName: lName,
		useName: uN,
		passWord: pw
	};

	let jsonPayload = JSON.stringify(payload);

	let url = urlBase + '/Register.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );

				
				window.alert("You have registered successfully");
				window.location.href = "cop4331_home.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}
	
}

//SubmitEvent.addEventListener('click', register);

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addColor()
{
	let newColor = document.getElementById("colorText").value;
	document.getElementById("colorAddResult").innerHTML = "";

	let tmp = {color:newColor,userId,userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddColor.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorAddResult").innerHTML = "Color has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorAddResult").innerHTML = err.message;
	}
	
}

function searchColor()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("colorSearchResult").innerHTML = "";
	
	let colorList = "";

	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchColors.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
				
				for( let i=0; i<jsonObject.results.length; i++ )
				{
					colorList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						colorList += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = colorList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}
	
}
function addContact() {
	let fullname;
	let DOB;
	let email;
	let phoneNumber;

	firstName = document.getElementById("contactName").value;
	DOB = document.getElementById("contactDOB").value;
	email = document.getElementById("contactEmail").value;
	phone = document.getElementById("contactPhone").value;

	let userId = localStorage.getItem()

	let payload = {
		id: userId,
		fn: fullname,
		birthday: DOB,
		em: email,
		pn: phoneNumber
	};

	console.log(payload);

	if(payload.id == "" || payload.fn == ""|| payload.birthday == "" || payload.em == "" || payload.pn == "") {
		window.alert("Please fill out all required fields!");
		return;
	}

	let newContact = JSON.stringify(payload);

	let url = urlBase + 'LAMPAPI/addContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try{

		xhr.send(payload);
		console.log(payload);

		xhr.onreadystatechange = function() {
			if(this.readyState == 4 && this.status == 200) {
				window.alert("Contact created successfully!");
				return;
			}
		}
		xhr.send(newContact);
	}
	catch(err) {
		alert("Something went wrong. PLease check the information entered is correct and try again.")
	}
}

function editPage(target)
{
	editTarget = target;
	window.location.href = "cop4331_edit_contact.html";
}

function editContact() {
	let fullname;
	let DOB;
	let email;
	let phoneNumber;

	fullname = document.getElementById("contactName").value;
	DOB = document.getElementById("contactDOB").value;
	email = document.getElementById("contactEmail").value;
	phone = document.getElementById("contactPhone").value;

	let url = urlBase + 'LAMPAPI/editContact.' + extension;

	let payload = {
		id: userId,
		fn: fullname,
		birthday: DOB,
		em: email,
		pn: phoneNumber
	};

	let editedContact = JSON.stringify(payload);

	console.log(payload);

	if(payload.id == "" || payload.fn == "" || payload.birthday == "" || payload.em == "" || payload.pn == "") {
		window.alert("Please fill out all required fields!");
		return;
	}

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try{

		xhr.send(payload);
		console.log(payload);

		xhr.onreadystatechange = function() {
			if(this.readyState == 4 && this.status == 200) {
				window.alert("Contact edited successfully!");
				return;
			}
		}
		xhr.send(editedContact);
	}
	catch(err) {
		alert("Something went wrong. PLease check the information entered is correct and try again.")
	}
}