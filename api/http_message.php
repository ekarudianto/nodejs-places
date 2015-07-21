<?php
/**
 * HttpMessage Class
 * contains several collection of HTTP responses
 *
 * @author ekarudianto
 */
class HttpMessage {
    
    /*
     * getSTatusCode
     * 
     * used to send xhr resposne api request
     * =====================================
     */
    
    public function getStatusCode($code) {
        return http_response_code($code);
    }
    
    /*
     * sendResposne
     * 
     * used to send server results to the client
     * =========================================
     */

    public function sendResponse($code, $msg, $data) {

        switch ($code) {
            case 200:
                return array(
                    "httpCode" => 200,
                    "message" => $msg,
                    "data" => $data
                );
                break;
            case 400:
                return array(
                    "httpCode" => 400,
                    "message" => $msg,
                    "data" => $data
                );
                break;
            case 404:
                return array(
                    "httpCode" => 404,
                    "message" => $msg,
                    "data" => $data
                );
                break;
            case 405:
                return array(
                    "httpCode" => 405,
                    "message" => $msg,
                    "data" => $data
                );
                break;
            case 401:
                return array(
                    "httpCode" => 401,
                    "message" => $msg,
                    "data" => $data
                );
                break;
            case 408:
                return array(
                    "httpCode" => 408,
                    "message" => $msg,
                    "data" => $data
                );
                break;
            case 501:
                return array(
                    "httpCode" => 501,
                    "message" => $msg,
                    "data" => $data
                );
                break;
        }
        
    }

}
