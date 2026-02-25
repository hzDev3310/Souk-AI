<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/example-blade', function () {
    return view('example-blade');
});

Route::get('/example-react', function () {
    return view('example-react');
});