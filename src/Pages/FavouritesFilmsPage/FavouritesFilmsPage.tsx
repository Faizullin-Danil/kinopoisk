import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import "./FavouritesFilmsPage.css"
import ListFilms from '../../components/ListFilms/ListFilms';
import Filter from '../../components/Filter/Filter';
import { useEffect } from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { setFavouriteClearFilter } from "../../store/FavouriteFilmsSlice";


const FavoutitesFilmsPage = () => {
    const favouritesFilms = useSelector((state: RootState) => state.favouritesFilms.value);
    const openAlert = useSelector((state: RootState) => state.alert.value);
    const dispatch = useDispatch()

    useEffect(() => {
        return () => {
            dispatch(setFavouriteClearFilter())
        }
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
            {openAlert && (
                <div className='fixed bottom-5'>
                    <Stack sx={{ width: '100%' }} spacing={2}>
                      <Alert variant="filled" severity="error">
                        Такого фильтра нет в ваших избранных
                      </Alert>
                    </Stack>
                </div>
            )}
        </div>
    );
};

export default FavoutitesFilmsPage;
