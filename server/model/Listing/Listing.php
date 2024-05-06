<?php

include_once APP_PATH . "/config/Database.php";
include_once APP_PATH . "/model/Listing/IListing.php";

class Listing implements IListing
{
    private static $table_name = "Listings";

    public $id;
    public $name;
    public $parent_id;

    // ПОЧИНИИТТтьтьтьтьтть
    public static function GetListingFilters($game = "")
    {
        global $formData;

        $filter_ids = htmlspecialchars(strip_tags($formData['filter_ids']));
        try {
            $listings = callProcedure('GetListingFilters', [($game ? "'{$game}'" : "''")]);
            $availableListings = callProcedure('GetAvailableListings', [($game ? "'{$game}'" : "''")]);
            $filter_categories = callProcedure('GetFilterCategoryID', [($filter_ids ? "'{$filter_ids}'" : "''")]);

            // Преобразование строки filter_ids в массив
            $filter_ids_array = explode(", ", $filter_ids);

            $found = [];
            $merged = [];

            foreach($filter_categories as $item)
            {
                $found[$item['filter_category_id']] = [];
            }

            foreach ($filter_ids_array as $id) {
                foreach ($listings as $listing) {
                    if (strval($listing['filter_id']) == strval($id)) {
                        $found[$listing['category_id']][] = $listing['id'];

                        // [ 'id' => $listing['id'],
                        //                 'game' => $listing['game'],
                        //                 'item' => $listing['item'],
                        //                 'seller' => $listing['seller'],
                        //                 'price' => $listing['price'],
                        //                 'url' => $listing['url'],
                        //             ];
                    }
                }
            }

            foreach ($found as $item) {
                $merged = array_merge($merged, $item);
            }

            $intersection = count($found) > 1 ? call_user_func_array('array_intersect', $found) : reset($found);

            $result = [];

            foreach ($availableListings as $item) {
                foreach ($intersection as $filter) {
                    if (strval($item['id']) == strval($filter)) {
                        $result[] = $item;
                    }
                }
            }

            if (empty($result)) {
                Response::send_response(RESPONSE_STATUS::ERROR, 200, [], "No matching records found");
            } else {
                Response::send_response(RESPONSE_STATUS::OK, 200, $result, "Success");
            }
        } catch (Exception $e) {
            Response::send_response(RESPONSE_STATUS::ERROR, 200, null, "Unable to fetch data from " . self::$table_name);
        }
    }
    public static function GetListings($game = "")
    {
        try {
            Response::send_response(RESPONSE_STATUS::OK, 200, callProcedure('GetAvailableListings', [($game ? "'{$game}'" : "''")]), "Success");
        } catch (Exception $e) {
            Response::send_response(RESPONSE_STATUS::ERROR, 200, null, "Unable to fetch data from " . self::$table_name);
        }
    }
}
