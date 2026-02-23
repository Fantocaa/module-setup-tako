<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;

class BackupController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    protected string $backupPath = 'private/Laravel';
    public function index()
    {
        $realPath = storage_path('app/' . $this->backupPath);

        $files = File::exists($realPath) ? File::files($realPath) : [];

        $backups = collect($files)
            ->filter(fn($file) => $file->getExtension() === 'zip')
            ->map(fn($file) => [
                'name' => $file->getFilename(),
                'size' => $file->getSize(),
                'last_modified' => $file->getMTime(),
                'download_url' => route('backup.download', ['file' => $file->getFilename()]),
            ])
            ->sortByDesc('last_modified')
            ->values();

        return Inertia::render('backup/Index', [
            'backups' => $backups,
        ]);
    }

    public function run()
    {
        Artisan::call('backup:run --only-db');
        return redirect()->back()->with('success', 'Backup berhasil dibuat.');
    }

    public function download($file)
    {
        $path = storage_path('app/' . $this->backupPath . '/' . $file);

        if (!file_exists($path)) {
            abort(404, 'File tidak ditemukan.');
        }

        return response()->download($path);
    }

    public function delete($file)
    {
        $path = storage_path('app/' . $this->backupPath . '/' . $file);

        if (!file_exists($path)) {
            return redirect()->back()->with('error', 'File tidak ditemukan.');
        }

        unlink($path);

        return redirect()->back()->with('success', 'Backup berhasil dihapus.');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
