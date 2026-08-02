<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class ProductAlbum extends Model {
    use HasUuids;
    protected $fillable = ['product_id', 'imageUrl', 'isPrimary', 'file', 'isCover'];
    protected $casts = ['isPrimary' => 'boolean', 'isCover' => 'boolean'];
    protected $appends = ['file', 'isCover'];
    public function product() { return $this->belongsTo(Product::class); }

    public function setFileAttribute($value): void { $this->attributes['imageUrl'] = $value; }
    public function getFileAttribute(): ?string {
        $url = $this->attributes['imageUrl'] ?? null;
        return $url ? (str_starts_with($url, 'http') ? $url : '/storage/' . $url) : null;
    }
    public function setIsCoverAttribute($value): void { $this->attributes['isPrimary'] = (bool) $value; }
    public function getIsCoverAttribute(): bool { return (bool) ($this->attributes['isPrimary'] ?? false); }
}