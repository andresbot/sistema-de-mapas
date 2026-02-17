# 🧱 Component-Driven Development (CDD)

## 📖 ¿Qué es CDD?

**Component-Driven Development** es una metodología de desarrollo que consiste en:

1. **Construir componentes de manera aislada** antes de integrarlos
2. **Reutilizar componentes** en múltiples contextos
3. **Separar UI de lógica de negocio** (componentes presentacionales vs contenedores)
4. **Estructura jerárquica** de componentes (de simple a complejo)

---

## ⚛️ Atomic Design - Nuestra Estructura

Usaremos **Atomic Design** de Brad Frost, que organiza componentes en 5 niveles:

```
Átomos → Moléculas → Organismos → Templates → Páginas
  🔹       🔸          🔶          📐          📄
```

### **1. 🔹 ÁTOMOS (Atoms)**

**Los bloques de construcción más básicos.** No se pueden dividir más.

```
components/atoms/
├── Button.jsx        # Un botón simple
├── Input.jsx         # Un campo de texto
├── Label.jsx         # Una etiqueta
├── Avatar.jsx        # Una imagen circular
├── Badge.jsx         # Una etiqueta pequeña
├── Icon.jsx          # Un ícono
├── Rating.jsx        # Estrellas de calificación
└── Spinner.jsx       # Indicador de carga
```

**Ejemplo - Button.jsx:**
```jsx
// Átomo: Solo renderiza un botón, no tiene lógica
export default function Button({ children, variant = 'primary', onClick }) {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
```

**Características:**
- ✅ Muy reutilizables
- ✅ Sin lógica de negocio
- ✅ Solo reciben props
- ✅ Puros y predecibles

---

### **2. 🔸 MOLÉCULAS (Molecules)**

**Combinación de átomos** que forman componentes simples pero funcionales.

```
components/molecules/
├── SearchBar.jsx      # Input + Button
├── FormField.jsx      # Label + Input + Error
├── CategoryTag.jsx    # Badge + Icon
├── UserInfo.jsx       # Avatar + Nombre + Fecha
└── StarRating.jsx     # Rating + Contador
```

**Ejemplo - SearchBar.jsx:**
```jsx
// Molécula: Combina Input + Button
import Input from '../atoms/Input'
import Button from '../atoms/Button'

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('')

  return (
    <div className="flex gap-2">
      <Input 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar lugares..."
      />
      <Button onClick={() => onSearch(query)}>
        Buscar
      </Button>
    </div>
  )
}
```

**Características:**
- ✅ Combinan 2-4 átomos
- ✅ Tienen funcionalidad específica
- ✅ Siguen siendo reutilizables
- ✅ Pueden tener estado local simple

---

### **3. 🔶 ORGANISMOS (Organisms)**

**Secciones complejas** que combinan moléculas y átomos en grupos significativos.

```
components/organisms/
├── Navbar.jsx         # Barra de navegación completa
├── Footer.jsx         # Pie de página
├── PlaceCard.jsx      # Tarjeta de lugar
├── PlaceList.jsx      # Grid de lugares
├── ReviewCard.jsx     # Tarjeta de reseña
├── ReviewForm.jsx     # Formulario de reseña
├── MapComponent.jsx   # Mapa interactivo
└── CategoryFilter.jsx # Panel de filtros
```

**Ejemplo - PlaceCard.jsx:**
```jsx
// Organismo: Combina varios componentes para formar una tarjeta
import Image from '../atoms/Image'
import Badge from '../atoms/Badge'
import StarRating from '../molecules/StarRating'
import CategoryTag from '../molecules/CategoryTag'

export default function PlaceCard({ place }) {
  return (
    <div className="card">
      <Image src={place.imagen} alt={place.nombre} />
      
      <div className="card-content">
        <CategoryTag category={place.categoria} />
        <h3>{place.nombre}</h3>
        <p>{place.descripcion}</p>
        <StarRating rating={place.rating} count={place.totalReseñas} />
      </div>
    </div>
  )
}
```

**Características:**
- ✅ Componentes complejos y completos
- ✅ Pueden conectarse a servicios/hooks
- ✅ Representan secciones distintas de la UI
- ✅ Menos reutilizables que moléculas

---

### **4. 📐 TEMPLATES (Templates)**

**Layouts de páginas** sin contenido real. Definen la estructura.

```
components/templates/
├── MainLayout.jsx      # Navbar + Content + Footer
├── AuthLayout.jsx      # Layout para login/register
├── MapLayout.jsx       # Layout con mapa + sidebar
└── DashboardLayout.jsx # Layout para admin
```

**Ejemplo - MainLayout.jsx:**
```jsx
// Template: Define estructura general
import Navbar from '../organisms/Navbar'
import Footer from '../organisms/Footer'

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {children}  {/* Aquí va el contenido de cada página */}
      </main>
      
      <Footer />
    </div>
  )
}
```

**Características:**
- ✅ Definen estructura de páginas
- ✅ No tienen contenido específico
- ✅ Reciben children o slots
- ✅ Reutilizables para múltiples páginas

---

### **5. 📄 PÁGINAS (Pages)**

**Instancias de templates** con contenido real y datos.

```
pages/
├── Home.jsx           # Usa MainLayout + contenido específico
├── Explore.jsx        # Usa MapLayout + lugares reales
├── Login.jsx          # Usa AuthLayout + LoginForm
└── Profile.jsx        # Usa MainLayout + datos del usuario
```

**Ejemplo - Explore.jsx:**
```jsx
// Página: Combina todo con datos reales
import MapLayout from '../components/templates/MapLayout'
import MapComponent from '../components/organisms/MapComponent'
import PlaceList from '../components/organisms/PlaceList'
import usePlaces from '../hooks/usePlaces'

export default function Explore() {
  const { places, loading } = usePlaces()  // Obtiene datos reales

  return (
    <MapLayout>
      <MapComponent places={places} />
      <PlaceList places={places} loading={loading} />
    </MapLayout>
  )
}
```

**Características:**
- ✅ Conectan con datos reales
- ✅ Usan hooks y servicios
- ✅ Corresponden a rutas del router
- ✅ Componen la aplicación final

---

## 🎯 Beneficios de CDD con Atomic Design

### **Para Aprendizaje:**
- ✅ Entiendes la **jerarquía de componentes**
- ✅ Aprendes a **pensar en reutilización**
- ✅ Separas **UI de lógica** claramente
- ✅ Código más **organizado y mantenible**

### **Para el Proyecto:**
- ✅ **Reutilización máxima** de código
- ✅ **Fácil de testear** (componentes aislados)
- ✅ **Escalable** (agregar features sin romper nada)
- ✅ **Consistencia** visual en toda la app
- ✅ **Trabajo en equipo** más fácil (cada dev un componente)

---

## 🔄 Flujo de Trabajo CDD

1. **Diseñar la UI** (puedes usar Figma, papel, o directo en código)
2. **Identificar átomos** (botones, inputs, etc.)
3. **Crear átomos** de manera aislada
4. **Combinar en moléculas** (SearchBar, FormField, etc.)
5. **Construir organismos** (PlaceCard, Navbar, etc.)
6. **Definir templates** (layouts generales)
7. **Ensamblar páginas** con datos reales
8. **Integrar en el router**

---

## 📏 Reglas de Oro

### **✅ SÍ hacer:**
- Componentes pequeños y enfocados
- Props claras y bien documentadas
- Componentes presentacionales (sin lógica compleja)
- Reutilizar antes de crear uno nuevo
- Usar PropTypes o TypeScript para validar props

### **❌ NO hacer:**
- Átomos que llaman a APIs
- Moléculas con mucha lógica de negocio
- Componentes que hacen demasiadas cosas
- Duplicar código entre componentes
- Mezclar estilos inline con Tailwind

---

## 🛠️ Herramientas Complementarias (Opcional)

### **Storybook** 📚
Para visualizar y desarrollar componentes aislados:
```bash
npm install --save-dev @storybook/react
```

Beneficios:
- Ver todos tus componentes en un catálogo
- Probar diferentes states/props
- Documentación visual automática
- Desarrollo aislado sin correr toda la app

*(Lo podemos agregar más adelante cuando tengas más experiencia)*

---

## 📚 Recursos para Aprender Más

- [Atomic Design por Brad Frost](https://bradfrost.com/blog/post/atomic-web-design/)
- [Component-Driven Development](https://www.componentdriven.org/)
- [React Component Patterns](https://www.patterns.dev/posts/react-component-patterns)

---

## 🎯 Siguiente Paso

Ahora que entiendes la estructura, vamos a:
1. ✅ Crear las carpetas siguiendo Atomic Design
2. ✅ Crear nuestros primeros átomos (Button, Input, etc.)
3. ✅ Combinarlos en moléculas
4. ✅ Construir el mapa y la UI completa

**¡Empecemos a construir!** 🚀
