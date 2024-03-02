import { useState } from 'react';
import { SwipeableCard } from '../components/SwipeableCard';
import { Card, Movie } from '../util/util';
import axios from 'axios';
import { FaStar } from "react-icons/fa";
import { IoIosHeart } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { Box, HStack, Tag, TagLabel, Circle, Icon, Flex, TagCloseButton, Text, Stack, Select, Button, filter, Image } from '@chakra-ui/react';

export const SwipePage: React.FC<{ sessionId: string, movies: Movie[], userId: string }> = (
    { sessionId, movies, userId }
) => {


    const [filtered, setFiltered] = useState(movies);

    const handleSwipe = (movieId: string) => {
        setFiltered(filtered.filter(movie => 
           movie.filmId != movieId
        ))
    };

    return (
        <>
            <HStack spacing={4} mb={6} justifyContent='flex-start' w='100%' m={4}>
                <Image />
            </HStack>
            <Box position='relative' h={{ base: '75vh', md: '800px' }} w={{ base: '90vw', md: '600px' }}>
                {filtered.map((movie, index) => (
                    <SwipeableCard key={movie.filmId} onSwipe={() => handleSwipe(movie.filmId)} movie={movie}
                        style={{
                            position: 'absolute',
                            top: `${index * 5}px`,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            zIndex: movies.length - index,
                        }} />
                ))}
                {filtered.length === 0 && <Text fontSize='2xl' fontWeight='bold' color='gray.500' position='absolute' top='50%' left='50%' transform='translate(-50%, -50%)'>No more movies to swipe!</Text>}
            </Box>
            <Flex justifyContent="space-between" mt={4} pl={8} pr={8} pt={4} gap={6}>
                <Circle size="60px" bg={'gray.100'} ><Icon as={MdClose} w={6} h={6} color="red.400" /></Circle>
                <Circle size="60px" bg={'gray.100'} ><Icon as={FaStar} w={6} h={6} color="purple.400" /></Circle>
                <Circle size="60px" bg={'gray.100'} ><Icon as={IoIosHeart} w={6} h={6} color="green.400" /></Circle>
            </Flex>
        </>
    );
};