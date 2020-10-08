import React, { useState, useEffect } from 'react';
import './App.css';
import { MenuItem, FormControl, Select, Card, CardContent } from '@material-ui/core';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import { sortData, prettyPrintStat } from './util';
import LineGraph from './LineGraph';
import 'leaflet/dist/leaflet.css';
import numeral from 'numeral';

// STATE = How to write a variable in React
// UseEffect = runrs a piece of code based on a given condition
// const [countries, setCountries] = useState(['USA', 'India', 'Russia']);

const App = () => {
    const [countries, setCountries] = useState([]);
    const [country, setCountry] = useState('worldwide');
    const [countryInfo, setCountryInfo] = useState({});
    const [tableData, setTableData] = useState([]);

    const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 }); // center of Pacific ocean
    const [mapZoom, setMapZoom] = useState(3);
    const [mapCountries, setMapCountries] = useState([]);

    const [casesType, setCasesType] = useState('cases');

    // to fix the issue with empty stats for worldwide dropdown option
    useEffect(() => {
        fetch('https://disease.sh/v3/covid-19/all')
            .then((response) => response.json())
            .then((data) => {
                setCountryInfo(data);
            });
    }, []);

    useEffect(() => {
        // async -> send a request, wait for it, do something with
        const getCountriesData = async () => {
            fetch('https://disease.sh/v3/covid-19/countries')
                .then((response) => response.json())
                .then((data) => {
                    const countries = data.map((country) => ({
                        name: country.country, // United Kingdom, United States, France
                        value: country.countryInfo.iso2, // UK, USA, FR
                    }));

                    let sortedData = sortData(data);
                    setCountries(countries);
                    // setTableData(data);
                    setTableData(sortedData);
                    setMapCountries(data);
                });
        };

        getCountriesData();
    }, []);

    // console.log(casesType);

    const onCountryChange = async (e) => {
        const countryCode = e.target.value;
        console.log('countryCode >>>', countryCode);
        const url =
            countryCode === 'worldwide'
                ? 'https://disease.sh/v3/covid-19/all'
                : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
        await fetch(url)
            .then((response) => response.json())
            .then((data) => {
                setCountry(countryCode);
                // All of the data from the country response
                setCountryInfo(data);
                setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
                setMapZoom(4);
            });
    };
    console.log('countryInfo >>>', countryInfo); // initially it's empty but after you choose a specific country in the dropdown - it's changed

    // API endpoint: https://disease.sh/v3/covid-19/countries

    return (
        <div className="app">
            <div className="app__left">
                <div className="app__header">
                    <h1>COVID-19 Tracker</h1>
                    <FormControl className="app__dropdown">
                        <Select variant="outlined" value={country} onChange={onCountryChange}>
                            <MenuItem value="worldwide">Worldwide</MenuItem>
                            {countries.map((country) => (
                                <MenuItem value={country.value}>{country.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <div className="app__stats">
                    <InfoBox
                        title="Coronavirus Cases"
                        onClick={(e) => setCasesType('cases')}
                        isRed
                        active={casesType === 'cases'}
                        cases={prettyPrintStat(countryInfo.todayCases)}
                        total={numeral(countryInfo.cases).format('0.0a')}
                    />
                    <InfoBox
                        title="Recovered"
                        onClick={(e) => setCasesType('recovered')}
                        active={casesType === 'recovered'}
                        cases={prettyPrintStat(countryInfo.todayRecovered)}
                        total={numeral(countryInfo.recovered).format('0.0a')}
                    />
                    <InfoBox
                        title="Deaths"
                        onClick={(e) => setCasesType('deaths')}
                        isRed
                        active={casesType === 'deaths'}
                        cases={prettyPrintStat(countryInfo.todayDeaths)}
                        total={numeral(countryInfo.deaths).format('0.0a')}
                    />
                </div>
                <Map
                    countries={mapCountries}
                    casesType={casesType}
                    center={mapCenter}
                    zoom={mapZoom}
                />
            </div>

            <Card className="app__right">
                <CardContent>
                    <div className="app__information">
                        <h3>Live Cases by Country</h3>
                        <Table countries={tableData} />
                        <h3 className="app__graphTitle">Worldwide new {casesType}</h3>
                        <LineGraph casesType={casesType} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default App;

// <Select variant="outlined" value="abc">
// Loop through all the coutries and show a drop down list of the options -> to do so: use state
// <MenuItem value="worldwide">Worldwide</MenuItem>
// <MenuItem value="worldwide">Option 1</MenuItem>
// <MenuItem value="worldwide">Option 2</MenuItem>
// <MenuItem value="worldwide">Option 3</MenuItem>

// <Select variant="outlined" value={country} onChange={onCountryChange}>
//    {countries.map((country) => (
//        <MenuItem value={country.value}>{country.name}</MenuItem>
//    ))}
// </Select>

// <MenuItem value={country}>{country}</MenuItem>

// cases={1234}
// total={2000}
// cases={countryInfo.todayCases}
// total={countryInfo.cases}

// <div className="app__right"></div>
// <h3>Worldwide new cases</h3>
// <LineGraph />
// <LineGraph className="app__graph" casesType={casesType} />
