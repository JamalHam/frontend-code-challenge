import React, { useState, useEffect } from 'react';

const URL_PATH = "https://gist.githubusercontent.com/bar0191/fae6084225b608f25e98b733864a102b/raw/dea83ea9cf4a8a6022bfc89a8ae8df5ab05b6dcc/pokemon.json";
let pokemonList = [];
let tempPokemonList = [];
let maxCPSortedList = [];

const Search = () => {
    const [term, setTerm] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [maxCombatToggle, setMaxCombatToggle] = useState(false);

    const fetchPokes = () => {
        fetch(URL_PATH)
            .then(response => response.json())
            .then(data => {
                pokemonList = data;
                maxCPSortedList = [...pokemonList]
                maxCPSortedList.sort((a, b) => b.MaxCP - a.MaxCP);
                console.log('logging bases on max cp');
                console.log(maxCPSortedList);
                setTerm('Pikachu');
            });
    }

    useEffect(() => {
        fetchPokes();
    },[]);

    const highlight = (text, highlight) => {
        // Split text on highlight term, include term itself into parts, ignore case
        const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
        return <span>{parts.map(part => part.toLowerCase() === highlight.toLowerCase() ? <b className="highlight">{part}</b> : part)}</span>;
    }

    useEffect(() => {
        let pokemonL
        let shortList = [];

        if (!maxCombatToggle){
            pokemonL = [...pokemonList];
        } else {
            pokemonL = [...maxCPSortedList];
        }

        for (let pokemon of pokemonL) {
            if (pokemon.Name.toLowerCase().indexOf(term.toLowerCase()) > -1){
                shortList.unshift(pokemon);
            }
            for (let pokeType of pokemon.Types) {
                if (pokeType.toLowerCase().indexOf(term.toLowerCase()) > -1) {
                    shortList.push(pokemon);
                }
            }
        };

        shortList = new Set(shortList.slice(0,4));
        tempPokemonList = [...shortList];
        setSearchResult(tempPokemonList);
    }, [term, maxCombatToggle]);

    const setCombatToggle = () => {
        if (!maxCombatToggle) {
            setMaxCombatToggle(true);
        } else {
            setMaxCombatToggle(false);
        }
    }

    const renderedResults = searchResult.map((pokemon) => {
        return (
            <React.Fragment key={pokemon.Number}>
                <li>
                    <img src={pokemon.img} alt={pokemon.Name} />
                    <div className="info">
                        <h1><span className="hl">{highlight(pokemon.Name, term)}</span></h1>
                        {pokemon.Types.map(type => (
                            <span className={`type ${type}`}>{highlight(type, term)}</span>
                        ))}
                    </div>
                </li>
            </React.Fragment>
        );
    });
    

    const missing = () => {
        if(searchResult.length === 0){
            return (
                <li>
                    <img src="https://cyndiquil721.files.wordpress.com/2014/02/missingno.png" alt="" />
                    <div className="info">
                        <h1 className="no-results">
                            No results
                        </h1>
                    </div>
                </li>
            )
        }
    };
    

    return (
        <React.Fragment>
                <label htmlFor="maxCP" className="max-cp">
                <input
                    onClick={setCombatToggle}
                    type="checkbox" 
                    id="maxCP" 
                />
                <small>
                    Maximum Combat Points
                </small>
            </label>
            <input
                value={term}
                onChange={e => setTerm(e.target.value)}
                type="text" 
                className="input" 
                placeholder="Pokemon or type" 
            />
            {/*<div className="loader"></div>*/}
            <ul className="suggestions">
                {renderedResults}
                {missing()}
            </ul>
        </React.Fragment>
    )
};

export default Search;