# Souk-AI Design System

## 1. Layout Structure
The application follows a unified glassmorphism-based layout system designed for high-density administrative work while maintaining a premium, "Apple-like" aesthetic.

### **Base Template Hierarchy**
- **DashboardLayout.jsx**: The top-level wrapper.
  - **Sidebar.jsx**: Fixed at 280px (xl screens), collapsible on mobile.
  - **Header.jsx**: Sticky top bar with language/theme selectors and profile controls.
  - **Main Container**: A centered responsive area with `rounded-[40px]`, `bg-card/40`, and `backdrop-blur-md`.
    - **AdminPageLayout.jsx**: Standardized wrapper for every page.
      - **Header Section**: Title, Subtitle, Page Icon, and Primary Actions (e.g., "Add").
      - **Content Section**: Data tables or forms wrapped in `CardBox`.

---

## 2. Component Library

### **Reusable Components**
| Component | Description | key Props |
| :--- | :--- | :--- |
| **AdminPageLayout** | Uniform structure for all internal pages. | `title`, `subtitle`, `icon`, `onAdd`, `onBack` |
| **CardBox** | Glassmorphism styled container with subtle borders. | `children`, `className` |
| **Modal** | Premium replacement for Dialogs with spring animations. | `isOpen`, `onClose`, `title`, `subtitle`, `icon`, `footer` |
| **Button** | Standardized radii and hover states. | `variant (ghost, outline, primary)`, `size`, `className` |
| **Input** | Clean inputs with `bg-muted/30` and rounded corners. | `type`, `placeholder`, `required` |

---

## 3. Design Tokens

### **Colors (HSL/Hex)**
| Token | Light Mode | Dark Mode | Usage |
| :--- | :--- | :--- | :--- |
| **Primary** | `#198353` | `#198353` | Action buttons, active states. |
| **Secondary** | `#14E9E2` | `#14E9E2` | Accent gradients, highlights. |
| **Background** | `#f4f7fb` | `#1a2537` | Global viewport background. |
| **Card** | `#ffffff` | `#233044` | Panel backgrounds (`bg-card`). |
| **Border** | `#e0e6eb` | `#333f55` | Glass edges (`border-border/60`). |

### **Typography & Spacing**
- **Font**: `Instrument Sans` (Main), `Inter` (Fallback).
- **Radii**: 
  - Main Layout: `40px`
  - Cards/Modals: `32px`
  - Secondary Elements: `24px`
  - Buttons/Inputs: `12px` to `16px`
- **Blur Intensity**: Standardized on `backdrop-blur-md` for layouts and `backdrop-blur-sm` for cards/overlays.

### **Image Fallback Standards**
All product images **MUST** implement a fallback to the standard placeholder image when no image exists.

**Fallback Image Path:**
```
/storage/empty/empty.webp
```

**Implementation Patterns:**

**Blade/PHP (Laravel Views):**
```blade
@if($product->albums->first())
    <img src="/storage/{{ $product->albums->first()->file }}" alt="{{ $product->name_en }}" class="w-full h-full object-cover">
@else
    <img src="/storage/empty/empty.webp" alt="{{ $product->name_en }}" class="w-full h-full object-cover">
@endif
```

**React/JSX (Admin & Store Panels):**
```jsx
{product.albums && product.albums.length > 0 ? (
    <img src={`/storage/${product.albums[0].file}`} alt="" className="w-full h-full object-cover" />
) : (
    <img src="/storage/empty/empty.webp" alt="" className="w-full h-full object-cover" />
)}
```

**Files Requiring This Standard:**
- `resources/views/public/home.blade.php`
- `resources/views/public/category.blade.php`
- `resources/views/public/product.blade.php`
- `resources/js/pages/admin/Products.jsx`
- `resources/js/pages/admin/Orders.jsx`
- `resources/js/pages/store/Products.jsx`
- `resources/js/pages/store/Orders.jsx`

---

## 4. Implementation Rules

### **Creating a New Page**
Every new administrative page MUST be wrapped in the `AdminPageLayout` component.

```jsx
import AdminPageLayout from '@/components/shared/AdminPageLayout';
import { Sparkles } from 'lucide-react';

const MyPage = () => {
    return (
        <AdminPageLayout
            title="page.title"      // Translation key or string
            subtitle="page.desc"    // Hint text
            icon={Sparkles}         // Lucide icon component
            onAdd={() => {}}        // Optional: Primary action
        >
            {/* Page Content goes here, usually in CardBox */}
        </AdminPageLayout>
    );
};
```

### **Using Modals**
Never use legacy `Dialog` components. Use the `Modal` component for consistency.

```jsx
<Modal
    isOpen={show}
    onClose={() => setShow(false)}
    title={t('form.title')}
    subtitle="Optional descriptor"
    icon={Sparkles}
    footer={<Button onClick={handleSave}>Save</Button>}
>
    <form>...</form>
</Modal>
```

---

## 5. Sync Requirements
- **READ FIRST**: Before any code modification, run `view_file` on this document.
- **IDENTICAL DESIGN**: No ad-hoc styling. Use established utility classes (`backdrop-blur-md`, `bg-card/40`) to maintain the system integrity.
- **AUTO-SYNC**: If any global style in `app.css` or component structure is changed, this file must be updated immediately in the same turn.

## 6. Page Creation Workflow (Frontend & Localization)

When adding a new page or feature module to the application, follow this exact sequence to ensure architectural and visual consistency:

### 1. Route Registration (Backend & Frontend)
- **Backend API (`routes/api.php`)**: Ensure the respective endpoint exists inside the `auth:sanctum` and `ability:admin` middleware groups for secure access. Use the correct URL structures (e.g., `/admin/categories`).
- **Frontend Routing (`app.jsx`)**: Import the new component inside `resources/js/app.jsx` and map it to a specific route inside the `<DashboardLayout>` wrapper. Make sure to define proper permissions or middleware (if applicable in the router setup).

### 2. Localization Strategy (i18n)
All text in the user interface **MUST** be fully localizable from Day 1. Avoid writing hardcoded strings. Use `react-i18next` efficiently.
1. **Import Hook**: Destructure the translation function in your component:
   ```javascript
   import { useTranslation } from 'react-i18next';
   const { t } = useTranslation();
   ```
2. **Setup Translation Keys**: Map UI copy inside `en.json`, `fr.json`, and `ar.json` simultaneously. Structure it logically: `pageName.sectionName.stringName`.
3. **Usage**:
   ```javascript
   <h2 className="text-xl font-bold">{t('admin.categories.title')}</h2>
   ```
   **Important Rule for Forms**: Ensure input placeholders, dropdown options, table headers, and modal text (submit/cancel) are all passed into the `t()` function. Do not omit any files. If you add a key to `fr.json`, you **must** append the exact same structure to `ar.json` and `en.json` in the same turn.

### 3. Component Hierarchy & Logic
- Utilize the design components precisely as defined in section 4.
- Make optimal use of `AdminPageLayout` for the outer shell to guarantee the global top-right action buttons and standardized heading.
- For lists or CRUD operations, keep state management within the main page container (e.g., `Categories.jsx`), and pass handlers conditionally into the standardized `Modal` component.
- **RTL Integrity**: Because `ar.json` is heavily utilized, ensure inputs dynamically respect directionality via `dir="rtl"` in local overrides or by relying on global i18next document attribute shifting. Use directional classes (like `text-start` or `text-end` instead of `text-left` / `text-right` where appropriate).
