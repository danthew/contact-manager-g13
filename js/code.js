const urlBase = 'http://COP4331-g13.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let index = 0;
let editTarget = 0;
let con = "";
function doLogin() {
	userId = 0;
	firstName = "";
	index = 0;

	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
	//      var hash = md5( password );

	document.getElementById("loginResult").innerHTML = "";

	let tmp = { login: login, password: password };
	//      var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify(tmp);

	console.log(jsonPayload);

	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);
				userId = jsonObject.id;

				if (userId < 1) {
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}

				firstName = jsonObject.firstName;

				saveCookie();

				window.location.href = "cop4331_home.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("loginResult").innerHTML = err.message;
	}

}
function validate(fName, lName, uN, pw) {

	let fNameVal = /[a-zA-Z]/;
	let lNameVal = /[a-zA-Z]/;
	let userNVal = /[a-zA-Z0-9]/;
	let passWVal = /(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,}/;
	console.log(fName);
	console.log(lName);
	console.log(uN);
	console.log(pw);

	if (!fNameVal.test(fName)) {
		alert("The first name field requires the use of alphabetical characters only.");
		return false;
	}
	if (!lNameVal.test(lName)) {
		alert("The last name field requires the use of alphabetical characters only.");
		return false;
	}
	if (!userNVal.test(uN)) {
		alert("The username field requires the use of alphanumeric characters only and must have at least 8 characters.");
		return false;
	}
	if (!passWVal.test(pw)) {
		alert("The password field requires the use of at least one number and special character and must have at least 8 characters.");
		return false;
	}
	return true;
}
function doRegister() {

	const fName = document.getElementById("loginFirst").value;
	const lName = document.getElementById("loginLast").value;
	const uN = document.getElementById("registerName").value;
	const pw = document.getElementById("registerPassword").value;

	if (!validate(fName, lName, uN, pw)) {
		return;
	}

	let payload = {
		firstName: fName,
		lastName: lName,
		login: uN,
		password: pw
	};

	let jsonPayload = JSON.stringify(payload);

	let url = urlBase + '/Register.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);
				let error = jsonObject.error;
				if (error != 0) {
					window.alert("User is taken.");
				}

				//                      window.alert("You have registered successfully");
				window.location.href = "cop4331_home.html";
			}

		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

//SubmitEvent.addEventListener('click', register);

function saveCookie() {
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime() + (minutes * 60 * 1000));
	document.cookie = "firstName=" + firstName + "index" + index + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie() {
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for (var i = 0; i < splits.length; i++) {
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if (tokens[0] == "firstName") {
			firstName = tokens[1];
		}
		else if (tokens[0] == "index") {
			index = tokens[1];
		}
		else if (tokens[0] == "userId") {
			userId = parseInt(tokens[1].trim());
		}
	}

	/*if( userId < 0 )
	{
			window.location.href = "index.html";
	}
	else
	{
			document.getElementById("userName").innerHTML = "Logged in as " + firstName;
	}*/
}

function doLogout() {
	userId = 0;
	firstName = "";
	index = 0;
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addContact() {
	let fullname;
	let DOB;
	let emailAdd;
	let phoneNumber;

	fullname = document.getElementById("contactName").value;
	DOB = document.getElementById("contactDOB").value;
	emailAdd = document.getElementById("contactEmail").value;
	phoneNumber = document.getElementById("contactPhone").value;

	readCookie();

	let payload = {
		userId: userId,
		name: fullname,
		server: DOB,
		email: emailAdd,
		phone: phoneNumber
	};

	console.log(payload);

	if (payload.id == "" || payload.name == "" || payload.server == "" || payload.email == "" || payload.phone == "") {
		window.alert("Please fill out all required fields!");
		return;
	}

	let newContact = JSON.stringify(payload);

	let url = urlBase + '/AddContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {

		//xhr.send(payload);
		console.log(payload);

		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);
				saveCookie();
				window.alert("Contact created successfully!");
				window.location.href = "cop4331_home.html";
			}
		}

		xhr.send(newContact);
	}
	catch (err) {
		alert("Something went wrong. PLease check the information entered is correct and try again.")
	}
}

function editPage(target) {
	editTarget = target;
	window.location.href = "cop4331_edit_contact.html";
}

function addPage() {
	window.location.href = "cop4331_add_contact.html";
}

function back() {
	window.location.href = "cop4331_home.html";
}

function editContact() {
	let fullname;
	let DOB;
	let email;
	let phoneNumber;

	fullname = document.getElementById("contactName").value;
	DOB = document.getElementById("contactDOB").value;
	email = document.getElementById("contactEmail").value;
	phoneNumber = document.getElementById("contactPhone").value;

	readCookie();

	let payload = {
		userId: userId,
		name: fullname,
		server: DOB,
		email: email,
		phone: phoneNumber
	};

	console.log(payload);

	if (payload.id == "" || payload.fn == "" || payload.birthday == "" || payload.em == "" || payload.pn == "") {
		window.alert("Please fill out all required fields!");
		return;
	}

	let url = urlBase + '/EditContact.' + extension;

	let editedContact = JSON.stringify(payload);

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {

		//xhr.send(payload);
		console.log(payload);

		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);
				saveCookie();
				window.alert("Contact edited successfully!");
				window.location.href = "cop4331_home.html";
			}
		}
		xhr.send(editedContact);
	}
	catch (err) {
		alert("Something went wrong. PLease check the information entered is correct and try again.")
	}
}

function extract(contacts) {
	con = contacts;
}

function listContacts(addBy) {
	//next button makes addBy = 1
	//reprinting the page makes addBy = 0
	//back button makes addBy = -1
	//using the search button sets index = 0, search = {search crit}

	//on opening the user page we are going to run the script with addBy = 0

	//if index-1 < 0, we hide the back button
	readCookie();
	index += addBy;
	//get whatever is in search
	search = document.getElementById("search");
	console.log(search);
	//we fetch the list of users based on search criterion (if applicable), current index+addBy, and the userId and sending it all to the php script
	//on return we will have a list of json objects

	let payload;


	if (search == null) {
		payload = {
			userId: userId,
			search: "",
			index: index
		};
	}
	else {
		payload = {
			userId: userId,
			search: search,
			index: index
		};
	}
	console.log("payload: " + payload);

	let r = JSON.stringify(payload);

	let url = urlBase + '/ListContacts.' + extension;
	let xhr = new XMLHttpRequest();


	//then run a for loop that runs through our current 5 showing users placing the information that we have received from the php query
	//ensure that the edit and delete query are aware of a contact's id
	//if there is less than 5 results from php, we hide the user cards that we do not need to se

	document.addEventListener("DOMContentLoaded", function (event) {

		let contacts = "tt";
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

		try {

			xhr.send(r);
			console.log(r);
			//this is asynchronous
			xhr.onreadystatechange = function () {
				if (this.readyState == 4 && this.status == 200) {
					contacts = JSON.parse(xhr.responseText);
					//save cookie of new index
					saveCookie();
					console.log("contacts:" + con);


					let inc = 0;
					for (inc; inc < 5; inc++) {
						console.log(inc + " " + contacts[0].name);
						document.getElementById("contactName" + (inc + 1)).innerHTML = contacts[inc].name;
						document.getElementById("contactDOB" + (inc + 1)).innerHTML = contacts[inc].server;//fix to server when august does so
						document.getElementById("contactPhone" + (inc + 1)).innerHTML = contacts[inc].phone;
						document.getElementById("contactEmail" + (inc + 1)).innerHTML = contacts[inc].email;

					}
					//if its less than 5 we hide the rest
					for (inc; inc < 5; inc++) {
						document.getElementById("contactCol" + (inc + 1)).disabled = true;
					}
				}
			};
		}
		catch (err) {
			alert("Something went wrong. PLease check the information entered is correct and try again.")
		}
	});
	//if when we fetch a list and it is less than 5, we hide the next button
	//(aware of the edge case when a user has 5 people, will probably send an error if this is the case so I am aware in the js)



}
