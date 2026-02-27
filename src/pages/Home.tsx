import Hero from '../components/Hero';
import Services from '../components/Services';
import Universities from '../components/Universities';
import Statistics from '../components/Statistics';
import Blog from '../components/Blog';
import CTA from '../components/CTA';

interface HomeProps {
    onOpenModal: () => void;
}

const Home = ({ onOpenModal }: HomeProps) => {
    return (
        <>
            <Hero onOpenModal={onOpenModal} />
            <Services />
            <Universities />
            <Statistics />
            <Blog />
            <CTA onOpenModal={onOpenModal} />
        </>
    );
};

export default Home;
