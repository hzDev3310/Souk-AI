<?php

namespace App\Enums;

enum NotificationTarget: string
{
    case CLIENT = 'CLIENT';
    case INFLUENCER = 'INFLUENCER';
    case STORE = 'STORE';
    case SHIPPING_COMPANY = 'SHIPPING_COMPANY';
    case SHIPPING_EMP = 'SHIPPING_EMP';
    case USER = 'USER';
}