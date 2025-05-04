# UI Components

This directory contains all the standardized UI components for the Gratify Pro application. These components are based on shadcn UI and use Tailwind CSS for styling.

## Usage

Import components from this directory:

```tsx
import { 
  Button, 
  Card, 
  CardHeader, 
  CardContent,
  // ... other components
} from '@/components/ui';
```

## Components

The following components are available:

### Button Components
- `Button` - Standard button component with variants
- `buttonVariants` - Utility for applying button styles to other elements

### Form Components
- `Form` - Form root component 
- `FormControl` - Form control component
- `FormDescription` - Form field description
- `FormField` - Form field wrapper
- `FormItem` - Form item wrapper
- `FormLabel` - Form label
- `FormMessage` - Form validation message

### Input Components
- `Input` - Standard input component

### Card Components
- `Card` - Card container
- `CardHeader` - Card header section
- `CardTitle` - Card title
- `CardDescription` - Card description text
- `CardContent` - Card content area
- `CardFooter` - Card footer section

### Select Components
- `Select` - Select root component
- `SelectContent` - Select dropdown content
- `SelectGroup` - Select options group
- `SelectItem` - Select option item
- `SelectLabel` - Select dropdown label
- `SelectTrigger` - Select trigger button
- `SelectValue` - Select value display

### Label Components
- `Label` - Form input label

## Styling

All components use Tailwind CSS classes. No CSS modules or additional stylesheets are required.

## Customization

To customize component styling, use the `className` prop along with Tailwind utility classes:

```tsx
<Button className="w-full px-8 py-3 text-lg">Custom Button</Button>
```

## Adding New Components

When adding new shadcn UI components:

1. Add the component file to this directory
2. Update the `index.ts` file to export it
3. Follow the consistent naming and styling patterns 