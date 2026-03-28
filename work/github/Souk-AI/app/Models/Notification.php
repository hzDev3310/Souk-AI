<?php

namespace App\Models;

use App\Enums\NotificationTarget;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasUuids;

    protected $fillable = [
        'target_type',
        'target_id',
        'title',
        'link',
        'message',
        'is_read',
    ];

    protected function casts(): array
    {
        return [
            'target_type' => NotificationTarget::class,
            'is_read' => 'boolean',
        ];
    }

    /**
     * Get the user that owns the notification.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'target_id');
    }
}