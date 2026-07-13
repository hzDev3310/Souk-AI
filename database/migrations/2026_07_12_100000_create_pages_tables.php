<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pages', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title_en')->nullable();
            $table->string('title_fr')->nullable();
            $table->string('title_ar')->nullable();
            $table->string('subtitle_en')->nullable();
            $table->string('subtitle_fr')->nullable();
            $table->string('subtitle_ar')->nullable();
            $table->text('content_en')->nullable();
            $table->text('content_fr')->nullable();
            $table->text('content_ar')->nullable();
            $table->timestamps();
        });

        Schema::create('contact_settings', function (Blueprint $table) {
            $table->id();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('address_en')->nullable();
            $table->string('address_fr')->nullable();
            $table->string('address_ar')->nullable();
            $table->text('map_embed_url')->nullable();
            $table->timestamps();
        });

        Schema::create('page_images', function (Blueprint $table) {
            $table->id();
            $table->string('imageable_type');
            $table->unsignedBigInteger('imageable_id');
            $table->string('image_path');
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->index(['imageable_type', 'imageable_id']);
        });

        // Seed default page content
        DB::table('pages')->insert([
            [
                'slug' => 'about',
                'title_en' => 'About Souk AI',
                'title_fr' => 'À propos de Souk AI',
                'title_ar' => 'عن سوق أي آي',
                'subtitle_en' => 'Your Premium Marketplace',
                'subtitle_fr' => 'Votre marché premium',
                'subtitle_ar' => 'سوقك المتميز',
                'content_en' => 'Souk AI is a revolutionary AI-powered marketplace connecting exceptional sellers with discerning buyers across North Africa. Our platform combines cutting-edge technology with the rich tradition of commerce in the region.',
                'content_fr' => 'Souk AI est un marché révolutionnaire propulsé par l\'intelligence artificielle, connectant des vendeurs exceptionnels avec des acheteurs exigeants à travers l\'Afrique du Nord. Notre plateforme allie une technologie de pointe à la riche tradition commerciale de la région.',
                'content_ar' => 'سوق أي آي هو سوق ثوري مدعوم بالذكاء الاصطناعي يربط بين البائعين الاستثنائيين والمشترين المميزين في جميع أنحاء شمال أفريقيا. منصتنا تجمع بين أحدث التقنيات والتقاليد التجارية الغنية في المنطقة.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'slug' => 'contact',
                'title_en' => 'Get in Touch',
                'title_fr' => 'Contactez-nous',
                'title_ar' => 'تواصل معنا',
                'subtitle_en' => 'We\'d love to hear from you',
                'subtitle_fr' => 'Nous serions ravis d\'avoir de vos nouvelles',
                'subtitle_ar' => 'نحب أن نسمع منك',
                'content_en' => 'Have questions, suggestions, or want to partner with us? Reach out and our team will get back to you within 24 hours.',
                'content_fr' => 'Des questions, des suggestions ou envie de devenir partenaire ? Contactez-nous et notre équipe vous répondra dans les 24 heures.',
                'content_ar' => 'هل لديك أسئلة أو اقتراحات أو تريد الشراكة معنا؟ تواصل معنا وسيرد فريقنا عليك خلال 24 ساعة.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // Seed default contact settings
        DB::table('contact_settings')->insert([
            'email' => 'support@soukai.com',
            'phone' => '+216 00 000 000',
            'address_en' => 'Tunis, Tunisia',
            'address_fr' => 'Tunis, Tunisie',
            'address_ar' => 'تونس، تونس',
            'map_embed_url' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('page_images');
        Schema::dropIfExists('contact_settings');
        Schema::dropIfExists('pages');
    }
};
