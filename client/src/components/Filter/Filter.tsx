import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import s from "./Filter.module.scss";
import { api_getCategories, api_getFilters, api_getListingFilters, api_getListings } from "../../services/api";
import { ApiResponseType, CategoriesType, FiltersType, ListingFilterType, ListingType } from "../../types/apiTypes";
import { getMarketGame } from "../../services/sessionStorage";
import ReactSlider from "react-slider";
import Button from "../Button/Button";

function Filter(props: { setListings: Dispatch<SetStateAction<ListingType[]>>, maxPrice: number, minPrice: number }) {
    const [categories, setCategories] = useState<CategoriesType[]>([]);
    const [filters, setFilters] = useState<FiltersType[]>([]);
    const [minPrice, setMinPrice] = useState<number>(0);
    const [maxPrice, setMaxPrice] = useState<number>(1000);
    const [selectedFilters, setSelectedFilters] = useState<number[]>([]);

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === "minPrice" || name === "maxPrice") {
            const parsedValue = parseFloat(value);
            if (!isNaN(parsedValue)) {
                if (name === "minPrice") {
                    setMinPrice(parsedValue);
                } else {
                    setMaxPrice(parsedValue);
                }
            }
            else {
                return;
            }
        }
    }

    const handleChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, checked } = e.target;

        setSelectedFilters(prev => {
            if (checked) {
                return [...prev, Number(id)];
            } else {
                return prev.filter(item => item !== Number(id));
            }
        });
    }

    const handleSubmitFilter = () => {
        if (selectedFilters.length !== 0) {
            api_getListingFilters(selectedFilters.join(', '))
                .then(res => res.data)
                .then((res: ApiResponseType) => {
                    if (res.status === "OK") {
                        let lf = res.data as ListingType[];
                        lf = lf.filter((item) => {
                            return Number(item.price) >= minPrice && Number(item.price) <= maxPrice;
                        })

                        props.setListings(prev => {
                            return [...lf];
                        })
                    }
                    else {
                        props.setListings([]);
                    }
                })
        }
        else {
            const marketGame = getMarketGame() || "";
            api_getListings(marketGame)
                .then(response => response.data)
                .then((response: ApiResponseType) => {
                    if (response.status === "OK") {
                        let lf = response.data as ListingType[];

                        lf = lf.filter((item) => {
                            return Number(item.price) >= minPrice && Number(item.price) <= maxPrice;
                        })

                        props.setListings([...lf]);
                    }
                })
        }
    }


    useEffect(() => {
        const game = getMarketGame() || "";
        try {
            api_getCategories(game)
                .then(res => res.data)
                .then((res: ApiResponseType) => {
                    if (res.status === "OK") {
                        setCategories(res.data);
                    }
                });

            api_getFilters(game)
                .then(res => res.data)
                .then((res: ApiResponseType) => {
                    if (res.status === "OK") {
                        setFilters(res.data);
                    }
                });
        } catch (ex) {
            console.error("Error fetching data:", ex);
        }
    }, []);


    const handleClickFilter = (e: React.MouseEvent) => {
        const target = e.target as HTMLElement;
        const body = target.nextElementSibling;

        body?.classList.toggle(s.accordion__itemBody_show);
        target?.classList.toggle(s.active);
    };

    return (
        <div className={s.filter}>
            <div className={s.accordion}>
                <div className={s.accordion__item}>
                    <div className={s.accordion__itemHeader} onClick={handleClickFilter}>
                        Стоимость
                    </div>

                    <div className={s.accordion__itemBody}>

                        <ReactSlider
                            className="horizontal-slider"
                            thumbClassName="example-thumb"
                            trackClassName="example-track"
                            min={0}
                            max={5000}
                            value={[minPrice, maxPrice]}
                            onChange={(value, index) => {
                                const min = value[0] as number;
                                const max = value[1] as number;

                                setMinPrice(min);
                                setMaxPrice(max);
                            }}
                            pearling
                            minDistance={4}
                        />

                        <div className="price">
                            <div className="price__item">
                                <span>От:</span>
                                <input type="text" value={minPrice} name="minPrice" onChange={handleChangeInput} />
                            </div>
                            <div className="price__item">
                                <span>До:</span>
                                <input type="text" value={maxPrice} name="maxPrice" onChange={handleChangeInput} />
                            </div>
                        </div>

                    </div>
                </div>

                {categories.map((category, catIndex) => (
                    <div className={s.accordion__item} key={catIndex}>
                        <div className={s.accordion__itemHeader} onClick={handleClickFilter}>
                            {category.category}
                        </div>

                        <div className={s.accordion__itemBody}>
                            {filters.map((filter, index) => {
                                return (filter.category === category.category ? (
                                    <div className={s.checker} key={index}>
                                        <input type="checkbox" id={String(filter.id)} onChange={handleChecked} />
                                        <label htmlFor={String(filter.id)}>{filter.filter_name}</label>
                                    </div>
                                ) : null);
                            })}
                        </div>
                    </div>
                ))}

                <Button title="Применить фильтр" fz={16} fw={600} stretch={true} callBack={handleSubmitFilter} />
            </div>
        </div>
    );
}

export default Filter;
