<?php
//Given: First Name, Last Name, Login, Password
//Remaining attributes will be updated automatically due to the nature of how Users is set up
$inData = getRequestInfo();
$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
$firstName = $inData["firstName"];
$lastName = $inData["lastName"];
$login = $inData["login"];
$password = $inData["password"];

if( $conn->connect_error )
{
        returnWithError( $conn->connect_error );
}
else
{
        $stmt = $conn->prepare("INSERT into Users (FirstName,LastName,Login,Password) VALUES(?,?,?,?)");
        $stmt->bind_param("ssss", $firstName , $lastName, $login, $password);
        $stmt->execute();
        $stmt->close();
        $conn->close();
        echo sprintf("successfully registered user %s",$firstName);
        returnWithError("");
}
function getRequestInfo()
{
        return json_decode(file_get_contents('php://input'), true);
}
function returnWithError( $err )
{
    $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
    sendResultInfoAsJson( $retValue );
}
function sendResultInfoAsJson( $obj )
{
        header('Content-type: application/json');
        echo $obj;
}
?>