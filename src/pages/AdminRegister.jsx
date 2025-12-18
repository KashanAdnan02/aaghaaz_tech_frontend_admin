import { useState } from 'react';
import { toast } from "react-toastify"
import api from '../utils/axios';
import { useNavigate } from 'react-router-dom';
export default function AdminRegister() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    cnic: '',
    phoneNumber: '',
    dateOfBirth: '',
    expertise: [],
    profilePicture: null,
    location: {
      country: '',
      city: ''
    },
    languages: [],
    qualification: '',
    role: 'instructor'
  });

  const [expertiseInput, setExpertiseInput] = useState('');
  const [languageInput, setLanguageInput] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size must be less than 2MB');
        e.target.value = '';
        return;
      }
      setFormData(prev => ({
        ...prev,
        profilePicture: file
      }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAddExpertise = () => {
    if (expertiseInput.trim()) {
      setFormData(prev => ({
        ...prev,
        expertise: [...prev.expertise, expertiseInput.trim()]
      }));
      setExpertiseInput('');
    }
  };

  const handleRemoveExpertise = (index) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.filter((_, i) => i !== index)
    }));
  };

  const handleAddLanguage = () => {
    if (languageInput.trim()) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, languageInput.trim()]
      }));
      setLanguageInput('');
    }
  };

  const handleRemoveLanguage = (index) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }));
  };

  const handleKeyPress = (e, callback) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      callback();
    }
  };

  const handleSubmit = async () => {

    setError('');
    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'profilePicture' && formData[key]) {
          formDataToSend.append(key, formData[key]);
        } else if (key === 'location') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (key === 'expertise' || key === 'languages') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      await api.post('/api/auth/register', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Registration successful!');
      navigate('/admin/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-black mb-2">Register New Staff</h1>
          <p className="text-gray-500 text-sm">Fill in the details to create a new account</p>
        </div>

        {error && (
          <div className="bg-gray-100 border-l-4 border-black text-gray-800 p-4 rounded mb-6">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-6 bg-white border border-gray-200 rounded-lg p-8">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-sm"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-sm"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-sm"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-sm"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                CNIC
              </label>
              <input
                type="text"
                name="cnic"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-sm"
                value={formData.cnic}
                onChange={handleChange}
                placeholder="CNIC number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-sm"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Phone number"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-sm"
              value={formData.dateOfBirth}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Expertise
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={expertiseInput}
                onChange={(e) => setExpertiseInput(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, handleAddExpertise)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-sm"
                placeholder="Add expertise"
              />
              <button
                type="button"
                onClick={handleAddExpertise}
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.expertise.map((exp, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {exp}
                  <button
                    type="button"
                    onClick={() => handleRemoveExpertise(index)}
                    className="text-gray-600 hover:text-black"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Profile Picture
            </label>
            <input
              type="file"
              name="profilePicture"
              onChange={handleFileChange}
              accept="image/*"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-sm"
            />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Profile preview"
                className="mt-3 w-20 h-20 object-cover rounded-full border-2 border-gray-200"
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Country
              </label>
              <input
                type="text"
                name="location.country"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-sm"
                value={formData.location.country}
                onChange={handleChange}
                placeholder="Country"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                City
              </label>
              <input
                type="text"
                name="location.city"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-sm"
                value={formData.location.city}
                onChange={handleChange}
                placeholder="City"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Languages
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={languageInput}
                onChange={(e) => setLanguageInput(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, handleAddLanguage)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-sm"
                placeholder="Add language"
              />
              <button
                type="button"
                onClick={handleAddLanguage}
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.languages.map((lang, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {lang}
                  <button
                    type="button"
                    onClick={() => handleRemoveLanguage(index)}
                    className="text-gray-600 hover:text-black"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Qualification
            </label>
            <select
              name="qualification"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-sm"
              value={formData.qualification}
              onChange={handleChange}
            >
              <option value="">Select qualification</option>
              <option value="PhD">PhD</option>
              <option value="Masters">Masters</option>
              <option value="Bachelors">Bachelors</option>
              <option value="Diploma">Diploma</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Role
            </label>
            <select
              name="role"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-sm"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="instructor">Instructor</option>
              <option value="maintenance_office">Maintenance Office</option>
            </select>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 text-sm font-medium mt-4"
          >
            {isLoading ? 'Registering...' : 'Register Staff'}
          </button>
        </div>
      </div>
    </div>
  );
}