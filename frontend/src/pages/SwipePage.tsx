import { useState } from 'react';
import { SwipeableCard } from '../components/SwipeableCard';
import { Card, Movie } from '../util/util';
import axios from 'axios';
import { Box, HStack, Tag, TagLabel, TagCloseButton, Text, Stack, Select, Button } from '@chakra-ui/react';
import { genres } from '../util/util';

export const SwipePage: React.FC<{ sessionId: string }> = (
    { sessionId }
  ) => {
    const [movies, setMovies] = useState([
        {
            id: 'dfhjkgdfjhgkj',
            title: 'Bee movie lmao',
            rating: 2,
            year: 2007,
            image: 'https://m.media-amazon.com/images/M/MV5BMjE1MDYxOTA4MF5BMl5BanBnXkFtZTcwMDE0MDUzMw@@._V1_SX300.jpg', // URL of your movie poster
            tags: ['boring', 'animation', 'comedy', 'cringe']
        }
    ] as Movie[]);

    const handleSwipe = async (cardId: string) => {
        const filtered = movies.filter(movie => movie.id !== cardId);
        setMovies(filtered);
        if (movies.length <= 1) {
            await fetchMovies();
        }
    };

    const fetchMovies = async () => {
        try {
            const res = await axios({
                method: 'get',
                url: 'http://localhost:8081/',
            })

            const data = res.data;
            setMovies([...movies, ...data] as Movie[]);
            console.log('Fetched more cards');
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <HStack spacing={4} mb={6} justifyContent='flex-start' w='100%' m={4}>
                <Text fontWeight='bold'>Session:</Text>
                <Text>{sessionId}</Text>
            </HStack>
            <Box position='relative' h={{ base: '90vh', md: '800px' }} w={{ base: '90vw', md: '600px' }}>
                {movies.map((movie, index) => (
                    <SwipeableCard key={movie.id} onSwipe={() => handleSwipe(movie.id)} movie={movie}
                        style={{
                            position: 'absolute',
                            top: `${index * 20}px`,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            zIndex: movies.length - index,
                        }} />
                ))}
            </Box>
        </>
    );
};