# 🚀 Professional Portfolio Template - Astro + Tailwind CSS

[![Deploy to GitHub Pages](https://github.com/Joscart/joscart.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/Joscart/joscart.github.io/actions/workflows/deploy.yml)
[![Astro](https://img.shields.io/badge/Built%20with-Astro-orange)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/Styled%20with-Tailwind%20CSS-blue)](https://tailwindcss.com)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

> ✨ **¡Usa este template para crear tu propio portafolio profesional!** ✨
> 
> Un template moderno y profesional para portafolios de desarrolladores, construido con **Astro** y **Tailwind CSS**. Diseñado con una paleta de colores azul oscuro profesional y arquitectura basada en componentes.

## 🌟 Demo en Vivo

Visita el portfolio en funcionamiento: **[joscart.github.io](https://joscart.github.io)**

## 📸 Capturas de Pantalla

### Página Principal
- Hero section con gradientes profesionales
- Secciones de habilidades y experiencia
- Diseño completamente responsive

### Páginas Incluidas
- 🏠 **Inicio**: Presentación profesional con call-to-actions
- 👨‍💻 **Sobre mí**: Educación, experiencia y valores
- 🚀 **Proyectos**: Showcase de trabajos y tecnologías

## ✨ Características

### 🎨 Diseño Profesional
- **Paleta de colores azul oscuro** - Elegante y profesional
- **Gradientes modernos** - Visual impactante
- **Tipografía personalizada** - Fuentes Google (Inter + Poppins)
- **Animaciones suaves** - Transiciones CSS profesionales

### 🏗️ Arquitectura Moderna
- **Component-Driven** - Componentes reutilizables
- **Astro Framework** - Rendimiento superior
- **Tailwind CSS** - Desarrollo rápido y consistente
- **TypeScript** - Tipado seguro

### 📱 Responsive & Accesible
- **Mobile-First** - Diseño optimizado para móviles
- **Navegación flotante** - UX moderna
- **SEO Optimizado** - Meta tags y estructura semántica
- **Rendimiento A+** - Carga ultra rápida

### 🚀 Deploy Automático
- **GitHub Actions** - CI/CD integrado
- **GitHub Pages** - Hosting gratuito
- **Deploy automático** - Cada push a main

## 🛠️ Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Astro** | 5.12.8 | Framework principal |
| **Tailwind CSS** | 3.4.0 | Estilos y diseño |
| **TypeScript** | Latest | Tipado seguro |
| **Google Fonts** | - | Tipografía profesional |

## 🚀 Guía de Inicio Rápido

### 1. Usar este Template

Haz clic en **"Use this template"** en GitHub o:

```bash
# Clona el repositorio
git clone https://github.com/Joscart/joscart.github.io.git mi-portfolio

# Navega al directorio
cd mi-portfolio/joscart-website

# Instala las dependencias
npm install
```

### 2. Personalización Rápida

#### Información Personal
Edita `src/pages/index.astro`:
```astro
---
// Cambia estos datos por los tuyos
const personalInfo = {
  name: "Tu Nombre",
  title: "Tu Título Profesional",
  description: "Tu descripción profesional",
  email: "tu@email.com",
  github: "https://github.com/tu-usuario"
};
---
```

#### Colores del Tema
Modifica `tailwind.config.mjs`:
```javascript
// Personaliza la paleta de colores
colors: {
  primary: {
    // Tu color primario
    500: '#tu-color-principal',
    // ... otros tonos
  }
}
```

#### Habilidades y Experiencia
Edita `src/components/Skills.astro`:
```javascript
const skills = {
  languages: ['HTML', 'CSS', 'JavaScript'], // Tus lenguajes
  tools: ['Git', 'VS Code'], // Tus herramientas
  // ... más categorías
};
```

### 3. Desarrollo Local

```bash
# Inicia el servidor de desarrollo
npm run dev

# Tu sitio estará disponible en:
# http://localhost:4321
```

### 4. Deploy en GitHub Pages

#### 🚀 Configuración Automática (Recomendado)

Este template incluye GitHub Actions para despliegue automático. Solo necesitas:

1. **Fork o usa como template** este repositorio
2. **Renombra** el repositorio a `tu-usuario.github.io`  
3. **Personaliza** el contenido con tu información
4. Ve a **Settings > Pages** en tu repositorio
5. Selecciona **GitHub Actions** como fuente
6. ¡Listo! Cada push a `main` desplegará automáticamente

#### 📚 Configuración Manual

Si prefieres configurar manualmente o necesitas opciones avanzadas, sigue la [**guía oficial de Astro**](https://docs.astro.build/en/guides/deploy/github/):

> 🔗 **Guía Oficial**: [Deploy your Astro Site to GitHub Pages](https://docs.astro.build/en/guides/deploy/github/)

La guía oficial siempre estará actualizada con las mejores prácticas y configuraciones más recientes para diferentes escenarios de despliegue.

## 📁 Estructura del Proyecto

```
joscart-website/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── Header.astro    # Navegación y header
│   │   ├── Card.astro      # Tarjetas de contenido
│   │   ├── Section.astro   # Secciones de página
│   │   └── Skills.astro    # Habilidades técnicas
│   │
│   ├── layouts/
│   │   └── Layout.astro    # Layout principal
│   │
│   └── pages/              # Páginas del sitio
│       ├── index.astro     # Página principal
│       ├── about.astro     # Sobre mí
│       └── projects.astro  # Proyectos
│
├── public/                 # Archivos estáticos
├── tailwind.config.mjs     # Configuración Tailwind
├── astro.config.mjs        # Configuración Astro
└── package.json
```

## 🎨 Personalización Avanzada

### Componentes Incluidos

#### `<Card>` - Tarjetas de contenido
```astro
<Card title="Mi Título" variant="primary">
  <p>Contenido de la tarjeta</p>
</Card>
```

#### `<Section>` - Secciones de página
```astro
<Section title="Mi Sección" id="mi-seccion">
  <!-- Contenido -->
</Section>
```

#### `<Header>` - Navegación
- Navegación flotante responsive
- Enlaces automáticos
- Diseño sticky

### Estilos Disponibles

#### Variantes de Color
- `primary` - Azul profesional
- `secondary` - Grises elegantes  
- `accent` - Verde/cian de acento

#### Utilidades Tailwind
- Gradientes predefinidos
- Espaciado consistente
- Responsive breakpoints
- Animaciones suaves

## 📝 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo

# Producción
npm run build        # Construir para producción
npm run preview      # Previsualizar build local

# Utilidades
npm run astro        # CLI de Astro
```

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si tienes ideas para mejorar este template:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/mejora-increible`)
3. Commit tus cambios (`git commit -m 'Añade mejora increíble'`)
4. Push a la rama (`git push origin feature/mejora-increible`)
5. Abre un Pull Request

### Ideas para Contribuir
- 🎨 Nuevos temas de color
- 📱 Componentes adicionales
- ⚡ Optimizaciones de rendimiento
- 🌐 Soporte para más idiomas
- 📊 Integración con Analytics

## 📄 Licencia

Este proyecto está bajo la Licencia GPL v3. Ver [LICENSE](LICENSE) para más detalles.

> **Nota sobre la Licencia GPL v3**: Esta licencia garantiza que el código permanezca libre y abierto. Si usas este código en tu proyecto, tu proyecto también debe ser liberado bajo GPL v3 o una licencia compatible. Esto asegura que las mejoras beneficien a toda la comunidad.

## 🌟 ¿Te Gustó el Template?

Si este template te fue útil:

- ⭐ Dale una estrella al repositorio
- 🍴 Haz fork para tu propio portfolio
- 📢 Compártelo con otros desarrolladores
- 💬 Déjame saber cómo lo usaste en [Issues](https://github.com/Joscart/joscart.github.io/issues)

## 📞 Contacto

**Jose Guallasamin (Joscart)**
- 🌐 Portfolio: [joscart.github.io](https://joscart.github.io)
- 💼 LinkedIn: [Tu LinkedIn]
- 📧 Email: [jguallasamin@ieee.org] [joscartinicioegc@gmail.com]
- 🐱 GitHub: [@Joscart](https://github.com/Joscart)

---

### 🚀 ¡Crea tu portfolio profesional en minutos!

**Pasos simples:**
1. Click en "Use this template" 
2. Personaliza tu información
3. Deploy automático en GitHub Pages
4. ¡Comparte tu nuevo portfolio!

> **Tip:** Este template está optimizado para mostrar tu perfil profesional de manera elegante y moderna. ¡Perfecto para desarrolladores, diseñadores y profesionales tech!

---

*Hecho con ❤️ por [Joscart](https://github.com/Joscart) - Template libre para la comunidad*
