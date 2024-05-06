<?php

interface IUser
{
    public static function GetUserInfo();
    public static function Login();
    public static function Register();
    public static function ChangePassword();
    public static function ChangeAvatar();
    // public static function GetAvatarImage();
    public static function IsNameAvailable();
    public static function GetPurchases();
    public static function GetTransactions();
    // public static function BuyListing();
    public static function GetCart();
    public static function UpdateTradeLink();
    public static function CartPush();
    public static function CartPop();
    public static function BuyCart();
    public static function ClearCart();
}
