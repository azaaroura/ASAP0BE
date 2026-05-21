import { useState, useEffect } from 'react'

export default function ItemForm({ item, onClose, onSaved }) {
  const [formData, setFormData] = useState({
    ItemID: '',
    ItemCode: '',
    ItemName: '',
    AltItemName: '',
    CategoryID: '',
    StockQty: 0,
    Active: 1
  })
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (item) {
      setFormData(item)
    }
    fetchCategories()
  }, [item])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(Array.isArray(data) ? data : [])
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.ItemCode || !formData.ItemName) {
      setError('Item Code and Item Name are required')
      return
    }

    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/admin/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (!response.ok) throw new Error('Failed to save item')
      onSaved()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{item ? 'Edit Item' : 'Add New Item'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Item Code *</label>
            <input
              type="text"
              name="ItemCode"
              value={formData.ItemCode}
              onChange={handleChange}
              placeholder="e.g., ITEM001"
            />
          </div>

          <div className="form-group">
            <label>Item Name *</label>
            <input
              type="text"
              name="ItemName"
              value={formData.ItemName}
              onChange={handleChange}
              placeholder="e.g., Product A"
            />
          </div>

          <div className="form-group">
            <label>Alternative Name</label>
            <input
              type="text"
              name="AltItemName"
              value={formData.AltItemName}
              onChange={handleChange}
              placeholder="Optional alternative name"
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              name="CategoryID"
              value={formData.CategoryID}
              onChange={handleChange}
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.CategoryID} value={cat.CategoryID}>
                  {cat.CategoryName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Stock Quantity</label>
            <input
              type="number"
              name="StockQty"
              value={formData.StockQty}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="Active"
                checked={formData.Active === 1}
                onChange={handleChange}
              />
              {' '}Active
            </label>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-success"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
