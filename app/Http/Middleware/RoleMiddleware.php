<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        if (!$request->user() || strtoupper($request->user()->role) !== strtoupper($role)) {
            return response()->json([
                'message' => 'Unauthorized. Required role: ' . $role,
                'current_role' => $request->user() ? $request->user()->role : 'null',
            ], 403);
        }

        return $next($request);
    }
}
