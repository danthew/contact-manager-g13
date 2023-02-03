<?php
//Given: First Name, Last Name, Login, Password
//Remaining attributes will be updated automatically due to the nature of how Users is set up
$inData = getRequestInfo();
$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
$firstName = $inData["firstName"];
$lastName = $inData["lastName"];
$login = $inData["login"];
$password = $inData["password"];

if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    $checkstmt = $conn->prepare(sprintf('select * from Users where Login = "%s"', $inData["login"]));
    $checkstmt->execute();
    $checkresult = $checkstmt->get_result();
    $r = mysqli_fetch_row($checkresult);
    if ($r != null) {
        returnWithError("ERROR: User already exists");
    } else {
        $stmt = $conn->prepare("INSERT into Users (FirstName,LastName,Login,Password) VALUES(?,?,?,?)");
        $stmt->bind_param("ssss", $firstName, $lastName, $login, $password);
        $stmt->execute();

        $stmt->close();
        $conn->close();
        $checkstmt->close();
        returnWithError("N/A");
    }
}
function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}
function returnWithError($err)
{
    $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}
function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo $obj;
}
?>