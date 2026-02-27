import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Calendar, User, Clock, Share2, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import CTA from '../components/CTA';
import { db } from '../lib/db';

const BlogPost = ({ onOpenModal }: { onOpenModal: () => void }) => {
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            if (!id) return;
            try {
                const data = await db.blog.getById(id);
                setPost(data);
            } catch (error) {
                console.error('Error fetching blog post:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    if (loading) {
        return (
            <div className="pt-40 pb-20 flex flex-col items-center justify-center text-brand-navy">
                <Loader2 className="animate-spin mb-4" size={48} />
                <p className="text-xl font-black">جاري تحميل المقال...</p>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="pt-40 pb-20 text-center text-brand-navy">
                <h2 className="text-3xl font-black">عذراً، لم يتم العثور على المقال</h2>
                <Link to="/blog" className="mt-8 inline-block text-brand-red font-bold underline">العودة للمدونة</Link>
            </div>
        );
    }

    return (
        <div className="pt-24 min-h-screen bg-white">
            {/* Article Header */}
            <section className="py-16 bg-slate-50 border-b">
                <div className="container mx-auto px-6 max-w-4xl text-right">
                    <Link to="/blog" className="inline-flex items-center gap-2 text-brand-red font-bold mb-8 hover:gap-3 transition-all">
                        <span>العودة للمدونة</span>
                        <ArrowRight size={20} />
                    </Link>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-black text-brand-navy mb-8 leading-tight"
                    >
                        {post.title}
                    </motion.h1>
                    <div className="flex flex-wrap justify-end gap-6 text-slate-500 font-bold">
                        <div className="flex items-center gap-2">
                            <span>{post.read_time || '5 دقائق'} قراءة</span>
                            <Clock size={18} />
                        </div>
                        <div className="flex items-center gap-2 border-r pr-6 border-slate-200">
                            <span>بواسطة {post.author || 'ApplySky'}</span>
                            <User size={18} />
                        </div>
                        <div className="flex items-center gap-2 border-r pr-6 border-slate-200">
                            <span>{post.date}</span>
                            <Calendar size={18} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Article Content */}
            <article className="py-16">
                <div className="container mx-auto px-6 max-w-4xl">
                    <motion.img
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        src={post.image}
                        className="w-full h-[400px] md:h-[500px] object-cover rounded-[40px] shadow-2xl mb-16"
                        alt={post.title}
                    />

                    <div className="text-right">
                        <div className="prose prose-lg max-w-none text-slate-600 font-medium leading-[2] whitespace-pre-line">
                            {post.content}
                        </div>

                        <div className="mt-16 p-8 bg-slate-50 rounded-[32px] border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex gap-4">
                                <button className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-brand-navy hover:bg-brand-navy hover:text-white transition-all shadow-sm">
                                    <Share2 size={20} />
                                </button>
                            </div>
                            <p className="font-black text-brand-navy text-xl">هل أعجبك المقال؟ شاركه مع أصدقائك</p>
                        </div>
                    </div>
                </div>
            </article>

            <CTA onOpenModal={onOpenModal} />
        </div>
    );
};

export default BlogPost;
