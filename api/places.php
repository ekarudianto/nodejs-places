<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

include "connection.php";
include "http_message.php";
include "constant.php";

class Places {

    private $id, $name, $description, $lat, $lng;
    private $db, $HttpMessage;

    public function __construct() {
        $this->dbConnection = new Connection("localhost", "root", "", "places");
        $this->HttpMessage = new HttpMessage();

        $this->index();
    }

    /*
     * setHeaders
     * 
     * used to set the resposne headers of the api request
     * ===================================================
     */

    private function setHeaders($method) {
        header('Content-Type: application/json; charset=utf-8');
        header('Access-Control-Allow-Methods: ' . $method);
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    }

    /*
     * index
     * 
     * used to determine what request method that client sent to the server
     * ====================================================================
     */

    private function index() {
        switch ($_SERVER["REQUEST_METHOD"]) {
            case "POST":
                $this->post();
                break;
            case "GET":
                $this->get();
                break;
            case "PUT":
                $this->put();
                break;
            case "DELETE":
                $this->delete();
                break;
        }
    }

    private function get() {
        $this->setHeaders("GET");
        $this->HttpMessage->getStatusCode(405);
        $response = $this->HttpMessage->sendResponse(405, HTTP_405, null);

        /*
         * get record based on query string ?id
         * ====================================
         */

        if (isset($_GET['id'])) {

            $sql = "select * from places where id=" . $_GET['id'];
            $sql = mysql_query($sql, $this->dbConnection->connect());
            $num = mysql_num_rows($sql);
            $datas = array();

            if ($num > 0) {

                while ($row = mysql_fetch_array($sql)) {
                    $datas = array(
                        "id" => $row["id"],
                        "name" => $row["name"],
                        "description" => $row["description"],
                        "lat" => $row["lat"],
                        "lng" => $row["lng"]
                    );
                }

                $this->HttpMessage->getStatusCode(200);
                $response = $this->HttpMessage->sendResponse(200, HTTP_200, $datas);
            } else {

                $this->HttpMessage->getStatusCode(404);
                $response = $this->HttpMessage->sendResponse(404, HTTP_404, null);
            }
        }

        /*
         * get all of the records
         * ======================
         */ else {

            $sql = "select * from places";
            $sql = mysql_query($sql, $this->dbConnection->connect());
            $num = mysql_num_rows($sql);
            $datas = array();

            if ($num > 0) {
                while ($row = mysql_fetch_array($sql)) {
                    $datas[] = array(
                        "id" => $row["id"],
                        "name" => $row["name"],
                        "description" => $row["description"],
                        "lat" => $row["lat"],
                        "lng" => $row["lng"]
                    );
                }
            }

            $this->HttpMessage->getStatusCode(200);
            $response = $this->HttpMessage->sendResponse(200, HTTP_200, $datas);
        }

        echo json_encode($response, JSON_PRETTY_PRINT);
    }

    private function post() {

        $this->setHeaders("POST");
        $this->HttpMessage->getStatusCode(405);
        $response = $this->HttpMessage->sendResponse(405, HTTP_405, null);

        if (strlen(file_get_contents("php://input")) > 0) {

            $json = json_decode(file_get_contents("php://input"));

            if ($json) {

                $this->name = (isset($json->name)) ? $json->name : "";
                $this->description = (isset($json->description)) ? $json->description : "";
                $this->lat = (isset($json->lat)) ? $json->lat : "";
                $this->lng = (isset($json->lng)) ? $json->lng : "";

                $sql = "insert into places (name, description, lat, lng) values ('$this->name', '$this->description', '$this->lat', '$this->lng');";
                $sql = mysql_query($sql, $this->dbConnection->connect());

                if ($sql) {

                    $last_id = mysql_insert_id();
                    $sql = "select * from places where id=" . $last_id;
                    $sql = mysql_query($sql, $this->dbConnection->connect());
                    $result = array();

                    if (mysql_num_rows($sql) > 0) {
                        while ($row = mysql_fetch_array($sql)) {
                            $result = array(
                                "id" => $row["id"],
                                "name" => $row["name"],
                                "description" => $row["description"],
                                "lat" => $row["lat"],
                                "lng" => $row["lng"]
                            );
                        }
                    }

                    $this->HttpMessage->getStatusCode(200);
                    $response = $this->HttpMessage->sendResponse(200, HTTP_200, $result);
                } else {

                    $this->HttpMessage->getStatusCode(400);
                    $response = $this->HttpMessage->sendResponse(400, HTTP_400, null);
                }

                $this->dbConnection->closeConnection();
            } else {

                $this->HttpMessage->getStatusCode(400);
                $response = $this->HttpMessage->sendResponse(400, HTTP_400, null);
            }
        }

        echo json_encode($response, JSON_PRETTY_PRINT);
    }

    private function put() {

        $this->setHeaders("PUT");
        $this->HttpMessage->getStatusCode(405);
        $response = $this->HttpMessage->sendResponse(405, HTTP_405, null);
        $json = file_get_contents("php://input");

        if (isset($_GET["id"]) && file_get_contents("php://input") !== false) {

            $json = json_decode($json);

            if ($json) {

                $this->name = (isset($json->name)) ? $json->name : "";
                $this->description = (isset($json->description)) ? $json->description : "";
                $this->lat = (isset($json->lat)) ? $json->lat : "";
                $this->lng = (isset($json->lng)) ? $json->lng : "";

                $sql = "update places set name='$this->name', description='$this->description', lat='$this->lat', lng='$this->lng' where id=" . $_GET["id"];
                $sql = mysql_query($sql, $this->dbConnection->connect());

                if ($sql) {

                    $result = array(
                        "id" => $_GET["id"],
                        "name" => $this->name,
                        "description" => $this->description,
                        "lat" => $this->lat,
                        "lng" => $this->lng
                    );

                    $this->HttpMessage->getStatusCode(200);
                    $response = $this->HttpMessage->sendResponse(200, HTTP_200, $result);
                } else {

                    $this->HttpMessage->getStatusCode(400);
                    $response = $this->HttpMessage->sendResponse(400, HTTP_400, null);
                }
            } else {

                $this->HttpMessage->getStatusCode(400);
                $response = $this->HttpMessage->sendResponse(400, HTTP_400, null);
            }
        }

        echo json_encode($response, JSON_PRETTY_PRINT);
    }

}

$places = new Places();
?>