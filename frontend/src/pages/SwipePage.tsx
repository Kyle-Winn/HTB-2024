import { useEffect, useState } from 'react';
import { SwipeableCard } from '../components/SwipeableCard';
import { Card, Direction, Movie, vote } from '../util/util';
import axios from 'axios';
import { FaStar } from "react-icons/fa";
import { IoIosHeart } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { Box, HStack, Tag, TagLabel, Circle, Icon, Flex, TagCloseButton, Text, Stack, Select, Button, filter, Image } from '@chakra-ui/react';

export const SwipePage: React.FC<{ sessionId: string, movies: Movie[], userId: string }> = (
    { sessionId, movies, userId }
) => {

    const [filtered, setFiltered] = useState(movies);
    const [votes, setVotes] = useState([] as vote[]);
    const [voteList, setVoteList] = useState([] as vote[]);

    console.log(votes);


    useEffect(() => {
            const intervalId = setInterval(async () => {
                // Check for your desired event here (replace with your event condition)
                if (voteList.length > 0) {
                    clearInterval(intervalId); // Stop the loop after the event occurs

                } else {
                    if (filtered.length <= 1) {
                    const results = await axios({
                        url: 'http://localhost:8081/api/session/winning-films',
                        method: 'get',
                        data: {
                            sessionId: sessionId,
                        }
                    });
                    setVoteList(results.data);
                    console.log(results);
                } else {
                    console.log("No winning film yet")
                }
                }
            }, 3000);

            return () => clearInterval(intervalId);
    }, []);

    const handleSwipe = async (movieId: string, dir: Direction) => {
        setFiltered(filtered.filter(movie =>
            movie.filmId != movieId
        ))
        setVotes([...votes, { filmId: movieId, match: dir == Direction.RIGHT }]);
        console.log(filtered.length);
        if (filtered.length <= 1) {
            try {
                const res = await axios({
                    url: 'http://localhost:8081/api/session/vote',
                    method: 'post',
                    data: {
                        sessionId: sessionId,
                        userId: userId,
                        votes: votes
                    }
                });
                console.log(res);
            } catch (err) {
                console.error(err);
            }
        };
    };

    return (
        <>
            <HStack spacing={4} mb={6} justifyContent='flex-start' w='100%' m={4}>
                <Image />
            </HStack>
            <Box position='relative' h={{ base: '75vh', md: '800px' }} w={{ base: '90vw', md: '600px' }}>
                {filtered.map((movie, index) => (
                    <SwipeableCard key={movie.filmId} onSwipe={(dir: Direction) => handleSwipe(movie.filmId, dir)} movie={movie}
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