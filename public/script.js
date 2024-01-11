let status = {
	1: "one",
	2: "two",
	3: "three",
	4: "four",
};

let updateUserId = "";
let deleteUserId = "";
let globalUserData = null;

function confirmMessageFunction(mesg) {
	var x = document.getElementById("snackbar");
	x.innerHTML = mesg;
	x.className = "show";
	setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
}

function onload2(userDataFromLS) {

	console.log("Inside onload");
	let formVisibility = document.getElementById("formID");
	formVisibility.style.visibility = "hidden";
	console.log("in add --updted JSOn: ", userDataFromLS);
	var devC = document.getElementById("root");
	var newUserWidget = "";

	for (let i in userDataFromLS.reverse()) {
		var userid = userDataFromLS[i].userid;
		var name = userDataFromLS[i].name;
		var profilePic = userDataFromLS[i].profilePicture;
		var message = userDataFromLS[i].statusMessage;
		var presence = userDataFromLS[i].presence;
		var statusClass = status[presence];

		console.log("statusClass========== ", statusClass);

		newUserblock = `<div id="${userid}" class="user"><div class="img-container"><img src="${profilePic}" class='user-image ${statusClass}'' alt="user image" /></div>
		<div class="user-detail"><p class="user-name">${name}</p><p class="user-message">${message}</p></div><div class='three-btn'><div class="dropdown">
		<a class="" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"><i class="bi bi-three-dots-vertical"></i></a><ul class="dropdown-menu">
		<li><button id="${userid}" onclick='deleteItem("${userid}")'class="dropdown-item ">Delete</button></li><li><button  id="update-${userid}" onclick='updateItem("${userid}")'class="dropdown-item ">Update</button></li></ul></div></div></div>`;
		newUserWidget = newUserWidget + newUserblock;
	}
	devC.insertAdjacentHTML("beforeend", newUserWidget);
}

//function getDataFromServer(){
function onload() {
	console.log("inside getDataFromServer");

	let userJsonData = JSON.parse(localStorage.getItem("user-ls-data"));
	if (userJsonData == null) {
		var url = "http://localhost:8080/buddylistData";
		fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			}
			// body: JSON.stringify(data), // body data type must match "Content-Type" header
		}).then(function (data) {
			data.json().then((res) => {
				console.log("inside then", res);
				localStorage.setItem("user-ls-data", JSON.stringify(res));
				globalUserData = res;
				onload2(res);				
			}).catch((err) => {
				console.log("inside catch1", err);
			});
		}).catch(function (err) {
			console.error("Error");
		});

	} else {
		onload2(userJsonData);
	}


}

function visibileUserForm() {

	document.getElementById("addUserForm").reset();

	document.querySelector(".btn").style.visibility = "visible";
	document.getElementById("updateBtn").style.visibility = "hidden";
	let formVisibility = document.getElementById("formID");
	console.log("Inside visibileUserForm ", formVisibility);
	if ((formVisibility.style.visibility === "hidden") || (formVisibility.style.visibility == "")) {
		console.log("Inside visibileUserForm---1", formVisibility.style.visibility);
		formVisibility.style.visibility = "visible";

	}
}

function addUser() {

	console.log("Inside addUser");

	let userJsonData = JSON.parse(localStorage.getItem("user-ls-data"));
	var userid = generateUserId(userJsonData); // document.getElementById("name").value;
	console.log("userid=================", userid);
	var name = document.getElementById("name").value;
	var profilePic = document.getElementById("profilePicLink").value;
	var message = document.getElementById("statusMessage").value;
	var presence = document.getElementById("presence").value;
	let userstatus = status[presence];

	console.log("statusClass========== ", userstatus);

	console.log("userid :  ", userid, name, profilePic, message, userstatus);

	newUserJsonObject = { "userid": userid, "name": name, "profilePicture": profilePic, "statusMessage": message, "presence": presence };

	newUserblock = `<div class="user" id="${userid}"><div class="img-container"><img src="${profilePic}" class='user-image ${userstatus}' alt="user image" /></div>
		<div class="user-detail"><p class="user-name">${name}</p><p class="user-message">${message}</p></div><div class='three-btn'><div class="dropdown">
		<a class="" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"><i class="bi bi-three-dots-vertical"></i></a><ul class="dropdown-menu">
		<li><button id='${userid}' onclick='deleteItem("${userid}")'class="dropdown-item ">Delete</button></li><li><button  id='update-${userid}' onclick='updateItem("${userid}")'class="dropdown-item ">Update</button></li></ul></div></div></div>`;
	//var newUserWidget = newUserWidget + newUserblock;
	console.log("newUserJsonObject============", newUserJsonObject);
	let userDataFromLS = getUpdatedUserDataJson(newUserJsonObject);

	//let userDataFromLS = JSON.parse(newUserJsonObject);//users_json;
	console.log("in add --updted JSOn: ", userDataFromLS);

	var devC = document.getElementById("root");

	let curretHtml = devC.innerHTML;
	let newHtml = newUserblock + curretHtml;
	document.getElementById("root").innerHTML = newHtml;
	confirmMessageFunction("User addedd successfully!!'");
}

const formatNumberToString = (num, minChars) => {
	return num.toString().length < minChars
		? formatNumberToString(`0${num}`, minChars)
		: num.toString()
};

function generateUserId(userData) {
	let arrIds = [];
	for (let i in userData) {

		arrIds[i] = userData[i].userid;

	}
	let lastId = arrIds[arrIds.length - 1];
	lastId = lastId.substring(3, lastId.length);
	let newId = Number(lastId) + 1;
	let newUserId = "USR" + formatNumberToString(newId, 5);
	console.log("newUserId id : ", newUserId);
	return newUserId;

}

function deleteItem(id) {

	console.log("Inside deleteItem == useid : ", id);

	let userJsonData = JSON.parse(localStorage.getItem("user-ls-data"));
	console.log("JSON:: ", JSON.stringify(userJsonData));

	let objIndex = userJsonData.findIndex((obj => obj.userid == id));
	console.log("Index of ID ---", objIndex);

	userJsonData.splice(objIndex, 1);
	globalUserData = userJsonData;
	localStorage.setItem("user-ls-data", JSON.stringify(userJsonData));
	document.getElementById(id).remove();
	confirmMessageFunction("User deleted successfully!!'");
	//onload();	
	console.log("After deletion::::: :  ", JSON.stringify(userJsonData));

}

function updateItem(id) {

	updateUserId = id;
	document.querySelector(".btn").style.visibility = "hidden";
	let updateBtnVisibility = document.getElementById("updateBtn");
	//console.log("inside updateItem-visible  ------", id);
	updateBtnVisibility.style.visibility = "visible";

	let formVisibility = document.getElementById("formID");
	formVisibility.style.visibility = "visible";

	// pupulate the value
	let userJsonData = JSON.parse(localStorage.getItem("user-ls-data"));
	let objIndex = userJsonData.findIndex((obj => obj.userid == id));
	document.getElementById("name").value = userJsonData[objIndex].name;
	document.getElementById("profilePicLink").value = userJsonData[objIndex].profilePicture;
	document.getElementById("statusMessage").value = userJsonData[objIndex].statusMessage;
	document.getElementById("presence").value = userJsonData[objIndex].presence;

}

function updateUser(id) {
	console.log("inside updateUser ------", updateUserId);
	// pupulate the value
	let userJsonData = JSON.parse(localStorage.getItem("user-ls-data"));
	//console.log("JSON:: ", JSON.stringify(userJsonData));

	let objIndex = userJsonData.findIndex((obj => obj.userid == updateUserId));
	//console.log("Index of ID ---", objIndex);
	//console.log("Data:::---------", userJsonData);

	document.querySelector(".btn").style.visibility = "hidden";

	//update JSOn object and store updated one in localstorage
	userJsonData[objIndex].name = document.getElementById("name").value;
	userJsonData[objIndex].profilePicture = document.getElementById("profilePicLink").value;
	userJsonData[objIndex].statusMessage = document.getElementById("statusMessage").value;
	userJsonData[objIndex].presence = document.getElementById("presence").value;

	//update widget runtime
	let htmlEle = document.getElementById(updateUserId);
	htmlEle.querySelector(".user-name").innerHTML = document.getElementById("name").value;
	htmlEle.querySelector(".user-message").innerHTML = document.getElementById("statusMessage").value;
	htmlEle.querySelector(".user-image").src = document.getElementById("profilePicLink").value;

	let userstatusOld = status[userJsonData[objIndex].presence];
	htmlEle.querySelector(".user-image").classList.remove(userstatusOld);
	let userstatusNew = status[document.getElementById("presence").value];
	htmlEle.querySelector(".user-image").classList.add(userstatusNew);
	globalUserData = userJsonData
	localStorage.setItem("user-ls-data", JSON.stringify(userJsonData));

	confirmMessageFunction("User updated successfully!!'");
	console.log("Completed update User ------");

}

function getUpdatedUserDataJson(newUser) {
	//localStorage.clear();
	let userJsonData = JSON.parse(localStorage.getItem("user-ls-data"));
	if (userJsonData == null) {
		userJsonData = globalUserData;    // if local storage is clear then take the JSON data again from JSON object 
	}
	userJsonData.push(newUser);
	localStorage.setItem("user-ls-data", JSON.stringify(userJsonData)); // Storing JSON data again in localStorage	
	globalUserData = userJsonData;
	return userJsonData;
}