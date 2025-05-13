# Using Tailwind CSS in Your React Project

## Basic Usage

Tailwind CSS allows you to style your components directly in your JSX using utility classes. Here's how to use it:

```jsx
// Example of using Tailwind classes
<div className="flex items-center justify-between p-4 bg-blue-100 rounded-lg shadow">
  <h2 className="text-xl font-bold text-gray-800">Hello Tailwind</h2>
  <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
    Click me
  </button>
</div>
```

## Common Utility Classes

### Layout
- `flex`, `grid`, `block`, `inline`, `hidden`
- `flex-row`, `flex-col`, `flex-wrap`
- `justify-start`, `justify-center`, `justify-between`, `justify-around`
- `items-start`, `items-center`, `items-end`, `items-stretch`

### Spacing
- `p-4` (padding: 1rem)
- `px-4` (padding-left and padding-right: 1rem)
- `py-2` (padding-top and padding-bottom: 0.5rem)
- `m-4` (margin: 1rem)
- `mx-auto` (margin-left: auto; margin-right: auto)
- `mt-4`, `mb-2`, `ml-3`, `mr-1` (margin-top, bottom, left, right)

### Typography
- `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`
- `font-thin`, `font-normal`, `font-medium`, `font-bold`
- `text-left`, `text-center`, `text-right`
- `text-blue-500`, `text-gray-800`, `text-white`

### Backgrounds & Borders
- `bg-white`, `bg-blue-500`, `bg-opacity-50`
- `border`, `border-2`, `border-blue-500`
- `rounded`, `rounded-md`, `rounded-full`
- `shadow`, `shadow-md`, `shadow-lg`

### Interactive
- `hover:bg-blue-600`, `focus:outline-none`, `active:bg-blue-700`
- `transition`, `duration-300`, `ease-in-out`

## Responsive Design

Tailwind makes responsive design easy with breakpoint prefixes:

```jsx
<div className="w-full md:w-1/2 lg:w-1/3">
  {/* Full width on mobile, half width on medium screens, third width on large screens */}
</div>
```

Common breakpoints:
- `sm:` (640px and up)
- `md:` (768px and up)
- `lg:` (1024px and up)
- `xl:` (1280px and up)
- `2xl:` (1536px and up)

## Custom Styling

### Using @apply in CSS files

You can use Tailwind's `@apply` directive in your CSS files to extract common patterns:

```css
/* In your CSS file */
.btn-primary {
  @apply px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600;
}
```

Then use it in your JSX:

```jsx
<button className="btn-primary">Click me</button>
```

### Extending Tailwind

You can extend Tailwind's default configuration in the `tailwind.config.js` file:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        'brand-blue': '#1992d4',
      },
      spacing: {
        '72': '18rem',
      }
    }
  }
}
```

## Best Practices

1. Group related utilities with comments
2. Extract components for reusable UI patterns
3. Use meaningful class ordering (layout → typography → visual styles)
4. Consider using plugins for common patterns
5. Use the official Tailwind CSS IntelliSense extension for VS Code

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind CSS Cheat Sheet](https://nerdcave.com/tailwind-cheat-sheet)
- [Tailwind UI Components](https://tailwindui.com/)