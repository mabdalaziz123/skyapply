const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const db = {
    universities: {
        async getAll() {
            const response = await fetch(`${API_URL}/universities`);
            if (!response.ok) throw new Error('Failed to fetch universities');
            return response.json();
        },
        async getById(id: string) {
            const response = await fetch(`${API_URL}/universities/${id}`);
            if (!response.ok) throw new Error('Failed to fetch university');
            return response.json();
        },
        async add(university: any) {
            const response = await fetch(`${API_URL}/universities`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
                },
                body: JSON.stringify(university)
            });
            if (!response.ok) throw new Error('Failed to add university');
            return response.json();
        },
        async update(id: string, university: any) {
            const response = await fetch(`${API_URL}/universities/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
                },
                body: JSON.stringify(university)
            });
            if (!response.ok) throw new Error('Failed to update university');
            return response.json();
        },
        async delete(id: string) {
            const response = await fetch(`${API_URL}/universities/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to delete university');
        }
    },
    faculties: {
        async getByUniversity(universityId: string) {
            const response = await fetch(`${API_URL}/faculties/${universityId}`);
            if (!response.ok) throw new Error('Failed to fetch faculties');
            return response.json();
        },
        async add(faculty: { university_id: string; name: string }) {
            const response = await fetch(`${API_URL}/faculties`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
                },
                body: JSON.stringify(faculty)
            });
            if (!response.ok) throw new Error('Failed to add faculty');
            return response.json();
        },
        async delete(id: string) {
            const response = await fetch(`${API_URL}/faculties/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to delete faculty');
        }
    },
    branches: {
        async getAllWithDetails() {
            const response = await fetch(`${API_URL}/branches`);
            if (!response.ok) throw new Error('Failed to fetch branches');
            return response.json();
        },
        async add(branch: { faculty_id: string; name: string; language: string; duration: string; degree: string;[key: string]: any }) {
            const response = await fetch(`${API_URL}/branches`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
                },
                body: JSON.stringify(branch)
            });
            if (!response.ok) throw new Error('Failed to add branch');
            return response.json();
        },
        async delete(id: string) {
            const response = await fetch(`${API_URL}/branches/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to delete branch');
        }
    },
    blog: {
        async getAll() {
            const response = await fetch(`${API_URL}/blog`);
            if (!response.ok) throw new Error('Failed to fetch blog posts');
            return response.json();
        },
        async getById(id: string) {
            const response = await fetch(`${API_URL}/blog/${id}`);
            if (!response.ok) throw new Error('Failed to fetch blog post');
            return response.json();
        },
        async add(post: any) {
            const response = await fetch(`${API_URL}/blog`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
                },
                body: JSON.stringify(post)
            });
            if (!response.ok) throw new Error('Failed to add blog post');
            return response.json();
        },
        async update(id: string, post: any) {
            const response = await fetch(`${API_URL}/blog/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
                },
                body: JSON.stringify(post)
            });
            if (!response.ok) throw new Error('Failed to update blog post');
            return response.json();
        },
        async delete(id: string) {
            const response = await fetch(`${API_URL}/blog/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to delete blog post');
        }
    },
    storage: {
        async uploadImage(file: File, _bucket: string = 'images') {
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch(`${API_URL}/upload`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to upload image');
            }

            const data = await response.json();
            return data.publicUrl;
        }
    }
};
