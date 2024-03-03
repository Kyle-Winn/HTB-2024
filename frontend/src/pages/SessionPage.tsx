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
import { Genre, Movie } from '../util/util';
import axios from 'axios';

export const SessionPage: React.FC<{ setMovies: (movies: Movie[]) => void, setSessionId: (id: string) => void, setUserId: (id: string) => void, movies: Movie[], sessionId: string, userId: string, start: () => void }> = (
    { setMovies, setSessionId, setUserId, userId, sessionId, movies, start }
) => {

    const url = 'http://localhost:8081';

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

    const createSession = async () => {
        try {
            const res = await axios({
                method: 'post',
                url: `${url}/api/session/create`,
                data: {
                    userSessionData: { maxUsers: 2 }
                },
            });
            setMovies(res.data.films);
            setSessionId(res.data.sessionId);
            setUserId(res.data.userId);
        } catch (error) {
            console.log(error)
        }
    }

    const startVoting = async () => {
        try {
            const res = await axios({
                method: 'post',
                url: `${url}/api/session/start-voting`,
                data: {
                    sessionId: sessionId
                }
            });
            console.log(res);
        } catch (error) {
            console.log(error);
        }
    }

    const [seshInput, setSeshInput] = useState('');
    const joinSession = async () => {
        try {
            const res = await axios({
                method: 'post',
                url: `${url}/api/session/add-user`,
                data: {
                    sessionId: seshInput
                }
            });
            setMovies(res.data.films);
            setSessionId(seshInput);
            setUserId(res.data.userId);
        } catch(err) {
            console.error(err);
        }
    }

    return (
        <>
            {!sessionId ? (
                <>
                    <Button w='100%' onClick={createSession}>Create new session</Button>
                    <Text>or</Text>
                    <Input placeholder='Enter session ID' textAlign='center' onChange={(e) => setSeshInput(e.target.value)} />
                    <Button w='100%' onClick={joinSession}>Join session</Button></>)
                : <Box>
                    <Text>Your session ID:</Text>
                    <Text>{sessionId}</Text>
                </Box>}

            {sessionId ? (
                <>
                    <Text>Genre:</Text>
                    <Box mb={10}>
                        {genres.map((genre) => (<Tag size='lg' key={genre.genre} variant='subtle' colorScheme='cyan'>
                            <TagLeftIcon boxSize='12px' as={genre.selected ? AddIcon : CloseIcon} onClick={() => handleGenreClick(genre.genre)} />
                            <TagLabel>{genre.genre}</TagLabel>
                        </Tag>))}
                    </Box>
                    <Button w='100%'
                    onClick={() => {start(); startVoting();}}
                    >
                        Start
                    </Button>
                </>
            ) : null}
        </>
    )
}

