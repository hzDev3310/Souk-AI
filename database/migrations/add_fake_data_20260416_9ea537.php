<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Faker\Factory as Faker;

return new class extends Migration {
    public function up(): void
    {
        $faker = Faker::create();

        // Create specific test users first
        $testUsers = [
            [
                'id' => Str::uuid(),
                'name' => 'Admin',
                'family_name' => 'System',
                'email' => 'admin@souk.tn',
                'password' => bcrypt('123456789'),
                'role' => 'ADMIN',
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Store',
                'family_name' => 'Owner',
                'email' => 'store@souk.tn',
                'password' => bcrypt('123456789'),
                'role' => 'STORE',
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Client',
                'family_name' => 'User',
                'email' => 'client@souk.tn',
                'password' => bcrypt('123456789'),
                'role' => 'CLIENT',
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($testUsers as $userData) {
            $user = DB::table('users')->where('email', $userData['email'])->first();
            if ($user) {
                $updateData = $userData;
                unset($updateData['id']);
                DB::table('users')->where('id', $user->id)->update($updateData);
            } else {
                DB::table('users')->insert($userData);
            }
        }

        // Create random users
        $users = [];
        $userRoles = ['CLIENT', 'INFLUENCER', 'STORE', 'SHIPPING_COMPANY', 'SHIPPING_EMP'];

        for ($i = 0; $i < 47; $i++) {
            $userId = Str::uuid();
            $users[] = [
                'id' => $userId,
                'name' => $faker->firstName,
                'family_name' => $faker->lastName,
                'email' => $faker->unique()->safeEmail,
                'email_verified_at' => now(),
                'password' => bcrypt('password'),
                'role' => $faker->randomElement($userRoles),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::table('users')->insert($users);

        // Get users by role for foreign key relationships
        $clientUsers = DB::table('users')->where('role', 'CLIENT')->get();
        $influencerUsers = DB::table('users')->where('role', 'INFLUENCER')->get();
        $storeUsers = DB::table('users')->where('role', 'STORE')->get();
        $adminUsers = DB::table('users')->where('role', 'ADMIN')->get();
        $shippingCompanyUsers = DB::table('users')->where('role', 'SHIPPING_COMPANY')->get();
        $shippingEmpUsers = DB::table('users')->where('role', 'SHIPPING_EMP')->get();

        // Clients
        $clients = [];
        foreach ($clientUsers as $user) {
            if (!DB::table('clients')->where('user_id', $user->id)->exists()) {
                $clients[] = [
                    'id' => Str::uuid(),
                    'user_id' => $user->id,
                    'address' => $faker->address,
                    'city' => $faker->city,
                    'codePostal' => $faker->postcode,
                    'lon' => $faker->longitude,
                    'lat' => $faker->latitude,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }
        if (!empty($clients)) DB::table('clients')->insert($clients);

        // Influencers
        $influencers = [];
        foreach ($influencerUsers as $user) {
            if (!DB::table('influencers')->where('user_id', $user->id)->exists()) {
                $influencers[] = [
                    'id' => Str::uuid(),
                    'user_id' => $user->id,
                    'referralCode' => Str::random(8),
                    'commissionRate' => $faker->randomFloat(2, 2, 15),
                    'profilePicture' => $faker->imageUrl(200, 200, 'people'),
                    'phone' => $faker->phoneNumber,
                    'address' => $faker->address,
                    'city' => $faker->city,
                    'codePostal' => $faker->postcode,
                    'cin' => Str::random(12),
                    'rib' => Str::random(20),
                    'd17' => Str::random(10),
                    'isActive' => $faker->boolean(80),
                    'slug' => Str::slug($user->name . '-' . Str::random(5)),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }
        if (!empty($influencers)) DB::table('influencers')->insert($influencers);

        // Stores
        $stores = [];
        foreach ($storeUsers as $user) {
            if (!DB::table('stores')->where('user_id', $user->id)->exists()) {
                $isTestStore = $user->email === 'store@souk.tn';
                $stores[] = [
                    'id' => Str::uuid(),
                    'user_id' => $user->id,
                    'name_fr' => $isTestStore ? 'Mon Magasin Test' : $faker->company,
                    'name_ar' => $isTestStore ? 'متجري التجريبي' : $faker->company,
                    'name_en' => $isTestStore ? 'My Test Store' : $faker->company,
                    'description_fr' => $faker->paragraph,
                    'description_ar' => $faker->paragraph,
                    'description_en' => $faker->paragraph,
                    'storePhone' => $faker->phoneNumber,
                    'address' => $faker->address,
                    'responsibleCin' => Str::random(12),
                    'matriculeFiscale' => Str::random(15),
                    'logo' => $faker->imageUrl(200, 200, 'business'),
                    'cover' => $faker->imageUrl(1200, 400, 'nature'),
                    'rib' => Str::random(20),
                    'isActive' => true,
                    'categories' => json_encode([$faker->word, $faker->word]),
                    'promo' => $faker->randomFloat(2, 0, 30),
                    'slug' => Str::slug(($isTestStore ? 'my-test-store' : $user->name) . '-' . Str::random(5)),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }
        if (!empty($stores)) DB::table('stores')->insert($stores);

        // Admins
        $admins = [];
        foreach ($adminUsers as $user) {
            if (!DB::table('admins')->where('user_id', $user->id)->exists()) {
                $admins[] = [
                    'id' => Str::uuid(),
                    'user_id' => $user->id,
                    'platformCommissionAdmin' => $faker->randomFloat(2, 5, 20),
                    'platformCommissionShare' => $faker->randomFloat(2, 2, 10),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }
        if (!empty($admins)) DB::table('admins')->insert($admins);

        // Shipping Companies
        $shippingCompanies = [];
        foreach ($shippingCompanyUsers as $user) {
            if (!DB::table('shipping_companies')->where('user_id', $user->id)->exists()) {
                $shippingCompanies[] = [
                    'id' => Str::uuid(),
                    'user_id' => $user->id,
                    'name' => $faker->company,
                    'contactInfo' => $faker->email,
                    'companyPhone' => $faker->phoneNumber,
                    'responsiblePhone' => $faker->phoneNumber,
                    'address' => $faker->address,
                    'cin' => Str::random(12),
                    'matriculeFiscale' => Str::random(15),
                    'rib' => Str::random(20),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }
        if (!empty($shippingCompanies)) DB::table('shipping_companies')->insert($shippingCompanies);

        // Shipping Employees
        $shippingEmps = [];
        foreach ($shippingEmpUsers as $user) {
            if (!DB::table('shipping_emps')->where('user_id', $user->id)->exists()) {
                $shippingEmps[] = [
                    'id' => Str::uuid(),
                    'user_id' => $user->id,
                    'pdp' => $faker->imageUrl(200, 200, 'people'),
                    'phone' => $faker->phoneNumber,
                    'address' => $faker->address,
                    'cin' => Str::random(12),
                    'rib' => Str::random(20),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }
        if (!empty($shippingEmps)) DB::table('shipping_emps')->insert($shippingEmps);

        // Categories
        $categories = [];
        $categoryNames = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Toys', 'Beauty', 'Food'];

        foreach ($categoryNames as $index => $catName) {
            $categories[] = [
                'id' => Str::uuid(),
                'parent_id' => null,
                'name_fr' => $catName,
                'name_ar' => $catName,
                'name_en' => $catName,
                'slug' => Str::slug($catName),
                'icon' => $faker->imageUrl(50, 50, 'icon'),
                'logo' => $faker->imageUrl(100, 100, 'logo'),
                'cover' => $faker->imageUrl(800, 300, 'nature'),
                'isActive' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        // Add subcategories
        for ($i = 0; $i < 20; $i++) {
            $categories[] = [
                'id' => Str::uuid(),
                'parent_id' => $categories[array_rand($categories)]['id'],
                'name_fr' => $faker->word,
                'name_ar' => $faker->word,
                'name_en' => $faker->word,
                'slug' => Str::slug($faker->unique()->word),
                'icon' => $faker->imageUrl(50, 50, 'icon'),
                'logo' => $faker->imageUrl(100, 100, 'logo'),
                'cover' => $faker->imageUrl(800, 300, 'nature'),
                'isActive' => $faker->boolean(80),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('categories')->insert($categories);

        $allCategories = DB::table('categories')->get();

        // Products
        $products = [];
        $storeIds = DB::table('stores')->pluck('id')->toArray();

        for ($i = 0; $i < 100; $i++) {
            $productId = Str::uuid();
            $products[] = [
                'id' => $productId,
                'store_id' => $faker->randomElement($storeIds),
                'name_fr' => $faker->word,
                'name_ar' => $faker->word,
                'name_en' => $faker->word,
                'description_fr' => $faker->paragraph,
                'description_ar' => $faker->paragraph,
                'description_en' => $faker->paragraph,
                'price' => $faker->randomFloat(2, 10, 1000),
                'condition' => $faker->randomElement(['NEW', 'GOOD', 'USED']),
                'stock' => $faker->numberBetween(0, 500),
                'slug' => Str::slug($faker->unique()->word . '-' . Str::random(5)),
                'promo' => $faker->randomFloat(2, 0, 50),
                'categories' => json_encode([$faker->randomElement($allCategories)->id]),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('products')->insert($products);

        $allProducts = DB::table('products')->get();

        // Category Product pivot
        $categoryProductPivot = [];
        foreach ($allProducts as $product) {
            $randomCategories = $allCategories->random(rand(1, 3));
            foreach ($randomCategories as $category) {
                $categoryProductPivot[] = [
                    'category_id' => $category->id,
                    'product_id' => $product->id,
                ];
            }
        }
        DB::table('category_product')->insert(array_unique($categoryProductPivot, SORT_REGULAR));

        // Product Variants
        $variants = [];
        foreach ($allProducts as $product) {
            for ($i = 0; $i < rand(0, 3); $i++) {
                $variants[] = [
                    'id' => Str::uuid(),
                    'product_id' => $product->id,
                    'variant_name' => $faker->randomElement(['Size S', 'Size M', 'Size L', 'Color Red', 'Color Blue', 'Color Black']),
                    'sku' => Str::random(10),
                    'price' => $faker->randomFloat(2, 5, 500),
                    'stock' => $faker->numberBetween(0, 100),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }
        DB::table('product_variants')->insert($variants);

        $allVariants = DB::table('product_variants')->get();

        // Product Albums
        $albums = [];
        foreach ($allProducts as $product) {
            for ($i = 0; $i < rand(1, 5); $i++) {
                $albums[] = [
                    'id' => Str::uuid(),
                    'product_id' => $product->id,
                    'imageUrl' => $faker->imageUrl(800, 800, 'product'),
                    'isPrimary' => $i === 0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }
        DB::table('product_albums')->insert($albums);

        // Orders
        $orders = [];
        $clientIds = DB::table('clients')->pluck('id')->toArray();
        $influencerIds = DB::table('influencers')->pluck('id')->toArray();
        $statuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

        for ($i = 0; $i < 200; $i++) {
            $orders[] = [
                'id' => Str::uuid(),
                'client_id' => $faker->randomElement($clientIds),
                'influencer_id' => $faker->optional(0.3)->randomElement($influencerIds),
                'status' => $faker->randomElement($statuses),
                'totalAmount' => 0,
                'created_at' => $faker->dateTimeBetween('-6 months', 'now'),
                'updated_at' => now(),
            ];
        }
        DB::table('orders')->insert($orders);

        $allOrders = DB::table('orders')->get();

        // Order Items
        $orderItems = [];
        foreach ($allOrders as $order) {
            $numItems = rand(1, 5);
            $totalAmount = 0;

            for ($i = 0; $i < $numItems; $i++) {
                $product = $faker->randomElement($allProducts);
                $variant = $faker->optional(0.5)->randomElement($allVariants->where('product_id', $product->id));
                $quantity = rand(1, 10);
                $price = $variant ? $variant->price : $product->price;
                $totalAmount += $price * $quantity;

                $orderItems[] = [
                    'id' => Str::uuid(),
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'variant_id' => $variant ? $variant->id : null,
                    'quantity' => $quantity,
                    'price' => $price,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            // Update order total amount
            DB::table('orders')->where('id', $order->id)->update(['totalAmount' => $totalAmount]);
        }
        DB::table('order_items')->insert($orderItems);

        // Factures
        $factures = [];
        $factureTypes = ['STORE', 'INFLUENCER', 'ADMIN', 'SHIPPING', 'SHIPPING_EMP'];
        $factureStatuses = ['UNPAID', 'PENDING', 'PAID'];

        foreach ($allOrders as $order) {
            for ($i = 0; $i < rand(1, 3); $i++) {
                $factures[] = [
                    'id' => Str::uuid(),
                    'order_id' => $order->id,
                    'factureNumber' => 'INV-' . strtoupper(Str::random(8)),
                    'type' => $faker->randomElement($factureTypes),
                    'amount' => $faker->randomFloat(2, 10, $order->totalAmount),
                    'status' => $faker->randomElement($factureStatuses),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }
        DB::table('factures')->insert($factures);

        // Logs
        $logs = [];
        $userRoles = ['CLIENT', 'INFLUENCER', 'STORE', 'ADMIN', 'SHIPPING_COMPANY', 'SHIPPING_EMP'];
        $allUsers = DB::table('users')->get();

        for ($i = 0; $i < 500; $i++) {
            $user = $faker->randomElement($allUsers);
            $logs[] = [
                'id' => Str::uuid(),
                'user_id' => $user->id,
                'userRole' => strtoupper($user->role),
                'title' => $faker->sentence,
                'description' => $faker->paragraph,
                'status' => $faker->boolean,
                'created_at' => $faker->dateTimeBetween('-3 months', 'now'),
                'updated_at' => now(),
            ];
        }
        DB::table('logs')->insert($logs);

        // Notifications
        $notifications = [];
        $targetTypes = ['CLIENT', 'INFLUENCER', 'STORE', 'SHIPPING_COMPANY', 'SHIPPING_EMP', 'USER'];

        for ($i = 0; $i < 300; $i++) {
            $targetType = $faker->randomElement($targetTypes);
            $tableMap = ['CLIENT' => 'clients', 'INFLUENCER' => 'influencers', 'STORE' => 'stores', 'ADMIN' => 'admins', 'SHIPPING_COMPANY' => 'shipping_companies', 'SHIPPING_EMP' => 'shipping_emps', 'USER' => 'users', 'PRODUCT' => 'products'];
            $targetTable = $tableMap[$targetType];
            $targetIds = DB::table($targetTable)->pluck('id')->toArray();

            if (!empty($targetIds)) {
                $notifications[] = [
                    'id' => Str::uuid(),
                    'targetType' => $targetType,
                    'targetId' => $faker->randomElement($targetIds),
                    'title' => $faker->sentence,
                    'message' => $faker->paragraph,
                    'isSeen' => $faker->boolean(70),
                    'created_at' => $faker->dateTimeBetween('-1 month', 'now'),
                    'updated_at' => now(),
                ];
            }
        }
        DB::table('notifications')->insert($notifications);

        // Reports
        $reports = [];
        $reportedTargetRoles = ['CLIENT', 'INFLUENCER', 'STORE', 'ADMIN', 'SHIPPING_COMPANY', 'SHIPPING_EMP'];

        for ($i = 0; $i < 50; $i++) {
            $reporter = $faker->randomElement($allUsers);
            $targetRole = $faker->randomElement($reportedTargetRoles);
            $tableMap = ['CLIENT' => 'clients', 'INFLUENCER' => 'influencers', 'STORE' => 'stores', 'ADMIN' => 'admins', 'SHIPPING_COMPANY' => 'shipping_companies', 'SHIPPING_EMP' => 'shipping_emps', 'USER' => 'users', 'PRODUCT' => 'products'];
            $targetTable = $tableMap[$targetRole];
            $targetIds = DB::table($targetTable)->pluck('id')->toArray();

            if (!empty($targetIds)) {
                $reports[] = [
                    'id' => Str::uuid(),
                    'reporterId' => $reporter->id,
                    'reportedTargetId' => $faker->randomElement($targetIds),
                    'reportedTargetRole' => $targetRole,
                    'description' => $faker->paragraph,
                    'status' => $faker->randomElement(['PENDING', 'REVIEWED', 'RESOLVED', 'DISMISSED']),
                    'created_at' => $faker->dateTimeBetween('-2 months', 'now'),
                    'updated_at' => now(),
                ];
            }
        }
        DB::table('reports')->insert($reports);

        // Block Lists
        $blockLists = [];
        for ($i = 0; $i < 30; $i++) {
            $reporter = $faker->randomElement($allUsers);
            $targetRole = $faker->randomElement($reportedTargetRoles);
            $tableMap = ['CLIENT' => 'clients', 'INFLUENCER' => 'influencers', 'STORE' => 'stores', 'ADMIN' => 'admins', 'SHIPPING_COMPANY' => 'shipping_companies', 'SHIPPING_EMP' => 'shipping_emps', 'USER' => 'users', 'PRODUCT' => 'products'];
            $targetTable = $tableMap[$targetRole];
            $targetIds = DB::table($targetTable)->pluck('id')->toArray();

            if (!empty($targetIds)) {
                $blockLists[] = [
                    'id' => Str::uuid(),
                    'reporterId' => $reporter->id,
                    'reportedTargetId' => $faker->randomElement($targetIds),
                    'reportedTargetRole' => $targetRole,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }
        DB::table('block_lists')->insert($blockLists);

        // Comments
        $comments = [];
        $commentTargetRoles = ['CLIENT', 'INFLUENCER', 'STORE', 'ADMIN', 'SHIPPING_COMPANY', 'SHIPPING_EMP', 'PRODUCT'];

        for ($i = 0; $i < 400; $i++) {
            $user = $faker->randomElement($allUsers);
            $targetRole = $faker->randomElement($commentTargetRoles);

            if ($targetRole === 'PRODUCT') {
                $targetIds = $allProducts->pluck('id')->toArray();
            } else {
                $tableMap = ['CLIENT' => 'clients', 'INFLUENCER' => 'influencers', 'STORE' => 'stores', 'ADMIN' => 'admins', 'SHIPPING_COMPANY' => 'shipping_companies', 'SHIPPING_EMP' => 'shipping_emps', 'USER' => 'users', 'PRODUCT' => 'products'];
                $targetTable = $tableMap[$targetRole];
                $targetIds = DB::table($targetTable)->pluck('id')->toArray();
            }

            if (!empty($targetIds)) {
                $comments[] = [
                    'id' => Str::uuid(),
                    'user_id' => $user->id,
                    'targetRole' => $targetRole,
                    'targetId' => $faker->randomElement($targetIds),
                    'content' => $faker->paragraph,
                    'created_at' => $faker->dateTimeBetween('-3 months', 'now'),
                    'updated_at' => now(),
                ];
            }
        }
        DB::table('comments')->insert($comments);

        // Ratings
        $ratings = [];
        for ($i = 0; $i < 400; $i++) {
            $user = $faker->randomElement($allUsers);
            $targetRole = $faker->randomElement($commentTargetRoles);

            if ($targetRole === 'PRODUCT') {
                $targetIds = $allProducts->pluck('id')->toArray();
            } else {
                $tableMap = ['CLIENT' => 'clients', 'INFLUENCER' => 'influencers', 'STORE' => 'stores', 'ADMIN' => 'admins', 'SHIPPING_COMPANY' => 'shipping_companies', 'SHIPPING_EMP' => 'shipping_emps', 'USER' => 'users', 'PRODUCT' => 'products'];
                $targetTable = $tableMap[$targetRole];
                $targetIds = DB::table($targetTable)->pluck('id')->toArray();
            }

            if (!empty($targetIds)) {
                $ratings[] = [
                    'id' => Str::uuid(),
                    'user_id' => $user->id,
                    'targetRole' => $targetRole,
                    'targetId' => $faker->randomElement($targetIds),
                    'rating' => $faker->numberBetween(1, 5),
                    'created_at' => $faker->dateTimeBetween('-3 months', 'now'),
                    'updated_at' => now(),
                ];
            }
        }
        DB::table('ratings')->insert($ratings);
    }

    public function down(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0');

        DB::table('ratings')->truncate();
        DB::table('comments')->truncate();
        DB::table('block_lists')->truncate();
        DB::table('reports')->truncate();
        DB::table('notifications')->truncate();
        DB::table('logs')->truncate();
        DB::table('factures')->truncate();
        DB::table('order_items')->truncate();
        DB::table('orders')->truncate();
        DB::table('product_albums')->truncate();
        DB::table('product_variants')->truncate();
        DB::table('category_product')->truncate();
        DB::table('products')->truncate();
        DB::table('categories')->truncate();
        DB::table('shipping_emps')->truncate();
        DB::table('shipping_companies')->truncate();
        DB::table('admins')->truncate();
        DB::table('stores')->truncate();
        DB::table('influencers')->truncate();
        DB::table('clients')->truncate();
        DB::table('users')->truncate();

        DB::statement('SET FOREIGN_KEY_CHECKS=1');
    }
};