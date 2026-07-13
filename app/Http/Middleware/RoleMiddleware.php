<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     * Supports multiple roles: role:admin,store,influencer
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (!$request->user()) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $userRole = strtoupper($request->user()->role);
        $allowedRoles = array_map('strtoupper', $roles);

        if (!in_array($userRole, $allowedRoles)) {
            return response()->json([
                'message' => 'Unauthorized. Required roles: ' . implode(', ', $roles),
                'current_role' => $userRole,
            ], 403);
        }

        return $next($request);
    }
}
