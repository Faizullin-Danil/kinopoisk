import { RootState } from "@/store/store";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { addFavouriteFilm, deleteFavouriteFilm } from '../../store/FavouriteFilmsSlice';
import { FaRegStar, FaStar } from "react-icons/fa";
import { deleteFavouriteFilm as deleteFavouriteFilmFromAPI, addFavouriteFilm as addFavouriteFilmFormAPI } from "../../services/apiService"
import TabsPanel from "../../components/TabsPanel/TabsPanel";
import { Link } from 'react-router-dom';
import TrailerComp from "../../components/TrailerComp/TrailerComp"
import { getImages } from "../../services/apiService"; 


const FilmPage = () => {
    const location = useLocation();
    const { film } = location.state || {}; 
    const [images, setImages] = useState([])
    const favouritesFilms = useSelector((state: RootState) => state.favouritesFilms.value)
    const [isFavourite, setIsFavourite] = useState(favouritesFilms.some(favFilm => favFilm.kinopoisk_id === film.kinopoisk_id))
    const dispatch = useDispatch()

    useEffect(() => {
        const loadImages = async () => {
            try {
                const imagesFromDB = await getImages(film.kinopoisk_id)
                setImages(imagesFromDB)
            } catch (error) {
                console.error("Ошибка загрузки изображения:", error);
            }
        }
        loadImages()

        setIsFavourite(favouritesFilms.some(favFilm => favFilm.kinopoisk_id === film.kinopoisk_id))
    }, [favouritesFilms, film.id])

    const handleToggleFavourite = () => {
        if (isFavourite) {
            dispatch(deleteFavouriteFilm(film.kinopoisk_id))
            deleteFavouriteFilmFromAPI(film.kinopoisk_id)
            setIsFavourite(false)
        } else {
            dispatch(addFavouriteFilm(film))
            addFavouriteFilmFormAPI(film.kinopoisk_id)
            setIsFavourite(true)
        }
    }

    console.log(film)
    console.log("images: ", images)


    return (
        <div className="mt-[50px] flex flex-col items-center">
            <div className="w-[80%] flex gap-10">
                <div className="w-[25%] flex flex-col gap-5">
                    <img src={film.poster_url} className="w-80 h-120 object-cover" />
                    {film.videos.length > 0 ? (
                        <div>
                            <TrailerComp 
                                previewUrl={images.length > 0 ? images[0].url : "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/3022bd7b-1c96-41bc-abd3-427989ffb56a/dgqtbo2-11e038d5-928c-4bac-a03e-7ef4f5570ed6.gif/v1/fill/w_1095,h_730,q_85,strp/little_animation_of_rimuru_by_cartoonnikola_dgqtbo2-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTAwMCIsInBhdGgiOiJcL2ZcLzMwMjJiZDdiLTFjOTYtNDFiYy1hYmQzLTQyNzk4OWZmYjU2YVwvZGdxdGJvMi0xMWUwMzhkNS05MjhjLTRiYWMtYTAzZS03ZWY0ZjU1NzBlZDYuZ2lmIiwid2lkdGgiOiI8PTE1MDAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.Zw0wX0joQIZq_ljmBKCr_IjS29gEloKlhReifrYaf1w" }
                                videoUrl={film.videos[0].url}
                                site={film.videos[0].site}
                                width="300"
                                height="200"
                            />
                            <h1 className="text-l">Трейлер</h1>
                        </div>
                    ) : (
                        <div></div>               
                    )}

                </div>


                <div className="w-[50%] flex flex-col space-y-2">
                    <h1 className="flex items-center gap-4 text-2xl font-bold">
                        {film.name_ru || film.name_original} ({film.year})
                        {isFavourite ? <FaStar className="text-4xl p-2" /> : <FaRegStar className="text-4xl p-2" />}
                    </h1>
                    <Button className="flex w-[250px] cursor-pointer !bg-gray-200 rounded-4xl !text-black text-3xl transition duration-300 hover:!bg-gray-300" onClick={handleToggleFavourite}>
                        {isFavourite 
                            ? <h1 className="flex items-center gap-2">убрать из избранного</h1> 
                            : <h1 className="flex items-center gap-2">Добавить в избранное</h1>}
                    </Button>

                    <h1 className="font-bold text-lg">О фильме</h1>
                    <div className="grid grid-cols-2 text-xs gap-2">
                        <h1 className="text-gray-400">Год производства</h1>
                        <h1>{film.year}</h1>

                        <h1 className="text-gray-400">Страна</h1>
                        <h1>{film.countries.map(c => c.country).join(", ")}</h1>

                        <h1 className="text-gray-400">Жанр</h1>
                        <h1>{film.genres.map(g => g.genre).join(", ")}</h1>

                        <h1 className="text-gray-400">Режиссер</h1>
                        <h1>{film.persons.filter(p => p.profession_text === "Режиссеры").map(p => p.name_ru || p.name_en).join(", ") || "Не указано"}</h1>

                        <h1 className="text-gray-400">Художник</h1>
                        <h1>{film.persons.filter(p => p.profession_text === "Художники").map(p => p.name_ru || p.name_en).join(", ") || "Не указано"}</h1>

                        <h1 className="text-gray-400">Оператор</h1>
                        <h1>{film.persons.filter(p => p.profession_text === "Операторы").map(p => p.name_ru || p.name_en).join(", ") || "Не указано"}</h1>

                        <h1 className="text-gray-400">Режиссер дубляжа</h1>
                        <h1>{film.persons.filter(p => p.profession_text === "Режиссеры дубляжа").map(p => p.name_ru || p.name_en).join(", ") || "Не указано"}</h1>

                        <h1 className="text-gray-400">Продюсер</h1>
                        <h1>{film.persons.filter(p => p.profession_text === "Продюсеры").map(p => p.name_ru || p.name_en).join(", ") || "Не указано"}</h1>

                        <h1 className="text-gray-400">Монтажер</h1>
                        <h1>{film.persons.filter(p => p.profession_text === "Монтажеры").map(p => p.name_ru || p.name_en).join(", ") || "Не указано"}</h1>

                        <h1 className="text-gray-400">Композитор</h1>
                        <h1>{film.persons.filter(p => p.profession_text === "Композиторы").map(p => p.name_ru || p.name_en).join(", ") || "Не указано"}</h1>

                        <h1 className="text-gray-400">Сценарист</h1>
                        <h1>{film.persons.filter(p => p.profession_text === "Сценаристы").map(p => p.name_ru || p.name_en).join(", ") || "Не указано"}</h1>

                        <h1 className="text-gray-400">Переводчик</h1>
                        <h1>{film.persons.filter(p => p.profession_text === "Переводчики").map(p => p.name_ru || p.name_en).join(", ") || "Не указано"}</h1>
                    </div>
                </div>

                <div className="w-[25%] text-center">
                    <h1 className="text-xl font-semibold">{film.rating_kinopoisk}</h1>
                    <h1 className="mt-10 font-bold">В главных ролях</h1>
                    <div className="mt-2 text-start space-y-2">
                        {film.persons
                            .filter(p => p.profession_text === "Актеры")
                            .slice(0, 9)
                            .map(p => (
                                <h1 key={p.staff_id} className="text-sm">{p.name_ru || p.name_en}</h1>
                            ))}
                    </div>
                    <Link to={`/actorsByfilm/${film.kinopoisk_id}`} state={{film}}>
                        <Button className="!text-[12px] !text-blue-600 hover:underline">
                            {film.persons.filter(p => p.profession_text === "Актеры").length} актер(-ов)
                        </Button>
                    </Link>
                    
                </div>
            </div>

            <div className="w-[80%] mt-10">
                <TabsPanel images={images} description={film.description} videos={film.videos} />
            </div>
            
        </div>

    );
};

export default FilmPage;
