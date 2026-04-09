<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ShippingEmp;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    public function index()
    {
        return ShippingEmp::with('user')->paginate(20);
    }

    public function show(ShippingEmp $employee)
    {
        return $employee->load('user');
    }

    public function destroy(ShippingEmp $employee)
    {
        $employee->delete();
        return response()->noContent();
    }
}
