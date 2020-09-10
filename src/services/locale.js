'use strict';

const i18n = require('i18n');

const getPokemonName = (pokemonId) => {
    return i18n.__('poke_' + pokemonId);
};

module.exports = {
    getPokemonName
};