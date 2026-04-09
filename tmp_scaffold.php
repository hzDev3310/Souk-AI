<?php

$modelsPath = __DIR__.'/app/Models';
$migrationsPath = __DIR__.'/database/migrations';

// 1. Delete conflicting old custom migrations 
foreach (glob($migrationsPath . '/2026_*.php') as $file) {
    unlink($file);
}

// 2. Overwrite users_table migration 
$usersMigration = <<<'EOT'
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('family_name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->enum('role', ['CLIENT', 'INFLUENCER', 'STORE', 'ADMIN', 'SHIPPING_COMPANY', 'SHIPPING_EMP']);
            $table->boolean('isBlocked')->default(false);
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignUuid('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('users');
    }
};
EOT;
file_put_contents($migrationsPath . '/0001_01_01_000000_create_users_table.php', $usersMigration);

// 3. Create the massive combined Souk.AI migration 
$soukMigration = <<<'EOT'
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Roles (1-to-1 mapped with Users)
        Schema::create('clients', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->unique()->constrained('users')->cascadeOnDelete();
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('codePostal')->nullable();
            $table->float('lon')->nullable();
            $table->string('lat')->nullable();
            $table->timestamps();
        });

        Schema::create('influencers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->unique()->constrained('users')->cascadeOnDelete();
            $table->string('referralCode')->unique();
            $table->float('commissionRate')->default(5);
            $table->string('profilePicture')->nullable();
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('codePostal')->nullable();
            $table->string('cin')->nullable();
            $table->string('rib')->nullable();
            $table->string('d17')->nullable();
            $table->boolean('isActive')->default(true);
            $table->string('slug')->unique();
            $table->timestamps();
        });

        Schema::create('stores', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->unique()->constrained('users')->cascadeOnDelete();
            $table->string('name_fr');
            $table->string('name_ar');
            $table->string('name_en');
            $table->text('description_fr')->nullable();
            $table->text('description_ar')->nullable();
            $table->text('description_en')->nullable();
            $table->string('storePhone')->nullable();
            $table->string('address')->nullable();
            $table->string('responsibleCin')->nullable();
            $table->string('matriculeFiscale')->nullable();
            $table->string('logo')->nullable();
            $table->string('cover')->nullable();
            $table->string('rib')->nullable();
            $table->boolean('isActive')->default(true);
            $table->json('categories')->nullable();
            $table->decimal('promo', 5, 2)->default(0);
            $table->string('slug')->unique();
            $table->timestamps();
        });

        Schema::create('admins', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->unique()->constrained('users')->cascadeOnDelete();
            $table->float('platformCommissionAdmin')->default(10);
            $table->float('platformCommissionShare')->default(5);
            $table->timestamps();
        });

        Schema::create('shipping_companies', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->unique()->constrained('users')->cascadeOnDelete();
            $table->string('name');
            $table->string('contactInfo')->nullable();
            $table->string('companyPhone')->nullable();
            $table->string('responsiblePhone')->nullable();
            $table->string('address')->nullable();
            $table->string('cin')->nullable();
            $table->string('matriculeFiscale')->nullable();
            $table->string('rib')->nullable();
            $table->timestamps();
        });

        Schema::create('shipping_emps', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->unique()->constrained('users')->cascadeOnDelete();
            $table->string('pdp')->nullable(); 
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
            $table->string('cin')->nullable();
            $table->string('rib')->nullable();
            $table->timestamps();
        });

        // Catalog 
        Schema::create('categories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('parent_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->string('name_fr');
            $table->string('name_ar');
            $table->string('name_en');
            $table->string('slug')->unique();
            $table->string('icon')->nullable();
            $table->string('logo')->nullable();
            $table->string('cover')->nullable();
            $table->boolean('isActive')->default(true);
            $table->timestamps();
        });

        Schema::create('products', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('store_id')->constrained('stores')->cascadeOnDelete();
            $table->string('name_fr');
            $table->string('name_ar');
            $table->string('name_en');
            $table->text('description_fr')->nullable();
            $table->text('description_ar')->nullable();
            $table->text('description_en')->nullable();
            $table->decimal('price', 10, 2);
            $table->enum('condition', ['NEW', 'GOOD', 'USED']);
            $table->integer('stock')->default(0);
            $table->string('slug')->unique();
            $table->decimal('promo', 5, 2)->default(0);
            $table->json('categories')->nullable();
            $table->timestamps();
        });

        Schema::create('category_product', function (Blueprint $table) {
            $table->foreignUuid('category_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('product_id')->constrained()->cascadeOnDelete();
            $table->primary(['category_id', 'product_id']);
        });

        Schema::create('product_variants', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('product_id')->constrained('products')->cascadeOnDelete();
            $table->string('variant_name'); 
            $table->string('sku')->unique();
            $table->decimal('price', 10, 2)->nullable(); 
            $table->integer('stock')->default(0);
            $table->timestamps();
        });

        Schema::create('product_albums', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('product_id')->constrained('products')->cascadeOnDelete();
            $table->string('imageUrl');
            $table->boolean('isPrimary')->default(false);
            $table->timestamps();
        });

        // Sales & Finances
        Schema::create('orders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('client_id')->constrained('clients');
            $table->foreignUuid('influencer_id')->nullable()->constrained('influencers')->nullOnDelete();
            $table->enum('status', ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'])->default('PENDING');
            $table->decimal('totalAmount', 10, 2);
            $table->timestamps();
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('order_id')->constrained('orders')->cascadeOnDelete();
            $table->foreignUuid('product_id')->constrained('products');
            $table->foreignUuid('variant_id')->nullable()->constrained('product_variants')->nullOnDelete();
            $table->integer('quantity');
            $table->decimal('price', 10, 2);
            $table->timestamps();
        });

        Schema::create('factures', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('order_id')->constrained('orders')->cascadeOnDelete();
            $table->string('factureNumber')->unique();
            $table->enum('type', ['STORE', 'INFLUENCER', 'ADMIN', 'SHIPPING', 'SHIPPING_EMP']);
            $table->decimal('amount', 10, 2);
            $table->enum('status', ['UNPAID', 'PENDING', 'PAID'])->default('UNPAID');
            $table->timestamps();
        });

        // Support & Moderation
        Schema::create('logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
            $table->enum('userRole', ['CLIENT', 'INFLUENCER', 'STORE', 'ADMIN', 'SHIPPING_COMPANY', 'SHIPPING_EMP']);
            $table->string('title');
            $table->text('description')->nullable();
            $table->boolean('status')->default(true);
            $table->timestamps();
        });

        Schema::create('notifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->enum('targetType', ['CLIENT', 'INFLUENCER', 'STORE', 'SHIPPING_COMPANY', 'SHIPPING_EMP', 'USER']);
            $table->uuid('targetId');
            $table->string('title');
            $table->text('message');
            $table->boolean('isSeen')->default(false);
            $table->timestamps();
        });

        Schema::create('reports', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('reporterId');
            $table->uuid('reportedTargetId');
            $table->enum('reportedTargetRole', ['CLIENT', 'INFLUENCER', 'STORE', 'ADMIN', 'SHIPPING_COMPANY', 'SHIPPING_EMP']);
            $table->text('description');
            $table->string('status')->default('PENDING'); 
            $table->timestamps();
        });

        Schema::create('block_lists', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('reporterId');
            $table->uuid('reportedTargetId');
            $table->enum('reportedTargetRole', ['CLIENT', 'INFLUENCER', 'STORE', 'ADMIN', 'SHIPPING_COMPANY', 'SHIPPING_EMP']);
            $table->timestamps();
        });

        Schema::create('comments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
            $table->enum('targetRole', ['CLIENT', 'INFLUENCER', 'STORE', 'ADMIN', 'SHIPPING_COMPANY', 'SHIPPING_EMP', 'PRODUCT']);
            $table->uuid('targetId');
            $table->text('content');
            $table->timestamps();
        });

        Schema::create('ratings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
            $table->enum('targetRole', ['CLIENT', 'INFLUENCER', 'STORE', 'ADMIN', 'SHIPPING_COMPANY', 'SHIPPING_EMP', 'PRODUCT']);
            $table->uuid('targetId');
            $table->tinyInteger('rating');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ratings');
        Schema::dropIfExists('comments');
        Schema::dropIfExists('block_lists');
        Schema::dropIfExists('reports');
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('logs');
        Schema::dropIfExists('factures');
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('product_albums');
        Schema::dropIfExists('product_variants');
        Schema::dropIfExists('category_product');
        Schema::dropIfExists('products');
        Schema::dropIfExists('categories');
        Schema::dropIfExists('shipping_emps');
        Schema::dropIfExists('shipping_companies');
        Schema::dropIfExists('admins');
        Schema::dropIfExists('stores');
        Schema::dropIfExists('influencers');
        Schema::dropIfExists('clients');
    }
};
EOT;
file_put_contents($migrationsPath . '/2026_04_09_000000_create_souk_schema.php', $soukMigration);

// 4. Create Models
$models = [
    'User' => <<<EOT
namespace App\Models;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable {
    use HasUuids;

    protected \$fillable = ['name', 'family_name', 'email', 'password', 'role', 'isBlocked'];
    protected \$hidden = ['password'];
    protected \$casts = ['isBlocked' => 'boolean'];

    public function client() { return \$this->hasOne(Client::class); }
    public function influencer() { return \$this->hasOne(Influencer::class); }
    public function store() { return \$this->hasOne(Store::class); }
    public function admin() { return \$this->hasOne(Admin::class); }
    public function shippingCompany() { return \$this->hasOne(ShippingCompany::class); }
    public function shippingEmp() { return \$this->hasOne(ShippingEmp::class); }
    public function logs() { return \$this->hasMany(Log::class); }
    public function comments() { return \$this->hasMany(Comment::class); }
    public function ratings() { return \$this->hasMany(Rating::class); }
}
EOT,

    'Client' => <<<EOT
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Client extends Model {
    use HasUuids;
    protected \$fillable = ['user_id', 'address', 'city', 'codePostal', 'lon', 'lat'];

    public function user() { return \$this->belongsTo(User::class); }
    public function orders() { return \$this->hasMany(Order::class); }
}
EOT,

    'Influencer' => <<<EOT
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Influencer extends Model {
    use HasUuids;
    protected \$fillable = ['user_id', 'referralCode', 'commissionRate', 'profilePicture', 'phone', 'address', 'city', 'codePostal', 'cin', 'rib', 'd17', 'isActive', 'slug'];
    protected \$casts = ['isActive' => 'boolean'];

    public function user() { return \$this->belongsTo(User::class); }
    public function orders() { return \$this->hasMany(Order::class); }
}
EOT,

    'Store' => <<<EOT
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Store extends Model {
    use HasUuids;
    protected \$fillable = ['user_id', 'name_fr', 'name_ar', 'name_en', 'description_fr', 'description_ar', 'description_en', 'storePhone', 'address', 'responsibleCin', 'matriculeFiscale', 'logo', 'cover', 'rib', 'isActive', 'categories', 'slug', 'promo'];
    protected \$casts = ['isActive' => 'boolean', 'categories' => 'array'];

    public function user() { return \$this->belongsTo(User::class); }
    public function products() { return \$this->hasMany(Product::class); }
}
EOT,

    'Admin' => <<<EOT
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Admin extends Model {
    use HasUuids;
    protected \$fillable = ['user_id', 'platformCommissionAdmin', 'platformCommissionShare'];
    public function user() { return \$this->belongsTo(User::class); }
}
EOT,

    'ShippingCompany' => <<<EOT
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class ShippingCompany extends Model {
    use HasUuids;
    protected \$fillable = ['user_id', 'name', 'contactInfo', 'companyPhone', 'responsiblePhone', 'address', 'cin', 'matriculeFiscale', 'rib'];
    public function user() { return \$this->belongsTo(User::class); }
}
EOT,

    'ShippingEmp' => <<<EOT
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class ShippingEmp extends Model {
    use HasUuids;
    protected \$fillable = ['user_id', 'pdp', 'phone', 'address', 'cin', 'rib'];
    public function user() { return \$this->belongsTo(User::class); }
}
EOT,

    'Category' => <<<EOT
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Category extends Model {
    use HasUuids;
    protected \$fillable = ['parent_id', 'name_fr', 'name_ar', 'name_en', 'slug', 'icon', 'logo', 'cover', 'isActive'];
    protected \$casts = ['isActive' => 'boolean'];

    public function parent() { return \$this->belongsTo(Category::class, 'parent_id'); }
    public function children() { return \$this->hasMany(Category::class, 'parent_id'); }
    public function products() { return \$this->belongsToMany(Product::class); }
}
EOT,

    'Product' => <<<EOT
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Product extends Model {
    use HasUuids;
    protected \$fillable = ['store_id', 'name_fr', 'name_ar', 'name_en', 'description_fr', 'description_ar', 'description_en', 'price', 'condition', 'stock', 'slug', 'promo', 'categories'];
    protected \$casts = ['categories' => 'array'];

    public function store() { return \$this->belongsTo(Store::class); }
    public function variants() { return \$this->hasMany(ProductVariant::class); }
    public function albums() { return \$this->hasMany(ProductAlbum::class); }
    public function categoryLinks() { return \$this->belongsToMany(Category::class); } 
}
EOT,

    'ProductVariant' => <<<EOT
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class ProductVariant extends Model {
    use HasUuids;
    protected \$fillable = ['product_id', 'variant_name', 'sku', 'price', 'stock'];
    public function product() { return \$this->belongsTo(Product::class); }
}
EOT,

    'ProductAlbum' => <<<EOT
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class ProductAlbum extends Model {
    use HasUuids;
    protected \$fillable = ['product_id', 'imageUrl', 'isPrimary'];
    protected \$casts = ['isPrimary' => 'boolean'];
    public function product() { return \$this->belongsTo(Product::class); }
}
EOT,

    'Order' => <<<EOT
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Order extends Model {
    use HasUuids;
    protected \$fillable = ['client_id', 'influencer_id', 'status', 'totalAmount'];

    public function client() { return \$this->belongsTo(Client::class); }
    public function influencer() { return \$this->belongsTo(Influencer::class); }
    public function items() { return \$this->hasMany(OrderItem::class); }
    public function factures() { return \$this->hasMany(Facture::class); }
}
EOT,

    'OrderItem' => <<<EOT
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class OrderItem extends Model {
    use HasUuids;
    protected \$fillable = ['order_id', 'product_id', 'variant_id', 'quantity', 'price'];

    public function order() { return \$this->belongsTo(Order::class); }
    public function product() { return \$this->belongsTo(Product::class); }
    public function variant() { return \$this->belongsTo(ProductVariant::class); }
}
EOT,

    'Facture' => <<<EOT
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Facture extends Model {
    use HasUuids;
    protected \$fillable = ['order_id', 'factureNumber', 'type', 'amount', 'status'];
    public function order() { return \$this->belongsTo(Order::class); }
}
EOT,

    'Log' => <<<EOT
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Log extends Model {
    use HasUuids;
    protected \$fillable = ['user_id', 'userRole', 'title', 'description', 'status'];
    protected \$casts = ['status' => 'boolean'];

    public function user() { return \$this->belongsTo(User::class); }
}
EOT,

    'Notification' => <<<EOT
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Notification extends Model {
    use HasUuids;
    protected \$fillable = ['targetType', 'targetId', 'title', 'message', 'isSeen'];
    protected \$casts = ['isSeen' => 'boolean'];
}
EOT,

    'Report' => <<<EOT
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Report extends Model {
    use HasUuids;
    protected \$fillable = ['reporterId', 'reportedTargetId', 'reportedTargetRole', 'description', 'status'];
}
EOT,

    'BlockList' => <<<EOT
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class BlockList extends Model {
    use HasUuids;
    protected \$fillable = ['reporterId', 'reportedTargetId', 'reportedTargetRole'];
}
EOT,

    'Comment' => <<<EOT
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Comment extends Model {
    use HasUuids;
    protected \$fillable = ['user_id', 'targetRole', 'targetId', 'content'];
    public function user() { return \$this->belongsTo(User::class); }
}
EOT,

    'Rating' => <<<EOT
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Rating extends Model {
    use HasUuids;
    protected \$fillable = ['user_id', 'targetRole', 'targetId', 'rating'];
    public function user() { return \$this->belongsTo(User::class); }
}
EOT,

];

foreach ($models as $name => $content) {
    file_put_contents($modelsPath . '/' . $name . '.php', "<?php\n\n" . $content);
}

echo "Successfully wrote 20 models and 2 main migrations.";
