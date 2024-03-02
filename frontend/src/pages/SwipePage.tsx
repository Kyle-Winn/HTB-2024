import { useState } from 'react';
import { SwipeableCard } from '../components/SwipeableCard';
import { Card, Movie } from '../util/util';
import axios from 'axios';
import { Box, HStack, Tag, TagLabel, TagCloseButton, Text, Stack, Select, Button } from '@chakra-ui/react';

export const SwipePage: React.FC<{ sessionId: string, movies: Movie[], userId: string }> = (
    { sessionId, movies, userId }
  ) => {

    const [filtered, setFiltered] = useState(movies);
   
    const handleSwipe = async (cardId: string) => {
        const filtered = movies.filter(movie => movie.id !== cardId);
        setFiltered(filtered);
    };

    return (
        <>
            <HStack spacing={4} mb={6} justifyContent='flex-start' w='100%' m={4}>
                <Text fontWeight='bold'>Session:</Text>
                <Text>{sessionId}</Text>
            </HStack>
            <Box position='relative' h={{ base: '90vh', md: '800px' }} w={{ base: '90vw', md: '600px' }}>
                {movies.map((movie, index) => (
                    <SwipeableCard key={movie.filmId} onSwipe={() => handleSwipe(movie.filmId)} movie={movie}
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