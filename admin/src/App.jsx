import { useState } from 'react'
import ItemsList from './components/ItemsList'
import ItemForm from './components/ItemForm'

export default function App() {
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleAddItem = () => {
    setEditingItem(null)
    setShowForm(true)
  }

  const handleEditItem = (item) => {
    setEditingItem(item)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingItem(null)
  }

  const handleFormSaved = () => {
    handleFormClose()
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div>
      <div className="header">
        <h1>📦 Items Management</h1>
      </div>
      <div className="container">
        <div className="btn-group">
          <button className="btn-primary" onClick={handleAddItem}>
            + Add New Item
          </button>
        </div>
        <ItemsList
          key={refreshKey}
          onEdit={handleEditItem}
          onRefresh={() => setRefreshKey(prev => prev + 1)}
        />
      </div>
      {showForm && (
        <ItemForm
          item={editingItem}
          onClose={handleFormClose}
          onSaved={handleFormSaved}
        />
      )}
    </div>
  )
}
