/**
 * Tema Personalizado de Material UI para Maria Vita de Antequera
 * 
 * Sistema Médico - Diseño Elegante, Profesional y Limpio
 * Basado en la identidad corporativa del logo
 */

import { createTheme, ThemeOptions, alpha } from '@mui/material/styles';
import { esES } from '@mui/material/locale';

// ============================================
// PALETA DE COLORES CORPORATIVA - MARIA VITA DE ANTEQUERA
// ============================================

const colors = {
  // Colores primarios (verde del logo "de Antequera")
  primary: {
    main: '#00875F',      // Verde oscuro del logo
    light: '#6EBD96',     // Verde claro del logo
    dark: '#006045',      // Verde más oscuro
    contrastText: '#FFFFFF'
  },
  
  // Colores secundarios (azul púrpura del logo)
  secondary: {
    main: '#353080',      // Azul púrpura principal - Logo Maria Vita
    light: '#5F59A8',     // Azul púrpura claro para hover
    dark: '#252158',      // Azul púrpura oscuro
    contrastText: '#FFFFFF'
  },
  
  // Estados y alertas médicas
  error: {
    main: '#D32F2F',
    light: '#EF5350',
    dark: '#C62828',
    contrastText: '#FFFFFF'
  },
  warning: {
    main: '#F57C00',
    light: '#FF9800',
    dark: '#E65100',
    contrastText: '#FFFFFF'
  },
  info: {
    main: '#A3CDD9',      // Azul claro del logo "CONSULTORIOS"
    light: '#C5E0E8',
    dark: '#7AAFBF',
    contrastText: '#000000'
  },
  success: {
    main: '#00875F',      // Verde corporativo
    light: '#6EBD96',
    dark: '#006045',
    contrastText: '#FFFFFF'
  },
  
  // Escalas de grises - Tonos elegantes y limpios
  grey: {
    50: '#FAFAFA',
    100: '#F7F8FA',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121'
  }
};

// ============================================
// CONFIGURACIÓN DE TIPOGRAFÍA
// ============================================

const typography = {
  fontFamily: [
    'Inter',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"'
  ].join(','),
  
  // Encabezados
  h1: {
    fontSize: '2.5rem',      // 40px
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.01562em'
  },
  h2: {
    fontSize: '2rem',        // 32px
    fontWeight: 700,
    lineHeight: 1.3,
    letterSpacing: '-0.00833em'
  },
  h3: {
    fontSize: '1.75rem',     // 28px
    fontWeight: 600,
    lineHeight: 1.4,
    letterSpacing: '0em'
  },
  h4: {
    fontSize: '1.5rem',      // 24px
    fontWeight: 600,
    lineHeight: 1.4,
    letterSpacing: '0.00735em'
  },
  h5: {
    fontSize: '1.25rem',     // 20px
    fontWeight: 600,
    lineHeight: 1.5,
    letterSpacing: '0em'
  },
  h6: {
    fontSize: '1.125rem',    // 18px
    fontWeight: 600,
    lineHeight: 1.6,
    letterSpacing: '0.0075em'
  },
  
  // Cuerpo de texto
  body1: {
    fontSize: '1rem',        // 16px
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: '0.00938em'
  },
  body2: {
    fontSize: '0.875rem',    // 14px
    fontWeight: 400,
    lineHeight: 1.43,
    letterSpacing: '0.01071em'
  },
  
  // Subtítulos
  subtitle1: {
    fontSize: '1rem',
    fontWeight: 500,
    lineHeight: 1.75,
    letterSpacing: '0.00938em'
  },
  subtitle2: {
    fontSize: '0.875rem',
    fontWeight: 500,
    lineHeight: 1.57,
    letterSpacing: '0.00714em'
  },
  
  // Botones
  button: {
    fontSize: '0.875rem',
    fontWeight: 600,
    lineHeight: 1.75,
    letterSpacing: '0.02857em',
    textTransform: 'none' as const
  },
  
  // Otros
  caption: {
    fontSize: '0.75rem',     // 12px
    fontWeight: 400,
    lineHeight: 1.66,
    letterSpacing: '0.03333em'
  },
  overline: {
    fontSize: '0.75rem',
    fontWeight: 600,
    lineHeight: 2.66,
    letterSpacing: '0.08333em',
    textTransform: 'uppercase' as const
  }
};

// ============================================
// CONFIGURACIÓN DE COMPONENTES
// ============================================

const components = {
  // Botones
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        padding: '10px 24px',
        boxShadow: 'none',
        fontWeight: 600,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          boxShadow: 'none',
          transform: 'translateY(-2px)'
        }
      },
      contained: {
        '&:hover': {
          boxShadow: '0 8px 16px rgba(53, 48, 128, 0.2)'
        }
      },
      containedPrimary: {
        background: 'linear-gradient(135deg, #353080 0%, #5D57B3 100%)',
        '&:hover': {
          background: 'linear-gradient(135deg, #252159 0%, #353080 100%)',
        }
      },
      containedSecondary: {
        background: 'linear-gradient(135deg, #2D9F6F 0%, #5BB88F 100%)',
        '&:hover': {
          background: 'linear-gradient(135deg, #1F7050 0%, #2D9F6F 100%)',
        }
      },
      sizeLarge: {
        padding: '14px 32px',
        fontSize: '1rem',
        borderRadius: 14
      },
      sizeSmall: {
        padding: '6px 16px',
        fontSize: '0.8125rem',
        borderRadius: 10
      }
    }
  },
  
  // Tarjetas - Diseño limpio y elegante
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        boxShadow: '0 2px 8px rgba(53, 48, 128, 0.06)',
        border: '1px solid rgba(53, 48, 128, 0.08)',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          boxShadow: '0 8px 24px rgba(53, 48, 128, 0.12)',
          borderColor: 'rgba(53, 48, 128, 0.12)',
          transform: 'translateY(-2px)'
        }
      }
    }
  },
  
  // Encabezados de tarjetas
  MuiCardHeader: {
    styleOverrides: {
      root: {
        padding: '24px 24px 16px',
        borderBottom: '1px solid rgba(53, 48, 128, 0.08)'
      },
      title: {
        fontSize: '1.25rem',
        fontWeight: 600,
        color: '#353080'
      },
      subheader: {
        color: '#666666'
      }
    }
  },
  
  // Contenido de tarjetas
  MuiCardContent: {
    styleOverrides: {
      root: {
        padding: '24px',
        '&:last-child': {
          paddingBottom: '24px'
        }
      }
    }
  },
  
  // Campos de texto - Estilo limpio y elegante
  MuiTextField: {
    defaultProps: {
      variant: 'outlined' as const
    },
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 12,
          transition: 'all 0.2s ease-in-out',
          backgroundColor: '#FFFFFF',
          '&:hover': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#353080',
              borderWidth: '2px'
            }
          },
          '&.Mui-focused': {
            backgroundColor: '#FFFFFF',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#353080',
              borderWidth: '2.5px'
            }
          }
        }
      }
    }
  },
  
  // Inputs
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: alpha('#353080', 0.5)
        }
      },
      input: {
        padding: '14px 16px'
      },
      notchedOutline: {
        borderColor: 'rgba(0,0,0,0.08)',
        borderWidth: '1.5px',
        transition: 'all 0.2s ease-in-out'
      }
    }
  },
  
  // Labels
  MuiInputLabel: {
    styleOverrides: {
      root: {
        fontSize: '0.875rem',
        fontWeight: 500,
        color: '#666666'
      }
    }
  },
  
  // Chip
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 10,
        fontWeight: 500,
        border: '1px solid rgba(0,0,0,0.08)'
      },
      filled: {
        backgroundColor: alpha('#353080', 0.1),
        color: '#353080',
        '&:hover': {
          backgroundColor: alpha('#353080', 0.15)
        }
      },
      colorPrimary: {
        backgroundColor: '#353080',
        color: '#FFFFFF'
      },
      colorSecondary: {
        backgroundColor: '#2D9F6F',
        color: '#FFFFFF'
      }
    }
  },
  
  // Paper
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        border: '1px solid rgba(0,0,0,0.05)'
      },
      elevation1: {
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)'
      },
      elevation2: {
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
      },
      elevation3: {
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
      }
    }
  },
  
  // Diálogos
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: 20,
        boxShadow: '0 24px 48px rgba(53, 48, 128, 0.15)',
        border: '1px solid rgba(0,0,0,0.05)'
      }
    }
  },
  
  // Títulos de diálogo
  MuiDialogTitle: {
    styleOverrides: {
      root: {
        fontSize: '1.5rem',
        fontWeight: 700,
        padding: '24px 24px 16px',
        color: '#353080',
        borderBottom: '1px solid rgba(0,0,0,0.05)'
      }
    }
  },
  
  // Contenido de diálogo
  MuiDialogContent: {
    styleOverrides: {
      root: {
        padding: '24px'
      }
    }
  },
  
  // Acciones de diálogo
  MuiDialogActions: {
    styleOverrides: {
      root: {
        padding: '16px 24px 24px',
        gap: '12px',
        borderTop: '1px solid rgba(0,0,0,0.05)'
      }
    }
  },
  
  // Alertas
  MuiAlert: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        padding: '12px 16px',
        fontSize: '0.875rem',
        border: '1px solid',
        fontWeight: 500
      },
      standardSuccess: {
        backgroundColor: alpha('#2D9F6F', 0.08),
        color: '#1F7050',
        borderColor: alpha('#2D9F6F', 0.2)
      },
      standardInfo: {
        backgroundColor: alpha('#7CB8E8', 0.08),
        color: '#5899D1',
        borderColor: alpha('#7CB8E8', 0.2)
      },
      standardWarning: {
        backgroundColor: alpha('#F57C00', 0.08),
        color: '#E65100',
        borderColor: alpha('#F57C00', 0.2)
      },
      standardError: {
        backgroundColor: alpha('#D32F2F', 0.08),
        color: '#C62828',
        borderColor: alpha('#D32F2F', 0.2)
      }
    }
  },
  
  // DataGrid
  MuiDataGrid: {
    styleOverrides: {
      root: {
        border: '1px solid rgba(0,0,0,0.05)',
        borderRadius: 16,
        '& .MuiDataGrid-cell': {
          borderBottom: `1px solid ${alpha('#000', 0.05)}`
        },
        '& .MuiDataGrid-columnHeaders': {
          backgroundColor: alpha('#353080', 0.04),
          borderBottom: `2px solid ${alpha('#353080', 0.1)}`,
          fontWeight: 600,
          color: '#353080',
          borderRadius: '16px 16px 0 0'
        },
        '& .MuiDataGrid-cell:focus': {
          outline: 'none'
        },
        '& .MuiDataGrid-columnHeader:focus': {
          outline: 'none'
        },
        '& .MuiDataGrid-row:hover': {
          backgroundColor: alpha('#353080', 0.03)
        }
      }
    }
  },
  
  // Tabs
  MuiTab: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        fontWeight: 600,
        fontSize: '0.9375rem',
        minHeight: 48,
        color: '#666666',
        '&.Mui-selected': {
          color: '#353080'
        }
      }
    }
  },
  
  // Indicator de Tabs
  MuiTabs: {
    styleOverrides: {
      indicator: {
        height: 3,
        borderRadius: '3px 3px 0 0',
        backgroundColor: '#353080'
      }
    }
  },
  
  // AppBar
  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: '0 2px 12px rgba(53, 48, 128, 0.08)',
        backgroundColor: '#FFFFFF',
        color: '#353080',
        borderBottom: '1px solid rgba(0,0,0,0.05)'
      }
    }
  },
  
  // Drawer
  MuiDrawer: {
    styleOverrides: {
      paper: {
        borderRadius: 0,
        borderRight: `1px solid ${alpha('#353080', 0.08)}`,
        backgroundColor: '#FAFAFA'
      }
    }
  },
  
  // List Items
  MuiListItemButton: {
    styleOverrides: {
      root: {
        borderRadius: 10,
        margin: '4px 8px',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          backgroundColor: alpha('#353080', 0.08)
        },
        '&.Mui-selected': {
          backgroundColor: alpha('#353080', 0.12),
          color: '#353080',
          '&:hover': {
            backgroundColor: alpha('#353080', 0.16)
          }
        }
      }
    }
  },
  
  // Tooltips
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        backgroundColor: alpha('#353080', 0.95),
        fontSize: '0.75rem',
        borderRadius: 8,
        padding: '8px 12px'
      },
      arrow: {
        color: alpha('#353080', 0.95)
      }
    }
  },
  
  // Switch
  MuiSwitch: {
    styleOverrides: {
      root: {
        width: 42,
        height: 26,
        padding: 0
      },
      switchBase: {
        padding: 1,
        '&.Mui-checked': {
          transform: 'translateX(16px)',
          color: '#FFFFFF',
          '& + .MuiSwitch-track': {
            backgroundColor: '#353080',
            opacity: 1
          }
        }
      },
      thumb: {
        width: 24,
        height: 24,
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
      },
      track: {
        borderRadius: 13,
        opacity: 1,
        backgroundColor: alpha('#000', 0.15)
      }
    }
  },
  
  // Divider
  MuiDivider: {
    styleOverrides: {
      root: {
        borderColor: alpha('#353080', 0.08)
      }
    }
  }
};

// ============================================
// CREAR TEMA
// ============================================

const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    ...colors,
    background: {
      default: '#FFFFFF',      // Fondo blanco puro
      paper: '#FFFFFF'         // Tarjetas blanco puro
    },
    divider: alpha('#353080', 0.08),
    text: {
      primary: '#1A1A1A',
      secondary: '#666666',
      disabled: '#BDBDBD'
    }
  },
  typography,
  components,
  shape: {
    borderRadius: 12  // Bordes más redondeados para elegancia
  },
  spacing: 8, // Base de espaciado (1 unidad = 8px)
  
  // Breakpoints personalizados
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920
    }
  },
  
  // Transiciones
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)'
    }
  },
  
  // Sombras personalizadas (sutiles y elegantes)
  shadows: [
    'none',
    '0 1px 3px rgba(53, 48, 128, 0.08)',
    '0 2px 4px rgba(53, 48, 128, 0.08)',
    '0 3px 6px rgba(53, 48, 128, 0.1)',
    '0 4px 8px rgba(53, 48, 128, 0.1)',
    '0 5px 10px rgba(53, 48, 128, 0.12)',
    '0 6px 12px rgba(53, 48, 128, 0.12)',
    '0 7px 14px rgba(53, 48, 128, 0.14)',
    '0 8px 16px rgba(53, 48, 128, 0.14)',
    '0 9px 18px rgba(53, 48, 128, 0.16)',
    '0 10px 20px rgba(53, 48, 128, 0.16)',
    '0 11px 22px rgba(53, 48, 128, 0.18)',
    '0 12px 24px rgba(53, 48, 128, 0.18)',
    '0 13px 26px rgba(53, 48, 128, 0.2)',
    '0 14px 28px rgba(53, 48, 128, 0.2)',
    '0 15px 30px rgba(53, 48, 128, 0.22)',
    '0 16px 32px rgba(53, 48, 128, 0.22)',
    '0 17px 34px rgba(53, 48, 128, 0.24)',
    '0 18px 36px rgba(53, 48, 128, 0.24)',
    '0 19px 38px rgba(53, 48, 128, 0.26)',
    '0 20px 40px rgba(53, 48, 128, 0.26)',
    '0 21px 42px rgba(53, 48, 128, 0.28)',
    '0 22px 44px rgba(53, 48, 128, 0.28)',
    '0 23px 46px rgba(53, 48, 128, 0.3)',
    '0 1px 3px rgba(53, 48, 128, 0.12), 0 1px 2px rgba(53, 48, 128, 0.24)'
  ],
  
  // Z-index
  zIndex: {
    mobileStepper: 1000,
    fab: 1050,
    speedDial: 1050,
    appBar: 1100,
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500
  }
};

// Crear tema con localización en español
const theme = createTheme(themeOptions, esES);

export default theme;

// ============================================
// TEMA OSCURO (OPCIONAL)
// ============================================

export const darkTheme = createTheme({
  ...themeOptions,
  palette: {
    mode: 'dark',
    primary: {
      main: '#7B75D0',
      light: '#9A95DC',
      dark: '#5D57B3',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#5BB88F',
      light: '#7CC8A5',
      dark: '#2D9F6F',
      contrastText: '#000000'
    },
    error: {
      main: '#EF5350',
      light: '#FF7F7F',
      dark: '#C62828',
      contrastText: '#FFFFFF'
    },
    warning: {
      main: '#FF9800',
      light: '#FFB74D',
      dark: '#F57C00',
      contrastText: '#000000'
    },
    info: {
      main: '#A3CFF2',
      light: '#C3E0F7',
      dark: '#7CB8E8',
      contrastText: '#000000'
    },
    success: {
      main: '#5BB88F',
      light: '#7CC8A5',
      dark: '#2D9F6F',
      contrastText: '#000000'
    },
    background: {
      default: '#0F0E1E',      // Azul oscuro muy profundo
      paper: '#1A1830'         // Azul oscuro para tarjetas
    },
    divider: alpha('#FFFFFF', 0.08),
    text: {
      primary: '#FFFFFF',
      secondary: alpha('#FFFFFF', 0.7),
      disabled: alpha('#FFFFFF', 0.5)
    }
  }
}, esES);

// ============================================
// UTILIDADES DE TEMA
// ============================================

// Colores de estado para uso en la aplicación (con paleta corporativa)
export const statusColors = {
  pending: '#F57C00',      // Naranja - Pendiente
  inProgress: '#7CB8E8',   // Azul celeste - En progreso
  completed: '#2D9F6F',    // Verde corporativo - Completado
  cancelled: '#D32F2F',    // Rojo - Cancelado
  scheduled: '#7CB8E8',    // Azul celeste - Agendado
  confirmed: '#2D9F6F',    // Verde corporativo - Confirmado
  urgent: '#D32F2F',       // Rojo - Urgente
  normal: '#666666',       // Gris - Normal
  high: '#F57C00'          // Naranja - Alto
};

// Colores de especialidades médicas (actualizados con paleta corporativa)
export const specialtyColors = {
  cardiology: '#E91E63',      // Rosa - Cardiología
  neurology: '#353080',       // Azul púrpura corporativo - Neurología
  pediatrics: '#7CB8E8',      // Azul celeste - Pediatría
  orthopedics: '#FF5722',     // Naranja rojizo - Ortopedia
  dermatology: '#795548',     // Marrón - Dermatología
  ophthalmology: '#7CB8E8',   // Azul celeste - Oftalmología
  general: '#666666',         // Gris - General
  laboratory: '#2D9F6F',      // Verde corporativo - Laboratorio
  radiology: '#353080',       // Azul púrpura corporativo - Radiología
  emergency: '#D32F2F',       // Rojo - Emergencias
  gynecology: '#E91E63',      // Rosa - Ginecología
  obstetrics: '#5BB88F'       // Verde claro - Obstetricia
};

// Función helper para obtener color con opacidad
export const getColorWithOpacity = (color: string, opacity: number) => alpha(color, opacity);
