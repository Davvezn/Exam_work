import mongoose from 'mongoose';

const PokemonSchema = new mongoose.Schema({
    name: String,
    Type: [String],
    region: String
});

const Pokemon = mongoose.model('Pokemon', PokemonSchema);
export default Pokemon;