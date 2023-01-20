<?php
//A contact needs to have the following: Name, Phone, Email, and DOB
//The user logged in's ID will populate the userID section, so we know it is the contact of that person
// Notes on DOB: Front end will have to send the data from a DateBox to MM/DD/YYYY format
$inData = getRequestInfo();

$id = $inData["id"];

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
if ($conn->connect_error) 
{
    returnWithError( $conn->connect_error );
} 
else
{
    $str = sprintf("DELETE FROM Contacts WHERE ID=%d",$id);
    $stmt = $conn->prepare($str);
    $stmt->execute();
    $stmt->close();
    $conn->close();
    echo sprintf("Contact which had id of %d deleted",$id);
    //for front end: might need a refresh here to make sure new ID doesnt get deleted, though try testing to see
    returnWithError("");
}

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function returnWithError( $err )
{
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson( $retValue );
}
function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}

?>