<?php

namespace App\Http\Controllers\Concerns;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use RuntimeException;

trait HandlesFileUploads
{
    protected function storeUploadedFile(UploadedFile $file, string $directory, string $prefix, string $name): string
    {
        $extension = strtolower($file->getClientOriginalExtension() ?: $file->extension() ?: 'bin');
        $baseName = trim(Str::slug($name) ?: 'file');
        $filename = sprintf('%s-%s-%s.%s', $prefix, $baseName, substr(md5(uniqid('', true)), 0, 8), $extension);

        try {
            return $file->storeAs($directory, $filename, 'public');
        } catch (\Throwable $e) {
            throw new RuntimeException('Échec de l’enregistrement du fichier. Veuillez réessayer.');
        }
    }

    protected function fileUploadErrorResponse()
    {
        return response()->json([
            'success' => false,
            'message' => 'Échec de l’enregistrement du fichier. Veuillez réessayer.',
        ], 500);
    }
}
