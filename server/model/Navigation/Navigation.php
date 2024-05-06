<?php

include_once APP_PATH . "/config/Database.php";
include_once APP_PATH . "/model/Navigation/INavigation.php";

class Navigation implements INavigation
{
    private static $table_name = "Navigation";

    public $id;
    public $name;
    public $parent_id;

    public static function GetNavigation($game = null)
    {
        try {

            $selection_info = array(
                "Navigation" => array(
                    "id", "name", "parent_id"
                ),
                "Games" => array(
                    "game"
                )
            );

            $conditions_info = array(
                "Navigation.game_id" => "Games.id"
            );

            if (!is_null($game)) {
                $conditions_info["Games.game"] = "'{$game}'";
            }

            $result = joinTables($selection_info, $conditions_info);

            Response::send_response(RESPONSE_STATUS::OK, 200, $result, "Success");
        } catch (Exception $e) {
            Response::send_response(RESPONSE_STATUS::ERROR, 200, null, "Unable to fetch data from " . self::$table_name);
        }
    }
}
