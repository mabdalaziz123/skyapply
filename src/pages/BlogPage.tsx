import Blog from '../components/Blog';
import CTA from '../components/CTA';

const BlogPage = ({ onOpenModal }: { onOpenModal: () => void }) => {
    return (
        <div className="pt-32">
            <Blog />
            <CTA onOpenModal={onOpenModal} />
        </div>
    );
};

export default BlogPage;
