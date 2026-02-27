import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeading from './SectionHeading';
import { db } from '../lib/db';

const Blog = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await db.blog.getAll();
                setPosts(data);
            } catch (error) {
                console.error('Error fetching blog posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return (
            <div className="py-24 flex flex-col items-center justify-center text-brand-navy">
                <Loader2 className="animate-spin mb-4" size={40} />
                <p className="font-bold">جاري تحميل المقالات...</p>
            </div>
        );
    }

    return (
        <section id="blog" className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <SectionHeading subtitle="اطلع على أحدث المقالات والنصائح للدراسة في الخارج">
                    مقالات تهمك
                </SectionHeading>

                {posts.length === 0 ? (
                    <div className="text-center py-10 text-slate-500 font-bold">
                        لا توجد مقالات حالياً.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-right">
                        {posts.map((post, idx) => (
                            <motion.div
                                key={post.id}
                                className="group"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <Link to={`/blog/${post.id}`} className="block">
                                    <div className="overflow-hidden rounded-3xl mb-6 aspect-video relative">
                                        <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-brand-navy shadow-sm">
                                            {post.date}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-brand-navy mb-4 group-hover:text-brand-red transition-colors leading-tight">
                                        {post.title}
                                    </h3>
                                    <div className="text-sm font-black text-brand-red flex items-center gap-2 mr-auto ml-0 transition-transform group-hover:-translate-x-2 w-fit">
                                        اقرأ المزيد <ChevronRight size={16} className="rotate-180" />
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Blog;
