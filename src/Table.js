import React from 'react';
import './Table.css';
import numeral from 'numeral';

const Table = ({ countries }) => {
    return (
        <div className="table">
            {countries.map(({ country, cases }) => (
                <tr>
                    <td>{country}</td>
                    <td>
                        <strong>{numeral(cases).format('0,0')}</strong>
                    </td>
                </tr>
            ))}
        </div>
    );
};

export default Table;

// {countries.map(({ country }) => (
// <td>{cases}</td>
// <td>{country.country}</td>
// <strong>{numeral(country.cases).format('0,0')}</strong>
