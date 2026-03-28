<?php

namespace App\Enums;

enum UserRole: string
{
    case CLIENT = 'CLIENT';
    case INFLUENCER = 'INFLUENCER';
    case STORE = 'STORE';
    case ADMIN = 'ADMIN';
    case SHIPPING_COMPANY = 'SHIPPING_COMPANY';
    case SHIPPING_EMP = 'SHIPPING_EMP';
}