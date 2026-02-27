import { supabase } from './supabase';

export const db = {
    universities: {
        async getAll() {
            const { data, error } = await supabase
                .from('universities')
                .select('*');
            if (error) throw error;
            return data.sort((a: any, b: any) =>
                new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
            );
        },
        async getById(id: string) {
            const { data, error } = await supabase
                .from('universities')
                .select('*, colleges(*, branches(*))')
                .eq('id', id)
                .single();
            if (error) throw error;
            return data;
        },
        async add(university: any) {
            const { data, error } = await supabase
                .from('universities')
                .insert(university)
                .select()
                .single();
            if (error) throw error;
            return data;
        }
    },
    faculties: {
        async getByUniversity(universityId: string) {
            const { data, error } = await supabase
                .from('colleges')
                .select('*, branches(*)')
                .eq('university_id', universityId)
                .order('created_at', { ascending: true });
            if (error) throw error;
            return data;
        },
        async add(faculty: { university_id: string; name: string }) {
            const { data, error } = await supabase
                .from('colleges')
                .insert(faculty)
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        async delete(id: string) {
            const { error } = await supabase
                .from('colleges')
                .delete()
                .eq('id', id);
            if (error) throw error;
        }
    },
    branches: {
        async getAllWithDetails() {
            const { data, error } = await supabase
                .from('branches')
                .select(`
                    *,
                    colleges (
                        name,
                        universities (
                            id,
                            name,
                            country
                        )
                    )
                `);

            if (error) throw error;
            return data;
        },
        async add(branch: { faculty_id: string; name: string; language: string; price: string; duration: string; degree: string }) {
            const { data, error } = await supabase
                .from('branches')
                .insert(branch)
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        async delete(id: string) {
            const { error } = await supabase
                .from('branches')
                .delete()
                .eq('id', id);
            if (error) throw error;
        }
    },
    blog: {
        async getAll() {
            const { data, error } = await supabase
                .from('blog_posts')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            return data;
        },
        async getById(id: string) {
            const { data, error } = await supabase
                .from('blog_posts')
                .select('*')
                .eq('id', id)
                .single();
            if (error) throw error;
            return data;
        },
        async add(post: any) {
            const { data, error } = await supabase
                .from('blog_posts')
                .insert(post)
                .select()
                .single();
            if (error) throw error;
            return data;
        }
    },
    storage: {
        async uploadImage(file: File, bucket: string = 'images') {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from(bucket)
                .getPublicUrl(filePath);

            return data.publicUrl;
        }
    }
};
