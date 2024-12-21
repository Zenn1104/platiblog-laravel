<?php

namespace App\Http\Controllers;

use App\Http\Requests\CategoryCreateRequest;
use App\Http\Requests\CategoryUpdateRequest;
use App\Models\Category;
use App\Models\User;
use App\Models\WriterRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('name');
        $user = User::find(Auth::id());

        // Query the Category model with eager loading for blogs
        $query = Category::with(['blogs' => function ($query) {
            $query->with(['writer','category'])
            ->orderBy('created_at', 'desc')
            ->limit(4);
        }]);

        // Apply search filter
        if ($search) {
            $query->where('name', 'like', '%' . $search . '%');
        }

        // If the user has a specific role, apply additional filters
        if ($user->hasRole('admin')) {
            // Admin can view all categories and blogs
        }

        if ($user->hasRole('writer')) {
            // Filter blogs by the writer's ID
            $writer = WriterRequest::where('user_id', $user->id)->first();
            $query->whereHas('blogs', function ($query) use ($writer) {
                $query->where('writer_id', $writer->id);
            });
        }

        if ($user->hasRole('reader')) {
            // Readers only see blogs with 'approve' status
            $query->whereHas('blogs', function ($query) {
                $query->where('blog_status', 'approve');
            })->orDoesntHave('blogs');
        }

        // Paginate the categories
        $categories = $query
            ->paginate(5) // Adjust pagination size as needed
            ->appends($request->except('page')); // Maintain query parameters during pagination

        // Return data to Inertia view
        return Inertia::render('Categories/Index', [
            'categories' => $categories,
            'queryParams' => [
                'name' => $search,
            ],
        ]);
    }


    public function create(Request $request): Response
    {
        return Inertia::render('Categories/Create');
    }

    public function store(CategoryCreateRequest $request): RedirectResponse
    {
        $data = $request->validated();

        Category::create($data);

        return redirect()->route('categories.index')->with('success', 'Category created successfully.');
    }

    public function show(Category $category): Response
    {
        // Load kategori dengan blog yang terkait
        $category = Category::with(['blogs' => function ($query) {
            $query->with(['writer', 'category']) // Load relasi writer dan category
                ->where('blog_status', 'approve') // Filter status blog
                ->orderBy('created_at', 'desc'); // Urutkan berdasarkan tanggal
        }])->findOrFail($category->id);

        return Inertia::render('Categories/Show', [
            'category' => $category,
        ]);
    }


    public function edit(Category $category): Response
    {
        return Inertia::render('Categories/Edit', ['category' => $category]);
    }

    public function update(CategoryUpdateRequest $request, Category $category): RedirectResponse
    {
        $data = $request->validated();

        $category->fill($data);

        $category->update();

        return redirect()->route('categories.index')->with('success', 'Category update successfully');
    }

    public function destroy(Category $category): RedirectResponse
    {
        $category->delete();

        return redirect()->route('categories.index')->with('success', 'Category deleted successfully');
    }

}
