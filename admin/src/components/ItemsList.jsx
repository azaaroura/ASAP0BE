import { useState, useEffect } from 'react'

export default function ItemsList({ onEdit, onRefresh }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [filteredItems, setFilteredItems] = useState([])

  useEffect(() => {
    fetchItems()
  }, [])

  useEffect(() => {
    const filtered = items.filter(item =>
      item.ItemName.toLowerCase().includes(search.toLowerCase()) ||
      item.ItemCode.toLowerCase().includes(search.toLowerCase()) ||
      (item.CategoryName && item.CategoryName.toLowerCase().includes(search.toLowerCase()))
    )
    setFilteredItems(filtered)
  }, [search, items])

  const fetchItems = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/admin/items')
      if (!response.ok) throw new Error('Failed to fetch items')
      const data = await response.json()
      setItems(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (itemId) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      const response = await fetch(`/api/admin/items/${itemId}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete item')
      setItems(items.filter(item => item.ItemID !== itemId))
    } catch (err) {
      alert('Error: ' + err.message)
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading items...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <div className="alert alert-error">Error: {error}</div>
        <button className="btn-primary" onClick={fetchItems}>Retry</button>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📦</div>
        <p>No items found</p>
        <p style={{ fontSize: '12px', marginTop: '10px' }}>Click "Add New Item" to get started</p>
      </div>
    )
  }

  return (
    <div>
      <div className="search-box">
        <input
          type="text"
          placeholder="Search by name, code, or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(item => (
              <tr key={item.ItemID}>
                <td>{item.ItemCode}</td>
                <td>{item.ItemName}</td>
                <td>{item.CategoryName || 'N/A'}</td>
                <td>{item.StockQty}</td>
                <td>{item.Active ? '✓ Active' : '✗ Inactive'}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-secondary"
                      onClick={() => onEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-danger"
                      onClick={() => handleDelete(item.ItemID)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ marginTop: '15px', color: '#666' }}>
        Showing {filteredItems.length} of {items.length} items
      </p>
    </div>
  )
}
