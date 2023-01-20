
<?php
//A contact needs to have the following: Name, Phone, Email, and DOB
// How it works: If the contact section has nothing there, we do not edit. If not, we edit based on the ID sent.
$inData = getRequestInfo();

$id = $inData["id"];
$name = $inData["name"];
$phone = $inData["phone"];
$email = $inData["email"];
$dob = $inData["dob"];

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
if ($conn->connect_error || empty($id)) 
{
    returnWithError( $conn->connect_error );
} 
else
{
    $string = "UPDATE Contacts SET";
    if (!empty($name)) {
        $string .= sprintf(" Name = '%s',",$name);
    }
    if (!empty($phone)) {
        $string .= sprintf(" Phone = '%s',",$phone);
    }
    if (!empty($email)) {
        $string .= sprintf(" Email = '%s',",$email);
    }
    if (!empty($dob)) {
        $string .= sprintf(" DOB = '%s',",$dob);
    }

    $string = substr($string, 0, strlen($string) - 1);
    echo ($string);
    $string .= sprintf("WHERE ID = %d;",$id);

    runCommand($string, $conn);
}
function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson( $obj )
{
    header('Content-type: application/json');
    echo $obj;
}
function returnWithError( $err )
{
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson( $retValue );
}

function runCommand ($string, $conn){
    $stmt = $conn->prepare($string);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();
    $conn->close();
    returnWithError("");   
}

?>