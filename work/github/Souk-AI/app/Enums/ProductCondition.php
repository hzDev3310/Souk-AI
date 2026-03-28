<?php

namespace App\Enums;

enum ProductCondition: string
{
    case NEW = 'NEW';
    case GOOD = 'GOOD';
    case USED = 'USED';
}