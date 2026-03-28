<?php

namespace App\Enums;

enum FactureType: string
{
    case STORE = 'STORE';
    case INFLUENCER = 'INFLUENCER';
    case ADMIN = 'ADMIN';
    case SHIPPING = 'SHIPPING';
}