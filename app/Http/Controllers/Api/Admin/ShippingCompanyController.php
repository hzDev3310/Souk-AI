<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ShippingCompany;
use Illuminate\Http\Request;

class ShippingCompanyController extends Controller
{
    public function index()
    {
        return ShippingCompany::with('user')->paginate(20);
    }

    public function show(ShippingCompany $shippingCompany)
    {
        return $shippingCompany->load('user');
    }

    public function destroy(ShippingCompany $shippingCompany)
    {
        $shippingCompany->delete();
        return response()->noContent();
    }
}
