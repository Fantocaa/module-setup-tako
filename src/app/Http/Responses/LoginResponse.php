<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function toResponse($request)
    {
       $user = $request->user();

        if ($user->hasRole('user')) {
            return redirect()->route('courses.index');
        }

        return redirect()->route('dashboard');
    }
}
