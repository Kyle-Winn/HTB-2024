import {
    Button,
    Select,
    Stack,
    Tag,
    TagCloseButton,
    TagLeftIcon,
    TagLabel,
    Box,
    Text,
    Input,
} from '@chakra-ui/react';
import { useState } from 'react';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import { Genre } from '../util/util';

export const SessionPage: React.FC = () => {

const genres = [
    {
        genre: 'Action',
        selected: false
    },
    {
        genre: 'Adventure',
        selected: false
    },
];

const usersCount = 4;
const sessionId = '1234'

const updateGenreSelection = (genreToUpdate: string, allGenres: Genre[]) => {
    // Create a copy of the original state to avoid mutations
    const updatedGenres = [...allGenres];

    // Find the index of the genre to update
    const genreIndex = updatedGenres.findIndex(
        (genre) => genre.genre === genreToUpdate
    );

    // If the genre is found, toggle its 'selected' property
    if (genreIndex !== -1) {
        updatedGenres[genreIndex].selected = !updatedGenres[genreIndex].selected;
    } else {
        // Handle potential errors if the genre is not found (optional)
        console.warn(`Genre "${genreToUpdate}" not found in the list.`);
    }

    return updatedGenres;
};

    const [selectedGenres, setSelectedGenres] = useState(genres);

    const handleGenreClick = (genre: string) => {
        setSelectedGenres(updateGenreSelection(genre, selectedGenres));
    };


    return (
        <>
            <Text></Text>
            <Button w='100%'>Create new session</Button>
            <Text>or</Text>
            <Input placeholder='Enter session ID' textAlign='center' />
            <Button w='100%'>Join session</Button>

            {sessionId ? (
                <>
            <Text>Genre:</Text>
            <Box mb={10}>
                {genres.map((genre) => (<Tag size='lg' key={genre.genre} variant='subtle' colorScheme='cyan'>
                    <TagLeftIcon boxSize='12px' as={genre.selected ? AddIcon : CloseIcon} onClick={() => handleGenreClick(genre.genre)} />
                    <TagLabel>{genre.genre}</TagLabel>
                </Tag>))}
            </Box>
            <Text>Users: </Text>
            <Text>{usersCount}</Text>

            <Button w='100%'
            >
                Start
            </Button>
            </>
            ) : null}
        </>
    )
}

