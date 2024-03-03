import { useEffect, useState } from 'react';
import { SwipeableCard } from '../components/SwipeableCard';
import { Card, Direction, Movie, vote } from '../util/util';
import axios from 'axios';
import { FaStar } from "react-icons/fa";
import { IoIosHeart } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { Box, HStack, Spinner, Tag, TagLabel, Circle, Icon, Flex, TagCloseButton, Text, Stack, Select, Button, filter, Image, UnorderedList } from '@chakra-ui/react';

export const SwipePage: React.FC<{ sessionId: string, movies: Movie[], userId: string }> = (
    { sessionId, movies, userId }
) => {

    const [filtered, setFiltered] = useState(movies);
    const [votes, setVotes] = useState([] as vote[]);
    const [voteList, setVoteList] = useState([] as vote[]);
    const [done, setDone] = useState(false);
    console.log(voteList)

    useEffect(() => {
        if (done) {
            const intervalId = setInterval(async () => {
                // Check if the winning movie is already fetched
                if (voteList?.length > 0) {
                    // Clear the interval immediately to stop further iterations
                    clearInterval(intervalId);
                } else {
                    try {
                        const results = await axios({
                            url: 'http://localhost:8081/api/session/winning-films',
                            method: 'get',
                            params: { sessionId: sessionId },
                        });
                        setVoteList(results?.data?.winningFilmList);

                        // If the API successfully returns a winning movie, set done to false
                        // and clear the interval
                        if (results.data?.winningFilmList?.length > 0) {
                            setDone(false);
                            clearInterval(intervalId);
                        }
                    } catch (error) {
                        console.error('Error fetching winning films:', error);
                        // Handle errors gracefully, such as retrying or displaying an error message
                    }
                }
            }, 3000);

            return () => clearInterval(intervalId);
        }
    }, [done]);


    const handleSwipe = async (movieId: string, dir: Direction) => {
        setFiltered(filtered.filter(movie =>
            movie.filmId != movieId
        ))
        setVotes([...votes, { filmId: movieId, votes: Direction.RIGHT }]);
        if (filtered.length < 2) {
            try {
                setDone(true);
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
                {filtered.length === 0 ? <Box>
                    {voteList?.length > 0 ?
                        <UnorderedList>
                            {voteList.map((movie, index) => (
                                <li key={index}>
                                    <Box>
                                        <Text>{movies.filter(m => m.filmId === movie.filmId)[0].title}</Text><Text>{movie.votes}</Text>
                                    </Box>
                                </li>
                            ))}
                        </UnorderedList>
                        : (
                            <Box>
                                <Spinner />
                            </Box>)}

                </Box> : null}
            </Box>
            <Flex justifyContent="space-between" mt={4} pl={8} pr={8} pt={4} gap={6}>
                <Circle size="60px" bg={'gray.100'} ><Icon as={MdClose} w={6} h={6} color="red.400" /></Circle>
                <Circle size="60px" bg={'gray.100'} ><Icon as={FaStar} w={6} h={6} color="purple.400" /></Circle>
                <Circle size="60px" bg={'gray.100'} ><Icon as={IoIosHeart} w={6} h={6} color="green.400" /></Circle>
            </Flex>
        </>
    );
};