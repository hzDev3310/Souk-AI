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
