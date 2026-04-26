<?php

use App\Models\Setting;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        $settings = [
            ['key' => 'website_logo', 'value' => null, 'type' => 'image', 'group' => 'branding'],

            ['key' => 'gemini_api_key', 'value' => null, 'type' => 'password', 'group' => 'ai'],
            ['key' => 'gemini_embedding_model', 'value' => 'models/gemini-embedding-001', 'type' => 'select', 'group' => 'ai'],

            ['key' => 'contact_phone', 'value' => '+216 00 000 000', 'type' => 'text', 'group' => 'general'],
            ['key' => 'contact_address_en', 'value' => 'Tunis, Tunisia', 'type' => 'text', 'group' => 'general'],
            ['key' => 'contact_address_fr', 'value' => 'Tunis, Tunisie', 'type' => 'text', 'group' => 'general'],
            ['key' => 'contact_address_ar', 'value' => 'تونس، تونس', 'type' => 'text', 'group' => 'general'],
            ['key' => 'contact_location_url', 'value' => '', 'type' => 'text', 'group' => 'general'],

            ['key' => 'footer_about_en', 'value' => 'Souk AI helps shoppers discover trusted stores, standout products, and a smoother way to buy online.', 'type' => 'text', 'group' => 'pages'],
            ['key' => 'footer_about_fr', 'value' => 'Souk AI aide les clients a decouvrir des boutiques fiables, des produits remarquables et une experience d achat plus fluide.', 'type' => 'text', 'group' => 'pages'],
            ['key' => 'footer_about_ar', 'value' => 'يساعد Souk AI المتسوقين على اكتشاف متاجر موثوقة ومنتجات مميزة وتجربة شراء اكثر سلاسة.', 'type' => 'text', 'group' => 'pages'],

            ['key' => 'about_title_en', 'value' => 'About Souk AI', 'type' => 'text', 'group' => 'pages'],
            ['key' => 'about_title_fr', 'value' => 'A propos de Souk AI', 'type' => 'text', 'group' => 'pages'],
            ['key' => 'about_title_ar', 'value' => 'من نحن', 'type' => 'text', 'group' => 'pages'],
            ['key' => 'about_content_en', 'value' => "Souk AI is a modern marketplace built to connect customers with trusted stores and carefully selected products.\n\nWe focus on clarity, speed, and confidence at every step of the shopping journey.", 'type' => 'text', 'group' => 'pages'],
            ['key' => 'about_content_fr', 'value' => "Souk AI est une marketplace moderne concue pour connecter les clients a des boutiques fiables et a des produits soigneusement selectionnes.\n\nNous mettons l accent sur la clarte, la rapidite et la confiance a chaque etape du parcours d achat.", 'type' => 'text', 'group' => 'pages'],
            ['key' => 'about_content_ar', 'value' => "Souk AI هو متجر الكتروني حديث يربط العملاء بمتاجر موثوقة ومنتجات مختارة بعناية.\n\nنركز على الوضوح والسرعة والثقة في كل خطوة من رحلة الشراء.", 'type' => 'text', 'group' => 'pages'],

            ['key' => 'terms_title_en', 'value' => 'Terms and Conditions', 'type' => 'text', 'group' => 'pages'],
            ['key' => 'terms_title_fr', 'value' => 'Conditions generales', 'type' => 'text', 'group' => 'pages'],
            ['key' => 'terms_title_ar', 'value' => 'الشروط والاحكام', 'type' => 'text', 'group' => 'pages'],
            ['key' => 'terms_content_en', 'value' => "By using Souk AI, you agree to use the platform lawfully and provide accurate information when placing orders.\n\nStores are responsible for their catalog content, pricing, and fulfillment commitments.", 'type' => 'text', 'group' => 'pages'],
            ['key' => 'terms_content_fr', 'value' => "En utilisant Souk AI, vous acceptez d utiliser la plateforme de maniere legale et de fournir des informations exactes lors de vos commandes.\n\nLes boutiques sont responsables du contenu de leur catalogue, de leurs prix et de leurs engagements de livraison.", 'type' => 'text', 'group' => 'pages'],
            ['key' => 'terms_content_ar', 'value' => "باستخدام Souk AI، فإنك توافق على استخدام المنصة بشكل قانوني وتقديم معلومات صحيحة عند اجراء الطلبات.\n\nتتحمل المتاجر مسؤولية محتوى منتجاتها واسعارها والتزاماتها في التنفيذ.", 'type' => 'text', 'group' => 'pages'],

            ['key' => 'contact_title_en', 'value' => 'Contact Us', 'type' => 'text', 'group' => 'pages'],
            ['key' => 'contact_title_fr', 'value' => 'Contactez-nous', 'type' => 'text', 'group' => 'pages'],
            ['key' => 'contact_title_ar', 'value' => 'اتصل بنا', 'type' => 'text', 'group' => 'pages'],
            ['key' => 'contact_content_en', 'value' => "Reach out to our team for store support, orders, partnerships, or any question about the platform.\n\nWe will get back to you as quickly as possible.", 'type' => 'text', 'group' => 'pages'],
            ['key' => 'contact_content_fr', 'value' => "Contactez notre equipe pour l assistance des boutiques, les commandes, les partenariats ou toute question sur la plateforme.\n\nNous vous repondrons dans les meilleurs delais.", 'type' => 'text', 'group' => 'pages'],
            ['key' => 'contact_content_ar', 'value' => "تواصل مع فريقنا بخصوص دعم المتاجر او الطلبات او الشراكات او اي سؤال يتعلق بالمنصة.\n\nسنعود اليك في اقرب وقت ممكن.", 'type' => 'text', 'group' => 'pages'],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(['key' => $setting['key']], $setting);
        }
    }

    public function down(): void
    {
        Setting::whereIn('key', [
            'website_logo',
            'gemini_api_key',
            'gemini_embedding_model',
            'contact_phone',
            'contact_address_en',
            'contact_address_fr',
            'contact_address_ar',
            'contact_location_url',
            'footer_about_en',
            'footer_about_fr',
            'footer_about_ar',
            'about_title_en',
            'about_title_fr',
            'about_title_ar',
            'about_content_en',
            'about_content_fr',
            'about_content_ar',
            'terms_title_en',
            'terms_title_fr',
            'terms_title_ar',
            'terms_content_en',
            'terms_content_fr',
            'terms_content_ar',
            'contact_title_en',
            'contact_title_fr',
            'contact_title_ar',
            'contact_content_en',
            'contact_content_fr',
            'contact_content_ar',
        ])->delete();
    }
};
