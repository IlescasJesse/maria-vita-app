# Material UI Setup - Maria Vita

## ✅ Installation Complete

Material UI has been successfully integrated into your Next.js project!

## 📦 Installed Packages

- `@mui/material` - Core Material UI components
- `@mui/icons-material` - Material Design icons
- `@mui/x-data-grid` - Advanced data grid component
- `@mui/x-date-pickers` - Date and time picker components
- `@emotion/react` & `@emotion/styled` - Styling engine (required by MUI)

## 🎨 Theme Configuration

Your custom theme is configured in [`src/styles/theme.ts`](../styles/theme.ts) with:
- Primary color: Blue (#1976d2) - Professional medical blue
- Secondary color: Green (#66bb6a) - Health green
- Spanish locale (esES)
- Custom typography and spacing

## 🚀 Usage Examples

### Basic Components

```tsx
import { Button, TextField, Box, Typography } from '@mui/material';

function MyComponent() {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Hello World
      </Typography>
      <TextField label="Name" fullWidth />
      <Button variant="contained" color="primary">
        Submit
      </Button>
    </Box>
  );
}
```

### Using Icons

```tsx
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';

<Button startIcon={<SaveIcon />}>Save</Button>
<Button startIcon={<DeleteIcon />}>Delete</Button>
```

### Layout Components

```tsx
import { Container, Grid, Card, CardContent } from '@mui/material';

<Container maxWidth="lg">
  <Grid container spacing={3}>
    <Grid item xs={12} md={6}>
      <Card>
        <CardContent>
          Content here
        </CardContent>
      </Card>
    </Grid>
  </Grid>
</Container>
```

### Data Grid Example

```tsx
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'firstName', headerName: 'First name', width: 150 },
  { field: 'lastName', headerName: 'Last name', width: 150 },
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon' },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei' },
];

<DataGrid rows={rows} columns={columns} />
```

### Date Picker Example

```tsx
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

<LocalizationProvider dateAdapter={AdapterDayjs}>
  <DatePicker label="Select Date" />
</LocalizationProvider>
```

## 📂 Project Structure

```
src/
├── components/
│   ├── ThemeRegistry.tsx        # MUI Theme Provider wrapper
│   └── examples/
│       └── MUIExamples.tsx      # Example components
├── styles/
│   └── theme.ts                 # MUI theme configuration
└── app/
    ├── layout.tsx               # Root layout with ThemeRegistry
    └── page.tsx                 # Example page using MUI
```

## 🎯 Common Patterns

### Form with Validation

```tsx
'use client';
import { TextField, Button } from '@mui/material';
import { useState } from 'react';

export function MyForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Invalid email');
      return;
    }
    // Submit logic
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={!!error}
        helperText={error}
        fullWidth
      />
      <Button type="submit" variant="contained">
        Submit
      </Button>
    </form>
  );
}
```

### Responsive Layout

```tsx
import { Box, useMediaQuery, useTheme } from '@mui/material';

export function ResponsiveComponent() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{
      p: isMobile ? 2 : 4,
      fontSize: isMobile ? '14px' : '16px'
    }}>
      Content
    </Box>
  );
}
```

### Custom Styling with sx prop

```tsx
<Box
  sx={{
    backgroundColor: 'primary.main',
    color: 'white',
    p: 2,
    borderRadius: 2,
    '&:hover': {
      backgroundColor: 'primary.dark',
    },
  }}
>
  Styled Box
</Box>
```

## 📚 Resources

- [Material UI Documentation](https://mui.com/material-ui/)
- [MUI Components](https://mui.com/material-ui/all-components/)
- [MUI Icons](https://mui.com/material-ui/material-icons/)
- [MUI X Data Grid](https://mui.com/x/react-data-grid/)
- [MUI X Date Pickers](https://mui.com/x/react-date-pickers/)

## 💡 Tips

1. **Client Components**: Use `'use client'` directive when using hooks or interactivity
2. **Server Components**: Keep components as server components by default for better performance
3. **Theme Access**: Use `useTheme()` hook to access theme values
4. **Responsive Design**: Use `useMediaQuery` for responsive behavior
5. **Icons**: Import only the icons you need to reduce bundle size

## 🔧 Next Steps

1. Explore the example components in `src/components/examples/MUIExamples.tsx`
2. Customize the theme in `src/styles/theme.ts` to match your brand
3. Build your application pages using MUI components
4. Check out the updated home page at `src/app/page.tsx` for a working example

Happy coding! 🎉
