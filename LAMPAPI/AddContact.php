<?php
//A contact needs to have the following: Name, Phone, Email, and DOB
//The user logged in's ID will populate the userID section, so we know it is the contact of that person
// Notes on DOB: Front end will have to send the data from a DateBox to MM-DD-YYYY format
$inData = getRequestInfo();

$name = $inData["name"];
$phone = $inData["phone"];
$email = $inData["email"];
$userId = $inData["userId"];
$server = $inData["server"];

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
if ($conn->connect_error) {
	returnWithError($conn->connect_error);
} else {
	$stmt = $conn->prepare("INSERT into Contacts (Name,Phone,Email,UserID,Server,Photo) VALUES(?,?,?,?,?,0)");
	$stmt->bind_param("sssds", $name, $phone, $email, $userId, $server);
	$stmt->execute();
	$stmt->close();
	$conn->close();
	returnWithError("N/A");
}

function getRequestInfo()
{
	return json_decode(file_get_contents('php://input'), true);
}

function returnWithError($err)
{
	$retValue = '{"error":"' . $err . '"}';
	sendResultInfoAsJson($retValue);
}
function sendResultInfoAsJson($obj)
{
	header('Content-type: application/json');
	echo $obj;
}
?>