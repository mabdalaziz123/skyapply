import Universities from '../components/Universities';
import CTA from '../components/CTA';

const UniversitiesPage = ({ onOpenModal }: { onOpenModal: () => void }) => {
    return (
        <div className="pt-32">
            <Universities />
            <CTA onOpenModal={onOpenModal} />
        </div>
    );
};

export default UniversitiesPage;
