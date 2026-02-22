import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import LanguageToggle from '../components/LanguageToggle'
import { API_URL } from '../config'

const AdminSchemeForm = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const [formData, setFormData] = useState({
    scheme_name: { en: '', hi: '', mr: '' },
    category: '',
    tags: '',
    objective: { en: '', hi: '', mr: '' },
    eligibility: { en: '', hi: '', mr: '' },
    benefits: { en: '', hi: '', mr: '' },
    documents: { en: '', hi: '', mr: '' },
    apply_process: { en: '', hi: '', mr: '' },
    official_link: '',
    min_age: '',
    max_age: '',
    states: '',
    eligible_categories: '',
    disability_supported: '',
    student_required: '',
    education_required: ''
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (isEdit) {
      fetchScheme()
    }
  }, [id])

  const fetchScheme = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/schemes/${id}`)
      const scheme = response.data
      setFormData({
        scheme_name: scheme.scheme_name || { en: '', hi: '', mr: '' },
        category: scheme.category || '',
        tags: scheme.tags?.join(', ') || '',
        objective: scheme.objective || { en: '', hi: '', mr: '' },
        eligibility: scheme.eligibility || { en: '', hi: '', mr: '' },
        benefits: scheme.benefits || { en: '', hi: '', mr: '' },
        documents: {
          en: scheme.documents?.en?.join(', ') || '',
          hi: scheme.documents?.hi?.join(', ') || '',
          mr: scheme.documents?.mr?.join(', ') || ''
        },
        apply_process: scheme.apply_process || { en: '', hi: '', mr: '' },
        official_link: scheme.official_link || '',
        min_age: scheme.min_age || '',
        max_age: scheme.max_age || '',
        states: scheme.states?.join(', ') || '',
        eligible_categories: scheme.eligible_categories?.join(', ') || '',
        disability_supported: scheme.disability_supported?.join(', ') || '',
        student_required: scheme.student_required === null ? '' : String(scheme.student_required),
        education_required: scheme.education_required?.join(', ') || ''
      })
    } catch (error) {
      console.error('Failed to fetch scheme', error)
      navigate('/admin/schemes')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData({
        ...formData,
        [parent]: { ...formData[parent], [child]: value }
      })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const payload = {
      scheme_name: formData.scheme_name,
      category: formData.category,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      objective: formData.objective,
      eligibility: formData.eligibility,
      benefits: formData.benefits,
      documents: {
        en: formData.documents.en.split(',').map(d => d.trim()).filter(d => d),
        hi: formData.documents.hi.split(',').map(d => d.trim()).filter(d => d),
        mr: formData.documents.mr.split(',').map(d => d.trim()).filter(d => d)
      },
      apply_process: formData.apply_process,
      official_link: formData.official_link,
      min_age: formData.min_age ? parseInt(formData.min_age) : null,
      max_age: formData.max_age ? parseInt(formData.max_age) : null,
      states: formData.states.split(',').map(s => s.trim()).filter(s => s),
      eligible_categories: formData.eligible_categories.split(',').map(c => c.trim()).filter(c => c),
      disability_supported: formData.disability_supported.split(',').map(d => d.trim()).filter(d => d),
      student_required: formData.student_required === '' ? null : formData.student_required === 'true',
      education_required: formData.education_required.split(',').map(e => e.trim()).filter(e => e)
    }

    try {
      if (isEdit) {
        await axios.put(`${API_URL}/admin/schemes/${id}`, payload)
        setMessage('Scheme updated successfully!')
      } else {
        await axios.post(`${API_URL}/admin/schemes`, payload)
        setMessage('Scheme created successfully!')
      }
      setTimeout(() => navigate('/admin/schemes'), 1500)
    } catch (error) {
      setMessage('Failed to save scheme')
      console.error('Failed to save scheme', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md border-b-4 border-orange-500">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="InfoMitra Logo"
              className="w-12 h-12 rounded-full object-cover shadow-md border-2 border-orange-400"
            />
            <h1 className="text-2xl font-bold text-gray-800">InfoMitra Admin Panel</h1>
          </div>
          <div className="flex items-center gap-4">
            <LanguageToggle />
            <button
              onClick={() => navigate('/admin/schemes')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition border border-blue-700"
            >
              Back to Schemes
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-white rounded shadow-md border border-gray-300 p-8">
          <div className="border-l-4 border-orange-500 pl-4 mb-6">
            <h2 className="text-3xl font-bold text-gray-800">
              {isEdit ? 'Edit Scheme' : 'Create New Scheme'}
            </h2>
            <p className="text-gray-600 mt-1">Fill in the scheme details below</p>
          </div>

          {message && (
            <div className={`p-3 rounded mb-4 border ${message.includes('success') ? 'bg-green-50 text-green-800 border-green-300' : 'bg-red-50 text-red-800 border-red-300'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-blue-50 p-4 rounded border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Scheme Name (Multilingual)</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  name="scheme_name.en"
                  value={formData.scheme_name.en}
                  onChange={handleChange}
                  placeholder="English"
                  required
                  className="w-full px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="text"
                  name="scheme_name.hi"
                  value={formData.scheme_name.hi}
                  onChange={handleChange}
                  placeholder="Hindi"
                  className="w-full px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="text"
                  name="scheme_name.mr"
                  value={formData.scheme_name.mr}
                  onChange={handleChange}
                  placeholder="Marathi"
                  className="w-full px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="education, scholarship, SC"
                  className="w-full px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Objective (Multilingual)</h3>
              <div className="space-y-3">
                <textarea
                  name="objective.en"
                  value={formData.objective.en}
                  onChange={handleChange}
                  placeholder="English"
                  rows="2"
                  className="w-full px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <textarea
                  name="objective.hi"
                  value={formData.objective.hi}
                  onChange={handleChange}
                  placeholder="Hindi"
                  rows="2"
                  className="w-full px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <textarea
                  name="objective.mr"
                  value={formData.objective.mr}
                  onChange={handleChange}
                  placeholder="Marathi"
                  rows="2"
                  className="w-full px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Eligibility (Multilingual)</h3>
              <div className="space-y-3">
                <textarea
                  name="eligibility.en"
                  value={formData.eligibility.en}
                  onChange={handleChange}
                  placeholder="English"
                  rows="2"
                  className="w-full px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <textarea
                  name="eligibility.hi"
                  value={formData.eligibility.hi}
                  onChange={handleChange}
                  placeholder="Hindi"
                  rows="2"
                  className="w-full px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <textarea
                  name="eligibility.mr"
                  value={formData.eligibility.mr}
                  onChange={handleChange}
                  placeholder="Marathi"
                  rows="2"
                  className="w-full px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Benefits (Multilingual)</h3>
              <div className="space-y-3">
                <textarea
                  name="benefits.en"
                  value={formData.benefits.en}
                  onChange={handleChange}
                  placeholder="English"
                  rows="2"
                  className="w-full px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <textarea
                  name="benefits.hi"
                  value={formData.benefits.hi}
                  onChange={handleChange}
                  placeholder="Hindi"
                  rows="2"
                  className="w-full px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <textarea
                  name="benefits.mr"
                  value={formData.benefits.mr}
                  onChange={handleChange}
                  placeholder="Marathi"
                  rows="2"
                  className="w-full px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Documents (comma-separated)</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  name="documents.en"
                  value={formData.documents.en}
                  onChange={handleChange}
                  placeholder="English: Aadhaar, Income Certificate"
                  className="w-full px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="text"
                  name="documents.hi"
                  value={formData.documents.hi}
                  onChange={handleChange}
                  placeholder="Hindi"
                  className="w-full px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="text"
                  name="documents.mr"
                  value={formData.documents.mr}
                  onChange={handleChange}
                  placeholder="Marathi"
                  className="w-full px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Apply Process (Multilingual)</h3>
              <div className="space-y-3">
                <textarea
                  name="apply_process.en"
                  value={formData.apply_process.en}
                  onChange={handleChange}
                  placeholder="English"
                  rows="2"
                  className="w-full px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <textarea
                  name="apply_process.hi"
                  value={formData.apply_process.hi}
                  onChange={handleChange}
                  placeholder="Hindi"
                  rows="2"
                  className="w-full px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <textarea
                  name="apply_process.mr"
                  value={formData.apply_process.mr}
                  onChange={handleChange}
                  placeholder="Marathi"
                  rows="2"
                  className="w-full px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Official Link</label>
              <input
                type="url"
                name="official_link"
                value={formData.official_link}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Age</label>
                <input
                  type="number"
                  name="min_age"
                  value={formData.min_age}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Age</label>
                <input
                  type="number"
                  name="max_age"
                  value={formData.max_age}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">States (comma-separated)</label>
              <input
                type="text"
                name="states"
                value={formData.states}
                onChange={handleChange}
                placeholder="Maharashtra, Delhi, Karnataka"
                className="w-full px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Eligible Categories (comma-separated)</label>
              <input
                type="text"
                name="eligible_categories"
                value={formData.eligible_categories}
                onChange={handleChange}
                placeholder="SC, ST, OBC"
                className="w-full px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Disability Supported (comma-separated)</label>
              <input
                type="text"
                name="disability_supported"
                value={formData.disability_supported}
                onChange={handleChange}
                placeholder="Physical, Visual, Hearing"
                className="w-full px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Student Required</label>
              <select
                name="student_required"
                value={formData.student_required}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Not Specified</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Education Required (comma-separated)</label>
              <input
                type="text"
                name="education_required"
                value={formData.education_required}
                onChange={handleChange}
                placeholder="10th, 12th, Graduate"
                className="w-full px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition font-semibold disabled:bg-gray-400 border border-green-700"
            >
              {loading ? 'Saving...' : isEdit ? 'Update Scheme' : 'Create Scheme'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminSchemeForm
