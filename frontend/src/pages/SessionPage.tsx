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
    Spinner,
    Center,
    VStack,
    Circle,
    Image
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import { Genre, Movie } from '../util/util';
import axios from 'axios';
import popcorn from '../img/popcorn.png';

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
            genre: 'Comedy',
            selected: false
        },
        {   
            genre: 'Drama',
            selected: false
        },
        {
            genre: 'Horror',
            selected: false
        },
        {
            genre: 'Sci-fi',
            selected: false
        },
        {
            genre: 'Thriller',
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

    const [selectedGenres, setSelectedGenres] = useState(genres as Genre[]);

    const handleGenreClick = (genre: string) => {
        setSelectedGenres(updateGenreSelection(genre, selectedGenres));
    };

    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (sessionId) {
            const intervalId = setInterval(async () => {
                try {
                    const res = await axios({
                        method: 'get',
                        url: `${url}/api/session/voting-started`,
                        params: {
                            sessionId: sessionId
                        }
                    });
                    console.log(res);
                    if (res.data.votingStarted) {
                        clearInterval(intervalId);
                        start();
                    }
                } catch (error) {
                    console.log(error);
                }
            }, 3000);
            return () => clearInterval(intervalId);
        }
    });

    const createSession = async () => {
        try {
            const res = await axios({
                method: 'post',
                url: `${url}/api/session/create`,

            });
            setMovies(res.data.films);
            setSessionId(res.data.sessionId);
            setIsAdmin(true);
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
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <>
            <Image src={popcorn} w='40vw' objectFit='contain' mb={16} />
            {!sessionId ? (
                <>
                    <Button w='100%' onClick={createSession} bg='#FF292D' color='whiteAlpha.900' borderRadius={16}>Create new session</Button>
                    <Text fontSize='sm' color='gray.500'>or</Text>
                    <Input placeholder='Enter session ID' borderRadius={16} textAlign='center' onChange={(e) => setSeshInput(e.target.value)} />
                    <Button w='100%' onClick={joinSession} borderRadius={16}>Join session</Button></>)
                : <Box>
                    <Text fontSize='md' textAlign='center'>Share this code with your friends:</Text>
                    <Text fontSize='5xl' textAlign='center'>{sessionId}</Text>
                </Box>}

            {sessionId ? (
                <>
                    <Text mt={12}>Genre:</Text>
                    <Box mb={10} m={6}>
                        {selectedGenres.map((genre) => (<Tag size='lg' key={genre.genre} variant='subtle' colorScheme={genre.selected ? 'green' : 'gray'} m={1} onClick={() => handleGenreClick(genre.genre)}>
                            <TagLeftIcon boxSize='12px' as={genre.selected ? CloseIcon : AddIcon}  />
                            <TagLabel>{genre.genre}</TagLabel>
                        </Tag>))}
                    </Box>
                    {isAdmin ? (
                        <Button w='80vw' m={6} bg='#FF292D' color='whiteAlpha.900' borderRadius={16}
                            onClick={() => { start(); startVoting(); }}
                        >
                            Start
                        </Button>) : (<Center><VStack><Spinner /><Text>Waiting for start</Text></VStack></Center>)}
                </>
            ) : null}
        </>
    )
}

