import { useEffect, useRef, useState } from 'react';
import { SwipeableCard } from '../components/SwipeableCard';
import { Card, Direction, Movie, vote, voteResult } from '../util/util';
import axios from 'axios';
import { FaStar } from "react-icons/fa";
import { IoIosHeart } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { Box, HStack, Spinner, Center, Tag, TagLabel, VStack, Circle, Icon, Flex, TagCloseButton, Text, Stack, Select, Button, filter, Image, UnorderedList } from '@chakra-ui/react';

export const SwipePage: React.FC<{ sessionId: string, movies: Movie[], userId: string }> = (
    { sessionId, movies, userId }
) => {

    const url = 'https://4446-192-41-114-227.ngrok-free.app';
    const [filtered, setFiltered] = useState(movies);
    const [votes, setVotes] = useState([] as vote[]);
    const [voteList, setVoteList] = useState([] as voteResult[]);
    const [done, setDone] = useState(false);
    console.log(voteList);
    console.log(votes);


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
                            url: `${url}/api/session/winning-films`,
                            method: 'get',
                            params: { sessionId: sessionId },
                        });
                        setVoteList(results?.data?.winningFilmList as voteResult[]);

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
        setVotes([...votes, { filmId: movieId, match: dir }]);
        if (filtered.length < 2) {
            try {
                setDone(true);
                const res = await axios({
                    url: `${url}/api/session/vote`,
                    method: 'post',
                    data: {
                        sessionId: sessionId,
                        userId: userId,
                        votes: [...votes, { filmId: movieId, match: dir }]
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
                        }}
                    />
                ))}
                {filtered.length === 0 ? <Box>
                    {voteList?.length > 0 ?
                        <Box pl={2}>
                            {voteList.map((movie, index) => (
                                <Box display='column' key={index} p={2} m={4} borderRadius={16} bg='gray.100'><Text textAlign='center'>{movies.filter(m => m.filmId === movie.filmId)[0].title}</Text>
                                    <Center><HStack w='50%' mt={2} mb={2} justifyContent='center'>
                                        {movie.votes.map((vote, index) => {
                                            switch (vote) {
                                                case 0:
                                                    return <Icon as={MdClose} key={index} boxSize='2rem' color='red.400' />
                                                case 1:
                                                    return <Icon as={IoIosHeart} key={index} boxSize='2rem' color='green.400' />
                                                case 2:
                                                    return <Icon as={FaStar} key={index} boxSize='2rem' color='purple.400' />
                                            }
                                        })

                                        }
                                    </HStack>
                                    </Center>
                                </Box>
                            ))}
                        </Box>
                        : (
                            <Center mt={24}>
                                <VStack>
                                    <Spinner />
                                    <Text mt={6}>Waiting for others to finish..</Text>
                                </VStack>
                            </Center>)}

                </Box> : null}
            </Box>
            {filtered.length !== 0 ?
                <Flex justifyContent="space-between" mt={4} pl={8} pr={8} pt={4} gap={6}>
                    <Circle size="60px" bg={'gray.100'} onClick={() => handleSwipe(filtered[0].filmId, Direction.LEFT)}><Icon as={MdClose} w={6} h={6} color="red.400" /></Circle>
                    <Circle size="60px" bg={'gray.100'} onClick={() => handleSwipe(filtered[0].filmId, Direction.UP)}><Icon as={FaStar} w={6} h={6} color="purple.400" /></Circle>
                    <Circle size="60px" bg={'gray.100'} onClick={() => handleSwipe(filtered[0].filmId, Direction.RIGHT)}><Icon as={IoIosHeart} w={6} h={6} color="green.400" /></Circle>
                </Flex> : <Button onClick={() => window.location.reload()} ml={6} mr={6} borderRadius={16}>Back to menu</Button>}
        </>
    );
};