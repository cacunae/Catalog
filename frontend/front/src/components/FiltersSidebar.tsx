import type { FC } from 'react'

type FiltersSidebarProps = {
  isOpen: boolean
  searchTerm: string
  brandFilter: string
  categoryFilter: string
  alphabeticalOrder: 'none' | 'asc' | 'desc'
  priceOrder: 'none' | 'asc' | 'desc'
  onClose: () => void
  onSearchChange: (value: string) => void
  onBrandChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onAlphabeticalOrderChange: (value: 'none' | 'asc' | 'desc') => void
  onPriceOrderChange: (value: 'none' | 'asc' | 'desc') => void
  onReset: () => void
}

const FiltersSidebar: FC<FiltersSidebarProps> = ({
  isOpen,
  searchTerm,
  brandFilter,
  categoryFilter,
  alphabeticalOrder,
  priceOrder,
  onClose,
  onSearchChange,
  onBrandChange,
  onCategoryChange,
  onAlphabeticalOrderChange,
  onPriceOrderChange,
  onReset,
}) => {
  return (
    <aside className={`filters-sidebar ${isOpen ? 'open' : ''}`} aria-label="Filtros eficientes">
      <div className="filters-header">
        <h2>Filtros</h2>
        <button type="button" className="filters-close" onClick={onClose} aria-label="Cerrar filtros">
          x
        </button>
      </div>

      <label className="filter-label" htmlFor="filter-search">
        Buscar por nombre
      </label>
      <input
        id="filter-search"
        className="filter-input"
        type="text"
        value={searchTerm}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Escribe un nombre"
      />

      <label className="filter-label" htmlFor="filter-brand">
        Filtrar por marca
      </label>
      <input
        id="filter-brand"
        className="filter-input"
        type="text"
        value={brandFilter}
        onChange={(event) => onBrandChange(event.target.value)}
        placeholder="Ej: SportCo"
      />

      <label className="filter-label" htmlFor="filter-category">
        Filtrar por categoria
      </label>
      <input
        id="filter-category"
        className="filter-input"
        type="text"
        value={categoryFilter}
        onChange={(event) => onCategoryChange(event.target.value)}
        placeholder="Ej: Ropa"
      />

      <label className="filter-label" htmlFor="filter-alpha">
        Orden alfabetico
      </label>
      <div className="filter-options" role="group" aria-label="Orden alfabetico">
        <button
          type="button"
          className={`filter-option ${alphabeticalOrder === 'none' ? 'active' : ''}`}
          onClick={() => onAlphabeticalOrderChange('none')}
        >
          Sin orden
        </button>
        <button
          type="button"
          className={`filter-option ${alphabeticalOrder === 'asc' ? 'active' : ''}`}
          onClick={() => onAlphabeticalOrderChange('asc')}
        >
          A-Z
        </button>
        <button
          type="button"
          className={`filter-option ${alphabeticalOrder === 'desc' ? 'active' : ''}`}
          onClick={() => onAlphabeticalOrderChange('desc')}
        >
          Z-A
        </button>
      </div>

      <label className="filter-label" htmlFor="filter-price">
        Orden por precio
      </label>
      <div className="filter-options" role="group" aria-label="Orden por precio">
        <button
          type="button"
          className={`filter-option ${priceOrder === 'none' ? 'active' : ''}`}
          onClick={() => onPriceOrderChange('none')}
        >
          Sin orden
        </button>
        <button
          type="button"
          className={`filter-option ${priceOrder === 'asc' ? 'active' : ''}`}
          onClick={() => onPriceOrderChange('asc')}
        >
          Menor a mayor
        </button>
        <button
          type="button"
          className={`filter-option ${priceOrder === 'desc' ? 'active' : ''}`}
          onClick={() => onPriceOrderChange('desc')}
        >
          Mayor a menor
        </button>
      </div>

      <button type="button" className="filters-reset" onClick={onReset}>
        Limpiar filtros
      </button>
    </aside>
  )
}

export default FiltersSidebar
