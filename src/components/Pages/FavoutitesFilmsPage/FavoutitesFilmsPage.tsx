import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import "./FavoutitesFilmsPage.css"
import ListFilms from '../../../components/ListFilms/ListFilms';
import Filter from '../../Filter/Filter';
import { useEffect } from 'react';

const FavoutitesFilmsPage = () => {
    const favouritesFilms = useSelector((state: RootState) => state.favouritesFilms.value);

    useEffect(() => {
        
    }, [])

    return (
        <div className="mt-[70px] w-full flex justify-center">
            {favouritesFilms.length > 0 ? (
                <div className="w-[80%] flex flex-col items-center ml-40">
                    <Filter whichPage="Страница избранных"/>
                    <ListFilms films={favouritesFilms} />
                </div>
            ) : (
                <h1 className='flex justify-center items-center h-[90vh]'>Пора бы добавить что-то в избранное...</h1>
            )}
        </div>
    );
};

export default FavoutitesFilmsPage;
