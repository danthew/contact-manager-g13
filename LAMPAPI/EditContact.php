<?php
//A contact needs to have the following: Name, Phone, Email, and DOB
// How it works: If the contact section has nothing there, we do not edit. If not, we edit based on the ID sent.
$inData = getRequestInfo();

$id = $inData["id"];
$name = $inData["name"];
$phone = $inData["phone"];
$email = $inData["email"];
$server = $inData["server"];
$photo = $inData["photo"];

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
if ($conn->connect_error || empty($id)) {
    returnWithError($conn->connect_error);
} else {

    $string = "UPDATE Contacts SET";
    $jsonString = "{ ";
    if (!empty($name)) {
        $string .= sprintf(" Name = '%s',", $name);
        $jsonString .= sprintf(' "name":"%s",', $name);
    }
    if (!empty($phone)) {
        $string .= sprintf(" Phone = '%s',", $phone);
        $jsonString .= sprintf(' "phone":"%s",', $phone);
    }
    if (!empty($email)) {
        $string .= sprintf(" Email = '%s',", $email);
        $jsonString .= sprintf(' "email":"%s",', $email);
    }
    if (!empty($server)) {
        $string .= sprintf(" Server = '%s',", $server);
        $jsonString .= sprintf(' "server":"%s",', $server);
    }
    if (!empty($photo)) {
        $string .= sprintf(" Photo = '%d',", $photo);
        $jsonString .= sprintf(' "photo":%d,', $photo);
    }
    $string = substr($string, 0, strlen($string) - 1);
    $jsonString = substr($jsonString, 0, strlen($jsonString) - 1);


    $jsonString .= "}";
    $string .= sprintf("WHERE ID = %d;", $id);

    runCommand($string, $jsonString, $conn);
}
function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError($err)
{
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function runCommand($string, $jsonString, $conn)
{
    $stmt = $conn->prepare($string);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();
    $conn->close();
    sendResultInfoAsJson($jsonString);
}
?>