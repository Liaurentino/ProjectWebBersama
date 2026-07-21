import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import addPicture from '../assets/ProfilePage/AddPicture.png';
import Study from '../assets/ProfilePage/Study.png';
import More from '../assets/ProfilePage/More.png';
import defaultProfilePic from '../assets/ProfilePage/profile_default.jpg';



const EditProfile = () => {
  const navigate = useNavigate();
  const { user, loading, error, updateProfile, uploadPhoto } = useUser();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    jurusan: '',
    semester: '',
    interests: '',
    bio: '',
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoError, setPhotoError] = useState('');

  const icons = {
    camera:   addPicture,
    dropdown: More,
    photo:    Study,
  };

  useEffect(() => {
    if (!user) return;

    const timer = window.setTimeout(() => {
      setFormData({
        name:      user.name      || '',
        email:     user.email     || '',
        jurusan:   user.jurusan   || '',
        semester:  user.semester  || '',
        interests: Array.isArray(user.interests) ? user.interests[0] || '' : user.interests || '',
        bio:       user.bio       || '',
      });
    }, 0);

    return () => window.clearTimeout(timer);
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      return setPhotoError('Ukuran foto maksimal 2MB.');
    }

    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowed.includes(file.type)) {
      return setPhotoError('Format foto harus JPG, PNG, GIF, atau WEBP.');
    }

    setPhotoError('');
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (photoFile) {
        setPhotoUploading(true);
        await uploadPhoto(photoFile);
        setPhotoUploading(false);
      }

      await updateProfile({
        ...formData,
        semester:  formData.semester ? Number(formData.semester) : undefined,
        interests: formData.interests ? [formData.interests] : [],
      });

      navigate('/profile');
    } catch (err) {
      setPhotoUploading(false);
      alert('Failed to save changes: ' + err.message);
    }
  };

  if (loading && !user) return <div className="p-8 text-center text-[#434655] dark:text-gray-400">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  const currentPhoto = photoPreview || user?.photoUrl || defaultProfilePic;
  const isSaving = loading || photoUploading;

  return (
    <div className="max-w-[896px] mx-auto p-10 space-y-8 transition-colors duration-300">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-[#191C1E] dark:text-white tracking-tight">Edit Profile</h1>
        <p className="text-[#434655] dark:text-gray-400">Manage your profile information and account preferences.</p>
      </div>

      <div className="bg-white dark:bg-[#1A1C1E] border border-[#C3C6D7] dark:border-gray-800 rounded-xl shadow-sm overflow-hidden transition-colors">
        <form onSubmit={handleSubmit}>
          <div className="p-8 space-y-10">

            {/* Photo Upload Section */}
            <div className="flex items-center gap-8 pb-8 border-b border-[#C3C6D7]/30 dark:border-gray-800">
              <div className="relative">
                <div className="w-[117px] h-[117px] rounded-3xl overflow-hidden shadow-lg border-4 border-[#F3F4F6] dark:border-gray-800">
                  <img src={currentPhoto} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="absolute -bottom-2 -right-2 bg-[#004AC6] p-2 rounded-xl text-white shadow-md hover:bg-[#003da3] transition flex items-center justify-center"
                >
                  <img src={icons.camera} alt="Change Photo" className="w-3 h-3" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-[#191C1E] dark:text-white">Profile picture</h3>
                  <p className="text-sm text-[#434655] dark:text-gray-400">JPG, GIF or PNG. Max 2MB.</p>
                  {photoFile && (
                    <p className="text-xs text-[#2563eb] mt-1 font-medium">{photoFile.name} — siap diupload</p>
                  )}
                  {photoError && (
                    <p className="text-xs text-red-500 mt-1">{photoError}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="border-2 border-[#004AC6] text-[#004AC6] px-6 py-2 rounded-lg text-sm font-bold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
                >
                  Change Photo
                </button>
              </div>
            </div>

            {/* Input Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-[#434655] dark:text-gray-400 px-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-white dark:bg-[#2A2D31] border border-[#737686] dark:border-gray-700 rounded-lg px-4 py-3 text-[#191C1E] dark:text-white focus:ring-2 focus:ring-[#2563EB] outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-[#434655] dark:text-gray-400 px-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white dark:bg-[#2A2D31] border border-[#737686] dark:border-gray-700 rounded-lg px-4 py-3 text-[#191C1E] dark:text-white focus:ring-2 focus:ring-[#2563EB] outline-none transition-colors"
                />
              </div>

              <div className="space-y-2 relative">
                <label className="block text-sm font-bold text-[#434655] dark:text-gray-400 px-1">Study program</label>
                <div className="relative">
                  <input
                    type="text"
                    name="jurusan"
                    value={formData.jurusan}
                    onChange={handleChange}
                    className="w-full bg-white dark:bg-[#2A2D31] border border-[#737686] dark:border-gray-700 rounded-lg px-4 py-3 text-[#191C1E] dark:text-white focus:ring-2 focus:ring-[#2563EB] outline-none transition-colors"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <img src={icons.photo} alt="" className="w-5 h-4 dark:invert opacity-70" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-[#434655] dark:text-gray-400 px-1">Semester</label>
                <div className="relative">
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    className="w-full bg-white dark:bg-[#2A2D31] border border-[#737686] dark:border-gray-700 rounded-lg px-4 py-3 text-[#191C1E] dark:text-white focus:ring-2 focus:ring-[#2563EB] appearance-none outline-none transition-colors"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                      <option key={s} value={s}>{s} (Year {Math.ceil(s / 2)})</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <img src={icons.dropdown} alt="" className="w-5 h-4 dark:invert opacity-70" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-[#434655] dark:text-gray-400 px-1">Primary Interest</label>
                <div className="relative">
                  <select
                    name="interests"
                    value={formData.interests}
                    onChange={handleChange}
                    className="w-full bg-white dark:bg-[#2A2D31] border border-[#737686] dark:border-gray-700 rounded-lg px-4 py-3 text-[#191C1E] dark:text-white focus:ring-2 focus:ring-[#2563EB] appearance-none outline-none transition-colors"
                  >
                    <option value="Software Development">Software Development</option>
                    <option value="Data Science">Data Science</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Project Management">Project Management</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <img src={icons.dropdown} alt="" className="w-5 h-4 dark:invert opacity-70" />
                  </div>
                </div>
              </div>
            </div>

            {/* Short Bio */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-[#434655] dark:text-gray-400 px-1">Short Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Write a little about yourself..."
                className="w-full bg-white dark:bg-[#2A2D31] border border-[#737686] dark:border-gray-700 rounded-lg px-4 py-3 text-[#191C1E] dark:text-white focus:ring-2 focus:ring-[#2563EB] outline-none min-h-[100px] resize-none transition-colors"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-[#F3F4F6] dark:bg-[#2A2D31] px-8 py-6 flex justify-end gap-3 transition-colors">
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="px-8 py-3 text-[#434655] dark:text-gray-300 font-bold hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
            >
              Cancelled
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className={`bg-[#2563EB] text-white px-10 py-3 rounded-lg font-bold shadow-md hover:bg-[#1d4ed8] transition ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {photoUploading ? 'Uploading photo...' : loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;