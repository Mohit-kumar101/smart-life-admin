import { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import Input, { Select } from '../ui/Input'
import Button from '../ui/Button'

const CATEGORY_OPTIONS = [
  { value: 'URGENT',    label: '🔴 Urgent' },
  { value: 'IMPORTANT', label: '🟡 Important' },
  { value: 'NORMAL',    label: '🔵 Normal' },
  { value: 'OPTIONAL',  label: '⚫ Optional' },
]

const EMPTY_FORM = {
  title: '',
  description: '',
  category: 'NORMAL',
  dueDate: '',
}

export default function TaskFormModal({ isOpen, onClose, onSubmit, initialData = null }) {
  const [form, setForm]       = useState(EMPTY_FORM)
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setForm({
          title:       initialData.title || '',
          description: initialData.description || '',
          category:    initialData.category || 'NORMAL',
          dueDate:     initialData.dueDate
            ? new Date(initialData.dueDate).toISOString().slice(0, 16)
            : '',
        })
      } else {
        setForm(EMPTY_FORM)
      }
      setErrors({})
    }
  }, [isOpen, initialData])

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const validate = () => {
    const errs = {}
    if (!form.title.trim()) errs.title = 'Title is required'
    if (form.title.trim().length > 120) errs.title = 'Title too long (max 120 chars)'
    return errs
  }

  const handleSubmit = async () => {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      let dueDate = null
      if (form.dueDate) {
        const parsed = new Date(form.dueDate)
        if (!Number.isNaN(parsed.getTime())) {
          dueDate = parsed.toISOString()
        }
      }

      await onSubmit({
        title:       form.title.trim(),
        description: form.description.trim() || null,
        category:    form.category,
        dueDate,
      })
      onClose()
    } catch (_) {
      // toast handled in hook
    } finally {
      setLoading(false)
    }
  }

  const isEdit = !!initialData

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Task' : 'Create New Task'}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <Input
          label="Title"
          required
          value={form.title}
          onChange={set('title')}
          placeholder="What needs to be done?"
          error={errors.title}
        />

        <Input
          label="Description"
          type="textarea"
          value={form.description}
          onChange={set('description')}
          placeholder="Add details (optional)…"
          rows={3}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Select
            label="Category"
            required
            value={form.category}
            onChange={set('category')}
            options={CATEGORY_OPTIONS}
          />

          <Input
            label="Due Date"
            type="datetime-local"
            value={form.dueDate}
            onChange={set('dueDate')}
          />
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={loading}>
            {isEdit ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
